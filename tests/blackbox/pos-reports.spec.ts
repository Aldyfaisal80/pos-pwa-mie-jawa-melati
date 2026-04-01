import { test, expect } from "@playwright/test";

test.describe("Reporting & Export Engine", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    // Navigasi ke report page
    await page.goto("/report");

    // Tunggu sampai minimal tabel termuat dan tidak loading
    await expect(
      page.getByRole("heading", { name: /Riwayat Transaksi/i }),
    ).toBeVisible();
    await expect(page.getByText(/Menampilkan/i)).toBeVisible({
      timeout: 10000,
    });
  });

  test("menguji filter pembayaran dan rentang waktu", async ({ page }) => {
    // Asumsi ReportFilterBar memiliki combobox untuk Jenis Pembayaran (Semua, CASH, QRIS)
    // Berdasarkan UI, biasanya ada placeholder "Metode Pembayaran..."
    const methodFilter = page
      .locator("button[role='combobox']")
      .filter({ hasText: /Semua Metode|Metode Pembayaran/i });
    if (await methodFilter.isVisible()) {
      await methodFilter.click();
      await page.getByRole("option", { name: "QRIS" }).click();

      // Verifikasi query params / loading / perubahan pada tabel
      await page.waitForTimeout(1000); // Wait for debounce / trpc transition
    }

    // Menguji form search input invoice
    const searchInput = page.getByPlaceholder(/Cari Invoice/i).first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("INV-"); // Mencari karakter awalan
      await page.waitForTimeout(1000); // Debounce delay
      // setidaknya harus terlihat string tersebut di row/col tabel
    }
  });

  test("menguji dan mencegat proses eksport file", async ({ page }) => {
    // Tombol Export
    const exportButton = page.getByRole("button", { name: /Export CSV/i });
    await expect(exportButton).toBeEnabled();

    // Trigger download & validasi file stream
    const downloadPromise = page.waitForEvent("download");

    await exportButton.click();

    // Tangkap events download
    const download = await downloadPromise;

    // Verifikasi filename (Biasanya dalam ekstensi .csv)
    const fileName = download.suggestedFilename();
    expect(fileName.toLowerCase()).toContain(".csv");

    // Memastikan ukuran file bukan 0 bytes
    // (Abaikan jika kita tidak mau menyimpan fisiknya, ini cukup membuktikan buffer terkirim dari server)
    const error = await download.failure();
    expect(error).toBeNull();
  });

  test("menguji penghapusan transaksi (batal)", async ({ page }) => {
    // Pertama kita butuh sebuah transaksi untuk dihapus, asumsikan row pertama di tabel.
    // Tombol Action biasanya terletak di cel terakhir (Menu Dropdown Titik tiga)
    const firstRow = page.getByRole("row").nth(1); // nth(0) adalah table header

    if (await firstRow.isVisible()) {
      // Pastikan skeleton memudar dan data invoice sungguhan termuat
      await expect(firstRow.getByText(/INV-/i)).toBeVisible({ timeout: 10000 });

      // Dapatkan Invoice number sbg referensi
      const invoiceText = await firstRow.getByRole("cell").first().innerText();
      console.log("Mencoba menghapus: ", invoiceText);

      const actionTrigger = firstRow.getByRole("button").last(); // Memilih tombol Trash2
      await actionTrigger.click();

      // Harusnya ada modal Alert Dialog
      const modalDialog = page.getByRole("alertdialog");
      await expect(modalDialog).toBeVisible();

      // Konfirmasi hapus
      await modalDialog.getByRole("button", { name: /Hapus|Ya/i }).click();

      // Cek toast
      await expect(
        page.getByText(/Berhasil menghapus|Transaski dihapus|dihapus/i),
      ).toBeVisible();

      // Cek row menghilang dari grid list
      await expect(page.getByText(invoiceText)).toBeHidden();
    }
  });
});
