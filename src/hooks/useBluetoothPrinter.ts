"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRINTER_SERVICE_UUIDS: BluetoothServiceUUID[] = [
  "000018f0-0000-1000-8000-00805f9b34fb",
  "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
  "0000fee7-0000-1000-8000-00805f9b34fb",
];

const SAVED_PRINTER_KEY = "pos_saved_printer_name";
const BLE_CHUNK_SIZE = 100;
const BLE_CHUNK_DELAY_MS = 50;

// ─── Pure Helpers (no React state) ────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const translateBluetoothError = (error: unknown): string => {
  if (!(error instanceof Error)) return "Terjadi kesalahan tidak diketahui.";
  const msg = error.message.toLowerCase();
  if (msg.includes("cancel") || msg.includes("cancelled"))
    return "Koneksi dibatalkan.";
  if (msg.includes("not found") || msg.includes("no devices"))
    return "Printer tidak ditemukan. Pastikan printer dalam mode pairing.";
  if (msg.includes("not in range") || msg.includes("connection failed"))
    return "Printer tidak terjangkau. Dekatkan printer ke perangkat.";
  if (msg.includes("adapter") || msg.includes("bluetooth is disabled"))
    return "Bluetooth tidak aktif. Mohon aktifkan Bluetooth perangkat.";
  if (msg.includes("gatt"))
    return "Koneksi ke printer gagal. Coba matikan dan nyalakan printer.";
  if (msg.includes("invalid state"))
    return "Printer tidak siap. Silakan hubungkan kembali.";
  if (msg.includes("network"))
    return "Koneksi Bluetooth terputus. Coba cetak ulang.";
  return error.message;
};

const getWriteCharacteristic = async (
  server: BluetoothRemoteGATTServer,
): Promise<BluetoothRemoteGATTCharacteristic> => {
  for (const uuid of PRINTER_SERVICE_UUIDS) {
    try {
      const service = await server.getPrimaryService(uuid);
      const chars = await service.getCharacteristics();
      const writable = chars.find(
        (c) => c.properties.write || c.properties.writeWithoutResponse,
      );
      if (writable) return writable;
    } catch {
      // UUID not supported by this device — try next
    }
  }
  throw new Error("Service print tidak ditemukan di perangkat ini.");
};

const writeChunk = (
  char: BluetoothRemoteGATTCharacteristic,
  chunk: Uint8Array,
): Promise<void> => {
  const buf = chunk.buffer.slice(chunk.byteOffset, chunk.byteOffset + chunk.byteLength) as ArrayBuffer;
  return char.properties.writeWithoutResponse
    ? char.writeValueWithoutResponse(buf)
    : char.writeValue(buf);
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useBluetoothPrinter = () => {
  const [characteristic, setCharacteristic] =
    useState<BluetoothRemoteGATTCharacteristic | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [savedPrinterName, setSavedPrinterName] = useState<string | null>(null);

  const deviceRef = useRef<BluetoothDevice | null>(null);
  const disconnectListenerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SAVED_PRINTER_KEY);
    if (saved) setSavedPrinterName(saved);
  }, []);

  const connect = useCallback(async () => {
    if (!navigator.bluetooth) {
      toast.error("Web Bluetooth tidak didukung. Gunakan Chrome/Edge.");
      return;
    }

    try {
      toast.loading("Memilih printer...", { id: "bt-connect" });
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: PRINTER_SERVICE_UUIDS,
      });

      toast.loading("Menghubungkan...", { id: "bt-connect" });
      if (!device.gatt) throw new Error("Perangkat tidak mendukung GATT.");
      const server = await device.gatt.connect();
      const writeChar = await getWriteCharacteristic(server);

      // Cleanup listener lama sebelum daftarkan yang baru
      if (deviceRef.current && disconnectListenerRef.current) {
        deviceRef.current.removeEventListener(
          "gattserverdisconnected",
          disconnectListenerRef.current,
        );
      }
      const handleDisconnect = () => {
        setCharacteristic(null);
        toast.error("Koneksi printer terputus.", { id: "bt-disconnect" });
      };
      disconnectListenerRef.current = handleDisconnect;
      deviceRef.current = device;
      device.addEventListener("gattserverdisconnected", handleDisconnect);

      setCharacteristic(writeChar);
      if (device.name) {
        setSavedPrinterName(device.name);
        localStorage.setItem(SAVED_PRINTER_KEY, device.name);
      }

      toast.success(`Terhubung ke ${device.name ?? "Printer"}!`, {
        id: "bt-connect",
      });
    } catch (error: unknown) {
      toast.error(translateBluetoothError(error), { id: "bt-connect" });
    }
  }, []);

  const printReceipt = useCallback(
    async (data: Uint8Array) => {
      if (!characteristic) {
        toast.error("Harap hubungkan printer terlebih dahulu!");
        return;
      }

      setIsPrinting(true);
      const toastId = toast.loading("Mencetak struk...");
      try {
        for (let i = 0; i < data.length; i += BLE_CHUNK_SIZE) {
          await writeChunk(characteristic, data.slice(i, i + BLE_CHUNK_SIZE));
          await delay(BLE_CHUNK_DELAY_MS);
        }
        toast.success("Struk berhasil dicetak!", { id: toastId });
      } catch (error: unknown) {
        if (!deviceRef.current?.gatt?.connected) setCharacteristic(null);
        toast.error(translateBluetoothError(error), { id: toastId });
      } finally {
        setIsPrinting(false);
      }
    },
    [characteristic],
  );

  const disconnect = useCallback(() => {
    if (deviceRef.current && disconnectListenerRef.current) {
      deviceRef.current.removeEventListener(
        "gattserverdisconnected",
        disconnectListenerRef.current,
      );
      disconnectListenerRef.current = null;
    }
    deviceRef.current?.gatt?.disconnect();
    deviceRef.current = null;
    setCharacteristic(null);
    toast.success("Printer diputuskan.");
  }, []);

  return {
    isConnected: !!characteristic,
    savedPrinterName,
    isPrinting,
    connect,
    disconnect,
    printReceipt,
  };
};
