import { test, expect } from "@playwright/test";

test.describe("Admin & Master Data Operations", () => {
  // We use serial mode because we depend on the state changes of previous tests
  test.describe.configure({ mode: "serial" });

  test("mengubah konfigurasi toko dengan logo dummy", async ({ page }) => {
    // Hindari upload image beneran ke Supabase Bucket selama E2E testing
    // demi menghemat bandwidth & menghindari file sampah di bucket production/staging.
    await page.route("**/storage/v1/object/**", async (route) => {
      // Mock respon berhasil dari Supabase Storage API
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          Id: "mock-uuid-1234",
          Key: "uploads/mock-image.png",
        }),
      });
    });

    await page.goto("/store-settings");

    // Tunggu sampai loading skeleton selesai, form siap diisi
    await expect(page.getByLabel(/Nama Toko/i)).toBeVisible();
    await page.waitForTimeout(500); // Wait for potential state hydrate

    // Isi Form
    await page.getByLabel(/Nama Toko/i).fill("Toko Baru E2E");
    await page.getByLabel(/Alamat Lengkap/i).fill("Jl. E2E Testing No 1A");
    await page.getByLabel(/Nomor Telepon/i).fill("081234567890");

    // Upload dummy image
    // ImageUpload component menggunakan <input type="file" /> yang tersembunyi
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();

    // Pastikan path image valid atau generate file bila perlu, disini kita anggap sudah digenerate
    await fileInput.setInputFiles("tests/fixtures/dummy-logo.png");

    await page.getByRole("button", { name: /Simpan Perubahan/i }).click();

    // Verifikasi toast
    await expect(page.getByText(/Pengaturan Disimpan/i)).toBeVisible({
      timeout: 10000,
    });

    // Masuk ke Cashier untuk verifikasi
    await page.goto("/cashier");

    // Di aplikasi ini, Nama Toko biasanya tampil saat menu print struk atau di status popover.
    // Kita anggap akan divalidasi ke komponen lain atau cukup verifikasi sukses simpan form di atas.
  });

  test("membuat dan menyembunyikan Master Data Produk", async ({ page }) => {
    await page.goto("/product");

    // Pastikan tabel termuat (tunggu baris pertama muncul atau empty state)
    await expect(
      page.getByRole("button", { name: /Tambah Produk/i }),
    ).toBeVisible({ timeout: 15000 });

    const uniqueProductName = `Produk E2E ${Date.now()}`;

    // Klik Tambah Produk
    await page.getByRole("button", { name: /Tambah Produk/i }).click();

    // Isi form
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    await modal.getByLabel(/Nama Produk/i).fill(uniqueProductName);
    await modal
      .getByLabel(/Deskripsi/i)
      .fill("Ini adalah produk uji coba otomatis");

    // Set Kategori - Membuka dropdown dan pilih elemen pertama
    await modal.getByRole("combobox").first().click();
    await page.getByRole("option").first().click();

    await modal.getByLabel(/Harga/i).fill("99999");

    // Status default "Tersedia" — langsung simpan
    await modal.getByRole("button", { name: /Simpan Produk/i }).click();
    await expect(modal).toBeHidden({ timeout: 10000 });
    await expect(page.getByText(/Produk berhasil ditambahkan/i)).toBeVisible();

    // Wait for product page to load fully
    await page.waitForLoadState("networkidle");
    // Locate the product cell directly
    const productCell = page
      .getByRole("cell", { name: uniqueProductName })
      .first();
    await expect(productCell).toBeVisible({ timeout: 30000 });
    // Get the containing row for later actions
    const productRow = productCell.locator("..");
    await expect(productRow).toBeAttached({ timeout: 30000 });

    // Cek di halaman kasir apakah produk dapat dibeli
    await page.goto("/cashier");
    await expect(
      page.locator("h3").filter({ hasText: uniqueProductName }),
    ).toBeVisible({ timeout: 15000 });

    // Kembali ke /product untuk MENGEDIT / MENONAKTIFKAN produk
    await page.goto("/product");
    await page.waitForLoadState("networkidle");
    // Wait for product rows to be rendered again
    await page.waitForSelector('tr[data-slot="table-row"]', { timeout: 15000 });
    // Re-fetch the product row after page reload
    const editRow = page
      .locator('tr[data-slot="table-row"]')
      .filter({ hasText: uniqueProductName })
      .first();
    await expect(editRow).toBeVisible({ timeout: 15000 });
    await editRow.getByRole("button").first().click(); // tombol Edit (ikon pensil)

    // Modal Edit muncul
    await expect(modal).toBeVisible();

    // Ganti Ketersediaan ke "Tidak Tersedia"
    // Ada 2 combobox di modal: [0] Kategori, [1] Status Ketersediaan
    await modal.getByRole("combobox").nth(1).click();
    await page.getByRole("option", { name: /Tidak Tersedia/i }).click();

    await modal.getByRole("button", { name: /Simpan Produk/i }).click();
    await expect(page.getByText(/Produk berhasil diperbarui/i)).toBeVisible();

    // Verifikasi di Kasir — produk "Tidak Tersedia" tidak muncul di catalog
    await page.goto("/cashier");
    await expect(
      page.locator("h3").filter({ hasText: uniqueProductName }),
    ).toBeHidden();
  });
});
