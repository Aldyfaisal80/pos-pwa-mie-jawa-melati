import { TRPCError } from "@trpc/server";
import type { TRPC_ERROR_CODE_KEY } from "@trpc/server";

export class ErrorTRPCService {
  /**
   * Menghasilkan pesan error yang user-friendly berdasarkan kode error.
   * @param code Kode Error tRPC (misal: NOT_FOUND, BAD_REQUEST)
   * @param field Konteks tambahan (misal: nama field atau entitas yang error)
   */
  static generateMessage(code: TRPC_ERROR_CODE_KEY, field?: string): string {
    // Default context jika tidak ada field yang dikirim
    const context = field ? `(${field})` : "";

    switch (code) {
      case "BAD_REQUEST":
        return `Permintaan tidak valid. Mohon periksa kembali data input Anda ${context}.`;

      case "PARSE_ERROR":
        return `Terjadi kesalahan saat memproses data server ${context}.`;

      case "INTERNAL_SERVER_ERROR":
        return `Terjadi kesalahan internal pada server. Silakan coba lagi nanti ${context}.`;

      case "NOT_IMPLEMENTED":
        return `Fitur ini belum tersedia atau belum diimplementasikan ${context}.`;

      case "BAD_GATEWAY":
        return `Respon tidak valid dari server upstream ${context}.`;

      case "SERVICE_UNAVAILABLE":
        return `Layanan sedang tidak tersedia saat ini. Mohon coba beberapa saat lagi ${context}.`;

      case "GATEWAY_TIMEOUT":
        return `Waktu tunggu server habis (Gateway Timeout) ${context}.`;

      case "UNAUTHORIZED":
        return `Anda tidak memiliki izin untuk mengakses sumber daya ini (Unauthorized) ${context}.`;

      case "PAYMENT_REQUIRED":
        return `Pembayaran diperlukan untuk mengakses fitur ini ${context}.`;

      case "FORBIDDEN":
        return `Akses ditolak. Anda tidak memiliki hak akses yang cukup ${context}.`;

      case "NOT_FOUND":
        return `Data yang Anda cari tidak ditemukan ${context}.`;

      case "METHOD_NOT_SUPPORTED":
        return `Metode permintaan tidak didukung ${context}.`;

      case "TIMEOUT":
        return `Waktu permintaan habis. Koneksi mungkin lambat ${context}.`;

      case "CONFLICT":
        return `Terjadi konflik data. Data mungkin sudah ada atau sedang diubah ${context}.`;

      case "PRECONDITION_FAILED":
        return `Syarat ketentuan proses tidak terpenuhi ${context}.`;

      case "PAYLOAD_TOO_LARGE":
        return `Ukuran data yang dikirim terlalu besar ${context}.`;

      case "UNSUPPORTED_MEDIA_TYPE":
        return `Format media/file tidak didukung ${context}.`;

      case "UNPROCESSABLE_CONTENT":
        return `Konten tidak dapat diproses meskipun formatnya benar ${context}.`;

      case "TOO_MANY_REQUESTS":
        return `Terlalu banyak permintaan dalam waktu singkat. Mohon tunggu sebentar ${context}.`;

      case "CLIENT_CLOSED_REQUEST":
        return `Permintaan dibatalkan oleh klien/browser ${context}.`;

      default:
        return `Terjadi kesalahan yang tidak diketahui ${context}.`;
    }
  }

  /**
   * Helper untuk melempar error tRPC secara langsung.
   */
  static throw(
    code: TRPC_ERROR_CODE_KEY,
    field?: string,
    cause?: unknown,
  ): never {
    throw new TRPCError({
      code,
      message: this.generateMessage(code, field),
      cause,
    });
  }
}
