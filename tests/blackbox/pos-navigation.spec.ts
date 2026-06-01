import { test, expect } from "@playwright/test";

test.describe("POS WebApp - Navigation Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("navigasi dari Dashboard ke Kasir via Sidebar", async ({ page }) => {
    await page.getByRole("link", { name: "Kasir" }).click();
    await expect(page).toHaveURL(/\/cashier/);
    // Verifikasi tombol pembayaran terlihat di kasir
    await expect(page.getByRole("button", { name: /Bayar Sekarang/i })).toBeVisible();
  });

  test("navigasi dari Dashboard ke Produk via Sidebar", async ({ page }) => {
    await page.getByRole("link", { name: "Produk" }).click();
    await expect(page).toHaveURL(/\/product/);
    await expect(page.getByText(/Manajemen Produk/i)).toBeVisible();
  });

  test("navigasi dari Dashboard ke Laporan via Sidebar", async ({ page }) => {
    await page.getByRole("link", { name: "Laporan" }).click();
    await expect(page).toHaveURL(/\/report/);
    await expect(page.getByText(/Laporan Penjualan/i)).toBeVisible();
  });

  test("navigasi dari Dashboard ke Pengaturan via Sidebar", async ({ page }) => {
    await page.getByRole("link", { name: "Pengaturan" }).click();
    await expect(page).toHaveURL(/\/store-settings/);
    await expect(page.locator("#storeName")).toBeVisible();
  });

  test("kembali ke Dashboard dari halaman lain", async ({ page }) => {
    await page.goto("/product");
    await page.getByRole("link", { name: "Dashboard" }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByText("Omzet Hari Ini")).toBeVisible();
  });
});
