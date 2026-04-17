"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRINTER_SERVICE_UUIDS: BluetoothServiceUUID[] = [
  "000018f0-0000-1000-8000-00805f9b34fb",
  "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
  "0000fee7-0000-1000-8000-00805f9b34fb",
];

const SAVED_PRINTER_NAME_KEY = "pos_saved_printer_name";
const SAVED_PRINTER_ID_KEY = "pos_saved_printer_id";
const BLE_CHUNK_SIZE = 100;
const BLE_CHUNK_DELAY_MS = 80;
const AUTO_RECONNECT_DELAY_MS = 2000; // wait 2s before retrying after disconnect

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
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [savedPrinterName, setSavedPrinterName] = useState<string | null>(null);

  const deviceRef = useRef<BluetoothDevice | null>(null);
  const disconnectListenerRef = useRef<(() => void) | null>(null);
  // Guard to prevent multiple concurrent reconnect attempts
  const reconnectingRef = useRef(false);

  // ─── Core: attach to a device and get the writable characteristic ───────────

  const attachToDevice = useCallback(
    async (device: BluetoothDevice, silent = false): Promise<boolean> => {
      if (!device.gatt) return false;
      try {
        const server = await device.gatt.connect();
        const writeChar = await getWriteCharacteristic(server);

        // Cleanup previous listener before attaching a new one
        if (deviceRef.current && disconnectListenerRef.current) {
          deviceRef.current.removeEventListener(
            "gattserverdisconnected",
            disconnectListenerRef.current,
          );
        }

        const handleDisconnect = () => {
          setCharacteristic(null);
          if (!reconnectingRef.current) {
            toast.error("Koneksi printer terputus. Menghubungkan ulang...", {
              id: "bt-disconnect",
            });
            // Auto-reconnect: wait 2s then try silent reconnect
            reconnectingRef.current = true;
            setIsReconnecting(true);
            setTimeout(() => {
              void (async () => {
                const success = await attachToDevice(device, true);
                reconnectingRef.current = false;
                setIsReconnecting(false);
                if (success) {
                  toast.success("Printer terhubung kembali!", {
                    id: "bt-disconnect",
                  });
                } else {
                  toast.error(
                    "Gagal terhubung ulang. Hubungkan printer secara manual.",
                    { id: "bt-disconnect" },
                  );
                }
              })();
            }, AUTO_RECONNECT_DELAY_MS);
          }
        };

        disconnectListenerRef.current = handleDisconnect;
        deviceRef.current = device;
        device.addEventListener("gattserverdisconnected", handleDisconnect);

        setCharacteristic(writeChar);

        // Persist device info for page-reload reconnect
        if (device.name) {
          setSavedPrinterName(device.name);
          localStorage.setItem(SAVED_PRINTER_NAME_KEY, device.name);
        }
        // Store device.id for getDevices() matching on page reload
        if (device.id) {
          localStorage.setItem(SAVED_PRINTER_ID_KEY, device.id);
        }

        if (!silent) {
          toast.success(`Terhubung ke ${device.name ?? "Printer"}!`, {
            id: "bt-connect",
          });
        }
        return true;
      } catch {
        return false;
      }
    },
    // Intentional empty deps: attachToDevice is stable by design (refs-only closures)
    [],
  );

  // ─── Auto-reconnect on page load via getDevices() ────────────────────────────
  // navigator.bluetooth.getDevices() returns devices the user has previously
  // granted permission to — no user gesture required, making silent reconnect possible.

  useEffect(() => {
    const savedName = localStorage.getItem(SAVED_PRINTER_NAME_KEY);
    if (savedName) setSavedPrinterName(savedName);

    const tryAutoReconnect = async () => {
      if (!navigator.bluetooth) return;

      // getDevices() is the Chrome API for permitted (previously paired) devices.
      // It's not in the TypeScript lib types yet, so we extend Bluetooth interface.
      interface BluetoothWithGetDevices extends Bluetooth {
        getDevices(): Promise<BluetoothDevice[]>;
      }
      const bt = navigator.bluetooth as BluetoothWithGetDevices;
      if (typeof bt.getDevices !== "function") return;

      const savedId = localStorage.getItem(SAVED_PRINTER_ID_KEY);
      const savedPrinterNameLS = localStorage.getItem(SAVED_PRINTER_NAME_KEY);
      if (!savedId && !savedPrinterNameLS) return;

      try {
        const devices = await bt.getDevices();
        if (devices.length === 0) return;

        // Match by ID first (most reliable), then by name
        const target =
          devices.find((d) => d.id === savedId) ??
          devices.find((d) => d.name === savedPrinterNameLS);

        if (!target) return;

        console.log(`[BT] Auto-reconnecting to "${target.name ?? target.id}"…`);
        const ok = await attachToDevice(target, true);
        if (ok) {
          toast.success(
            `Printer "${target.name ?? "Printer"}" terhubung otomatis!`,
            { duration: 2500 },
          );
        }
      } catch (err) {
        console.warn("[BT] Auto-reconnect failed:", err);
      }
    };

    void tryAutoReconnect();
    // Intentional empty deps: only run on mount, attachToDevice is stable
  }, []);

  // ─── Manual connect (user gesture required) ──────────────────────────────────

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
      await attachToDevice(device, false);
    } catch (error: unknown) {
      toast.error(translateBluetoothError(error), { id: "bt-connect" });
    }
  }, [attachToDevice]);

  // ─── Print ───────────────────────────────────────────────────────────────────

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

  // ─── Disconnect (manual) ─────────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    // Clear saved device so auto-reconnect won't fire on next page load
    localStorage.removeItem(SAVED_PRINTER_ID_KEY);
    localStorage.removeItem(SAVED_PRINTER_NAME_KEY);
    setSavedPrinterName(null);

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
    isReconnecting,
    savedPrinterName,
    isPrinting,
    connect,
    disconnect,
    printReceipt,
  };
};
