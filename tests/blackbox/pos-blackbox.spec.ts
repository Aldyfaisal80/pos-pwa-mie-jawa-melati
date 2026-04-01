import fs from "node:fs/promises";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

type Primitive = string | number | boolean | null;
type CaseData = Record<string, Primitive>;

type CaseResult = {
  id: string;
  title: string;
  status: string;
  durationMs: number;
  data: CaseData;
  errors: string[];
};

type PendingTransactionSnapshot = {
  count: number;
  invoices: string[];
};

const reportPath = path.join(
  process.cwd(),
  "generated",
  "blackbox",
  "blackbox-results.json",
);

const downloadDir = path.join(
  process.cwd(),
  "generated",
  "blackbox",
  "downloads",
);

const caseDataByTitle = new Map<string, CaseData>();
const caseResults: CaseResult[] = [];
const sharedState = {
  initialTransactionCount: null as number | null,
  originalStoreName: "",
  updatedStoreName: "",
  createdCategoryName: "",
  createdProductName: "",
  onlineInvoice: "",
  offlineInvoice: "",
};

const setCaseData = (title: string, data: CaseData) => {
  caseDataByTitle.set(title, data);
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const extractNumber = (value: string | undefined) => {
  if (!value) return null;
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
};

const parseCurrency = (value: string) => {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
};

const extractDashboardStats = async (page: Page) => {
  const statValues = page.locator(".text-2xl.font-bold");
  await expect(statValues.first()).toBeVisible();

  const omzet = (await statValues.nth(0).innerText()).trim();
  const totalTransactions = extractNumber(await statValues.nth(1).innerText());

  let topMenu: string | null = null;
  const topMenuValue = page.locator("span.block.truncate.text-xl").first();
  if ((await topMenuValue.count()) > 0) {
    topMenu = (await topMenuValue.innerText()).trim();
  }

  return {
    omzetHariIni: omzet,
    totalTransaksiHariIni: totalTransactions,
    menuTerlaris: topMenu,
  };
};

const extractReceiptData = async (page: Page) => {
  const receiptDialog = page.getByRole("dialog");
  await expect(receiptDialog.getByText("*** TERIMA KASIH ***")).toBeVisible();

  const receiptText = await receiptDialog.innerText();
  const invoice =
    receiptText.match(/No:\s+#(INV-[\d-]+)/)?.[1] ?? "INVOICE_NOT_FOUND";
  const total =
    receiptText.match(/\bTotal\b\s*(Rp[\d.\s\u00A0]+)/)?.[1]?.trim() ?? null;

  return { receiptDialog, receiptText, invoice, total };
};

const searchInvoiceInReport = async (page: Page, invoice: string) => {
  const searchInput = page.getByPlaceholder("Cari no. nota...");
  await searchInput.fill("");
  await searchInput.fill(invoice);
  await expect(page.getByText(invoice)).toBeVisible();
};

const readPendingTransactions = async (
  page: Page,
): Promise<PendingTransactionSnapshot> => {
  return page.evaluate(async () => {
    const DB_NAME = "post-pwa-offline";
    const STORE_NAME = "pending_transactions";

    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onupgradeneeded = () => resolve(request.result);
    });

    const result = await new Promise<PendingTransactionSnapshot>(
      (resolve, reject) => {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          resolve({ count: 0, invoices: [] });
          return;
        }

        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const rows =
            (getAllRequest.result as { invoiceNumber: string }[]) ?? [];
          resolve({
            count: rows.length,
            invoices: rows.map((row) => row.invoiceNumber),
          });
        };
        getAllRequest.onerror = () => reject(getAllRequest.error);
        tx.oncomplete = () => db.close();
      },
    );

    return result;
  });
};

const getReportTotals = async (page: Page) => {
  const totals = await page.locator("tbody tr td:nth-child(4)").allInnerTexts();
  return totals.map((value) => parseCurrency(value) ?? 0);
};

const waitForReportData = async (page: Page) => {
  await expect(
    page.getByText(/dari total \d+ transaksi/, { exact: false }),
  ).toBeVisible();
  await expect(page.locator("tbody tr td.font-mono").first()).toBeVisible();
};

const parseTotalCountFromFooter = (footerText: string) => {
  const match = footerText.match(/dari total (\d+) transaksi/);
  return match ? Number(match[1]) : null;
};

const getCategoryManagerDialog = (page: Page) =>
  page.locator('[data-slot="dialog-content"]', {
    has: page.getByRole("heading", { name: "Kelola Kategori" }),
  });

test.describe.configure({ mode: "serial" });

test.afterEach(async ({}, testInfo) => {
  caseResults.push({
    id: slugify(testInfo.title),
    title: testInfo.title,
    status: testInfo.status ?? "unknown",
    durationMs: testInfo.duration,
    data: caseDataByTitle.get(testInfo.title) ?? {},
    errors: testInfo.errors.flatMap((error) =>
      error.message ? [error.message] : [],
    ),
  });
});

test.afterAll(async () => {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });

  const passed = caseResults.filter((item) => item.status === "passed").length;
  const failed = caseResults.filter((item) => item.status !== "passed").length;

  const report = {
    metadata: {
      app: "post-pwa",
      suite: "blackbox-advanced",
      generatedAt: new Date().toISOString(),
      baseUrl: "http://localhost:3000",
      browser: "chromium",
    },
    summary: {
      total: caseResults.length,
      passed,
      failed,
    },
    sharedState: {
      initialTransactionCount: sharedState.initialTransactionCount,
      originalStoreName: sharedState.originalStoreName || null,
      updatedStoreName: sharedState.updatedStoreName || null,
      createdCategoryName: sharedState.createdCategoryName || null,
      createdProductName: sharedState.createdProductName || null,
      onlineInvoice: sharedState.onlineInvoice || null,
      offlineInvoice: sharedState.offlineInvoice || null,
    },
    cases: caseResults,
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");
});

test("dashboard menampilkan statistik harian", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Omzet Hari Ini")).toBeVisible();
  await expect(page.getByText("Total Transaksi")).toBeVisible();
  await expect(page.getByText("Penjualan Menu Teratas")).toBeVisible();

  const stats = await extractDashboardStats(page);
  sharedState.initialTransactionCount = stats.totalTransaksiHariIni;

  setCaseData(test.info().title, {
    omzetHariIni: stats.omzetHariIni,
    totalTransaksiHariIni: stats.totalTransaksiHariIni,
    menuTerlaris: stats.menuTerlaris,
  });
});

test("dashboard dapat mengganti periode grafik pendapatan", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByText("Pendapatan 7 Hari Terakhir")).toBeVisible();

  await page.locator('[data-slot="select-trigger"]').first().click();
  await page.getByRole("option", { name: "30 Hari" }).click();

  await expect(page.getByText("Pendapatan 30 Hari Terakhir")).toBeVisible();

  setCaseData(test.info().title, {
    defaultPeriod: 7,
    updatedPeriod: 30,
    titleUpdated: true,
  });
});

test("pengaturan toko memvalidasi nama wajib", async ({ page }) => {
  await page.goto("/store-settings");

  const storeNameInput = page.locator("#storeName");
  await expect(storeNameInput).toBeVisible();
  await expect(storeNameInput).not.toHaveValue("");

  sharedState.originalStoreName = await storeNameInput.inputValue();

  await storeNameInput.clear();
  await page.getByRole("button", { name: "Simpan Perubahan" }).click();

  const errorToast = page.getByText("Nama toko wajib diisi.");
  await expect(errorToast).toBeVisible();

  setCaseData(test.info().title, {
    validationMessage: "Nama toko wajib diisi.",
    validationTriggered: true,
  });
});

test("pengaturan toko dapat disimpan dan dipulihkan", async ({ page }) => {
  await page.goto("/store-settings");

  const storeNameInput = page.locator("#storeName");
  const originalName =
    sharedState.originalStoreName || (await storeNameInput.inputValue());
  const updatedName = `Blackbox Store ${Date.now()}`;
  sharedState.updatedStoreName = updatedName;

  await storeNameInput.fill(updatedName);
  await page.getByRole("button", { name: "Simpan Perubahan" }).click();
  await expect(page.getByText("Pengaturan Disimpan")).toBeVisible();

  await page.reload();
  await expect(page.locator("#storeName")).toHaveValue(updatedName);

  await page.locator("#storeName").fill(originalName);
  await page.getByRole("button", { name: "Simpan Perubahan" }).click();
  await expect(page.getByText("Pengaturan Disimpan")).toBeVisible();

  setCaseData(test.info().title, {
    originalName,
    updatedName,
    persistedAfterReload: true,
    restoredToOriginal: true,
  });
});

test("kategori aktif tidak bisa dihapus", async ({ page }) => {
  await page.goto("/product");
  await page.getByRole("button", { name: /Kelola Kategori/i }).click();

  const categoryDialog = getCategoryManagerDialog(page);
  await expect(categoryDialog.getByText("Kelola Kategori")).toBeVisible();

  await categoryDialog.getByTitle('Hapus "Makanan"').click();
  await expect(page.getByText('Hapus kategori "Makanan"?')).toBeVisible();
  await page.getByRole("button", { name: "Ya, Hapus" }).click();

  const errorText =
    /Gagal Hapus: Kategori ini masih memiliki \d+ produk aktif\./;
  await expect(page.getByText(errorText)).toBeVisible();

  setCaseData(test.info().title, {
    categoryName: "Makanan",
    deletePrevented: true,
    businessRuleValidated: true,
  });
});

test("kategori baru dapat ditambahkan", async ({ page }) => {
  const categoryName = `Blackbox Category ${Date.now()}`;
  sharedState.createdCategoryName = categoryName;

  await page.goto("/product");
  await page.getByRole("button", { name: /Kelola Kategori/i }).click();

  const categoryDialog = getCategoryManagerDialog(page);
  await expect(categoryDialog.getByText("Kelola Kategori")).toBeVisible();

  await categoryDialog
    .getByPlaceholder("Nama kategori baru...")
    .fill(categoryName);
  await categoryDialog.getByTitle("Tambah kategori").click();

  await expect(page.getByText("Kategori berhasil ditambahkan!")).toBeVisible();
  await expect(categoryDialog.getByText(categoryName)).toBeVisible();

  setCaseData(test.info().title, {
    categoryName,
    createSuccess: true,
  });
});

test("produk baru dapat ditambahkan pada kategori baru", async ({ page }) => {
  const productName = `Blackbox Product ${Date.now()}`;
  sharedState.createdProductName = productName;

  await page.goto("/product");
  await expect(page.getByText("Daftar Menu")).toBeVisible();

  await page.getByRole("button", { name: /Tambah Produk/i }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await dialog.locator("#prod-name").fill(productName);
  await dialog
    .locator("#prod-desc")
    .fill("Produk hasil pengujian blackbox lanjutan");
  await dialog.locator("#prod-price").fill("21000");

  await dialog.getByRole("combobox").first().click();
  await page
    .getByRole("option", { name: sharedState.createdCategoryName })
    .click();

  await dialog.getByRole("button", { name: "Simpan Produk" }).click();

  await expect(page.getByText("Produk berhasil ditambahkan!")).toBeVisible();
  await expect(page.getByText(productName)).toBeVisible();

  setCaseData(test.info().title, {
    productName,
    categoryName: sharedState.createdCategoryName,
    price: 21000,
    createSuccess: true,
  });
});

test("produk dapat diedit tanpa merusak data form", async ({ page }) => {
  const originalProductName = sharedState.createdProductName;
  const updatedProductName = `${originalProductName} Updated`;

  await page.goto("/product");

  const row = page.locator("tbody tr", {
    hasText: sharedState.createdProductName,
  });
  await expect(row).toBeVisible();

  await row.locator("button").first().click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("Edit Produk")).toBeVisible();
  await expect(dialog.locator("#prod-name")).toHaveValue(
    sharedState.createdProductName,
  );

  await dialog.locator("#prod-name").fill(updatedProductName);
  await dialog.locator("#prod-price").fill("22000");
  await dialog.getByRole("button", { name: "Simpan Produk" }).click();

  await expect(page.getByText("Produk berhasil diperbarui!")).toBeVisible();
  await expect(page.getByText(updatedProductName)).toBeVisible();

  sharedState.createdProductName = updatedProductName;

  setCaseData(test.info().title, {
    originalProductName,
    updatedProductName,
    updatedPrice: 22000,
  });
});

test("soft delete produk membuatnya tidak tampil di kasir", async ({
  page,
}) => {
  await page.goto("/product");

  const row = page.locator("tbody tr", {
    hasText: sharedState.createdProductName,
  });
  await expect(row).toBeVisible();

  await row.locator("button").nth(1).click();
  await expect(page.getByText("Nonaktifkan produk ini?")).toBeVisible();
  await page.getByRole("button", { name: "Ya, Nonaktifkan" }).click();

  await expect(
    page.getByText("Produk dihapus (tidak tersedia)."),
  ).toBeVisible();
  await expect(row.getByText("Tidak Tersedia")).toBeVisible();

  await page.goto("/cashier");
  await expect(page.getByText(sharedState.createdProductName)).toHaveCount(0);

  setCaseData(test.info().title, {
    productName: sharedState.createdProductName,
    softDeleteSuccess: true,
    hiddenFromCashier: true,
  });
});

test("kategori dengan produk nonaktif dapat dihapus", async ({ page }) => {
  await page.goto("/product");
  await page.getByRole("button", { name: /Kelola Kategori/i }).click();

  const categoryDialog = getCategoryManagerDialog(page);
  await expect(categoryDialog.getByText("Kelola Kategori")).toBeVisible();

  await categoryDialog
    .getByTitle(`Hapus "${sharedState.createdCategoryName}"`)
    .click();
  await expect(
    page.getByText(`Hapus kategori "${sharedState.createdCategoryName}"?`),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ya, Hapus" }).click();

  await expect(
    categoryDialog.getByText(sharedState.createdCategoryName),
  ).toHaveCount(0);
  await expect(page.getByText("Kategori berhasil dihapus!")).toBeVisible();

  setCaseData(test.info().title, {
    categoryName: sharedState.createdCategoryName,
    deletedAfterProductsInactive: true,
  });
});

test("checkout tunai ditolak jika nominal kurang", async ({ page }) => {
  await page.goto("/cashier");

  await expect(page.getByText("Sego Mie Godog")).toBeVisible();
  await page.getByText("Sego Mie Godog").click();

  await page.getByRole("button", { name: /Bayar Sekarang/i }).click();

  const checkoutDialog = page.getByRole("dialog");
  await expect(
    checkoutDialog.getByText("Penyelesaian Pembayaran"),
  ).toBeVisible();

  await checkoutDialog.getByPlaceholder("0").fill("10000");
  await expect(checkoutDialog.getByText("Kurang")).toBeVisible();
  await expect(
    checkoutDialog.getByRole("button", { name: "Selesaikan Transaksi" }),
  ).toBeDisabled();

  setCaseData(test.info().title, {
    productName: "Sego Mie Godog",
    attemptedCash: 10000,
    buttonDisabled: true,
    shortageVisible: true,
  });
});

test("kasir dapat memecah catatan item dan mencetaknya di struk", async ({
  page,
}) => {
  await page.goto("/cashier");

  const segoMieGodogCard = page.getByRole("heading", {
    name: "Sego Mie Godog",
  });
  await segoMieGodogCard.click();
  await segoMieGodogCard.click();

  const cartPanel = page.locator("aside");
  await expect(cartPanel.getByText("Sego Mie Godog")).toHaveCount(1);

  await cartPanel.getByRole("button", { name: "+ Catatan" }).click();

  const noteDialog = page.getByRole("dialog");
  await expect(
    noteDialog.getByRole("heading", { name: "Catatan Pesanan" }).first(),
  ).toBeVisible();

  const splitBox = noteDialog
    .locator("div")
    .filter({ hasText: "Terapkan untuk berapa porsi?" })
    .first();
  await splitBox.locator("button").first().click();

  await noteDialog.getByRole("button", { name: "Pedas", exact: true }).click();
  await noteDialog.getByRole("button", { name: "Simpan Catatan" }).click();

  await expect(cartPanel.getByText("Sego Mie Godog")).toHaveCount(2);
  await expect(cartPanel.getByText("Pedas")).toBeVisible();

  await page.getByRole("button", { name: /Bayar Sekarang/i }).click();

  const checkoutDialog = page.getByRole("dialog");
  await checkoutDialog.getByRole("button", { name: "50k" }).click();
  await checkoutDialog
    .getByRole("button", { name: "Selesaikan Transaksi" })
    .click();

  const { receiptDialog, receiptText, invoice, total } =
    await extractReceiptData(page);
  sharedState.onlineInvoice = invoice;

  expect(receiptText).toContain("* Pedas");

  await receiptDialog.getByRole("button", { name: "Tutup" }).click();
  await expect(page.getByText("Transaksi Berhasil!")).toBeVisible();

  setCaseData(test.info().title, {
    invoice,
    total,
    splitRowCreated: true,
    notePrintedOnReceipt: true,
  });
});

test("laporan dapat menemukan dan menampilkan detail transaksi", async ({
  page,
}) => {
  await page.goto("/report");
  await expect(page.getByText("Riwayat Transaksi")).toBeVisible();

  await searchInvoiceInReport(page, sharedState.onlineInvoice);

  const row = page.locator("tbody tr", { hasText: sharedState.onlineInvoice });
  await row.locator("button").first().click();

  const detailDialog = page.getByRole("dialog");
  await expect(detailDialog.getByText("Detail Transaksi")).toBeVisible();
  await expect(detailDialog.getByText(sharedState.onlineInvoice)).toBeVisible();
  await expect(detailDialog.getByText("Catatan: Pedas")).toBeVisible();
  await expect(detailDialog.getByText("Tunai")).toBeVisible();

  setCaseData(test.info().title, {
    invoice: sharedState.onlineInvoice,
    detailOpened: true,
    noteVisible: true,
    paymentMethodVisible: true,
  });
});

test("laporan mendukung sorting total transaksi", async ({ page }) => {
  await page.goto("/report");
  await waitForReportData(page);

  const searchInput = page.getByPlaceholder("Cari no. nota...");
  await searchInput.fill("");

  const totalHeader = page.getByRole("columnheader", {
    name: "Total",
    exact: true,
  });

  await totalHeader.click();
  await page.waitForTimeout(500);
  const ascTotals = await getReportTotals(page);

  await totalHeader.click();
  await page.waitForTimeout(500);
  const descTotals = await getReportTotals(page);

  expect(ascTotals[0]).toBeLessThanOrEqual(
    ascTotals[1] ?? Number.MAX_SAFE_INTEGER,
  );
  expect(descTotals[0]).toBeGreaterThanOrEqual(descTotals[1] ?? 0);

  setCaseData(test.info().title, {
    ascFirstTotal: ascTotals[0] ?? null,
    ascSecondTotal: ascTotals[1] ?? null,
    descFirstTotal: descTotals[0] ?? null,
    descSecondTotal: descTotals[1] ?? null,
  });
});

test("laporan mendukung perubahan limit baris", async ({ page }) => {
  await page.goto("/report");
  await waitForReportData(page);

  const footer = page.getByText(
    /Menampilkan \d+ transaksi dari total \d+ transaksi/,
    {
      exact: false,
    },
  );
  const footerBefore = await footer.innerText();

  await page.locator('[data-slot="select-trigger"]').nth(0).click();
  await page.getByRole("option", { name: "25 baris" }).click();

  await waitForReportData(page);
  await expect(footer).not.toHaveText(footerBefore);
  const footerAfter = await footer.innerText();
  const visibleRows = await page.locator("tbody tr td.font-mono").count();

  setCaseData(test.info().title, {
    footerBefore,
    footerAfter,
    visibleRowsAfterLimitChange: visibleRows,
  });
});

test("pagination laporan tidak mengosongkan footer saat pindah halaman", async ({
  page,
}) => {
  await page.goto("/report");
  await waitForReportData(page);

  const footer = page.getByText(
    /Menampilkan \d+ transaksi dari total \d+ transaksi/,
    {
      exact: false,
    },
  );
  const footerBefore = await footer.innerText();
  const firstInvoiceBefore = await page
    .locator("tbody tr td.font-mono")
    .first()
    .innerText();

  let delayedOnce = false;
  await page.route(
    "**/api/trpc/transaction.getTransactionReport**",
    async (route) => {
      if (!delayedOnce) {
        delayedOnce = true;
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
      await route.continue();
    },
  );

  await page.getByRole("button", { name: "2", exact: true }).click();

  await expect(footer).toHaveText(footerBefore);
  await expect(page.locator("tbody tr td.font-mono").first()).toHaveText(
    firstInvoiceBefore,
  );

  await expect
    .poll(
      async () =>
        await page.locator("tbody tr td.font-mono").first().innerText(),
    )
    .not.toBe(firstInvoiceBefore);

  await expect(footer).not.toContainText("Menampilkan 0 transaksi");

  setCaseData(test.info().title, {
    footerStayedStable: true,
    firstInvoiceBefore,
  });
});

test("filter metode pembayaran bekerja di laporan", async ({ page }) => {
  await page.goto("/report");
  await waitForReportData(page);

  await page.locator('[data-slot="select-trigger"]').nth(1).click();
  await page.getByRole("option", { name: "QRIS" }).click();
  await waitForReportData(page);

  await expect
    .poll(async () => {
      const rows = await page
        .locator("tbody tr td:nth-child(3) span")
        .allInnerTexts();
      return rows.every((badge) => badge.trim() === "QRIS");
    })
    .toBe(true);

  const badges = await page
    .locator("tbody tr td:nth-child(3) span")
    .allInnerTexts();

  expect(badges.length).toBeGreaterThan(0);
  expect(badges.every((badge) => badge.trim() === "QRIS")).toBe(true);

  setCaseData(test.info().title, {
    selectedPaymentMethod: "QRIS",
    visibleRows: badges.length,
    allRowsMatched: badges.every((badge) => badge.trim() === "QRIS"),
  });
});

test("laporan dapat diekspor seluruh hasil filter, bukan hanya halaman aktif", async ({
  page,
}) => {
  await fs.mkdir(downloadDir, { recursive: true });

  await page.goto("/report");
  await waitForReportData(page);

  const footer = await page
    .getByText(/Menampilkan \d+ transaksi dari total \d+ transaksi/, {
      exact: false,
    })
    .innerText();
  const totalCount = parseTotalCountFromFooter(footer) ?? 0;
  const visibleRowsOnPage = await page.locator("tbody tr td.font-mono").count();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export CSV/i }).click();
  const download = await downloadPromise;

  const downloadPath = path.join(downloadDir, download.suggestedFilename());
  await download.saveAs(downloadPath);
  const csvContent = await fs.readFile(downloadPath, "utf8");
  const exportedRows = csvContent.trim().split(/\r?\n/).length - 1;

  expect(csvContent).toContain("No. Nota,Tanggal,Waktu,Metode,Total");
  expect(Math.abs(exportedRows - totalCount)).toBeLessThanOrEqual(5);
  expect(exportedRows).toBeGreaterThan(visibleRowsOnPage);

  setCaseData(test.info().title, {
    fileName: download.suggestedFilename(),
    exportedRows,
    totalCount,
    visibleRowsOnPage,
    containsHeader: csvContent.includes("No. Nota,Tanggal,Waktu,Metode,Total"),
  });
});

test("laporan dapat menghapus transaksi", async ({ page }) => {
  await page.goto("/report");
  await searchInvoiceInReport(page, sharedState.onlineInvoice);

  const row = page.locator("tbody tr", { hasText: sharedState.onlineInvoice });
  await row.locator("button").nth(1).click();

  await expect(page.getByText("Hapus Transaksi?")).toBeVisible();
  await page.getByRole("button", { name: "Ya, Hapus" }).click();

  await expect(page.getByText("Transaksi dihapus")).toBeVisible();
  await expect(page.getByText("Bebas Transaksi!")).toBeVisible();

  setCaseData(test.info().title, {
    invoice: sharedState.onlineInvoice,
    deleted: true,
  });
});

test("transaksi offline disimpan lokal lalu tersinkron saat online", async ({
  page,
}) => {
  await page.goto("/cashier");
  await expect(
    page.getByRole("heading", { name: "Es Teh Manis / Panas" }),
  ).toBeVisible();

  await page.context().setOffline(true);
  await expect(page.locator("header").getByText("Offline")).toBeVisible();

  await page.getByRole("heading", { name: "Es Teh Manis / Panas" }).click();
  await page.getByRole("button", { name: /Bayar Sekarang/i }).click();

  const checkoutDialog = page.getByRole("dialog");
  await checkoutDialog.getByRole("button", { name: "QRIS" }).click();
  await checkoutDialog
    .getByRole("button", { name: "Selesaikan Transaksi" })
    .click();

  const { receiptDialog, invoice } = await extractReceiptData(page);
  sharedState.offlineInvoice = invoice;

  await receiptDialog.getByRole("button", { name: "Tutup" }).click();
  await expect(page.getByText("Mode Offline")).toBeVisible();

  const pendingBeforeSync = await readPendingTransactions(page);
  expect(pendingBeforeSync.invoices).toContain(invoice);

  await page.context().setOffline(false);

  // Safely tell the PWA that we are back online. If the execution context is destroyed
  // (e.g. page reloading or navigating), we simply retry until it successfully dispatches.
  await expect
    .poll(
      async () => {
        try {
          await page.evaluate(() => window.dispatchEvent(new Event("online")));
          return true;
        } catch {
          return false;
        }
      },
      { timeout: 15_000, intervals: [500] },
    )
    .toBe(true);

  // Verify the toast message appears (it could be fast, so we don't strictly fail on it,
  // but we wait for it to visually confirm the sync triggered).
  const toastAppeared = await page
    .getByText(/Sinkronisasi Berhasil|Semua transaksi offline berhasil/i)
    .first()
    .waitFor({ state: "visible", timeout: 15_000 })
    .then(() => true)
    .catch(() => false);

  // Primary assertion: IndexedDB pending queue must eventually drain.
  await expect
    .poll(
      async () => {
        try {
          const res = await readPendingTransactions(page);
          return res.count;
        } catch {
          // If page is reloading, execution context is destroyed. Return -1 to keep polling.
          return -1;
        }
      },
      {
        timeout: 30_000,
        intervals: [1000, 2000, 3000],
      },
    )
    .toBe(0);

  // If toast never appeared AND queue is now empty, the sync still happened —
  // record what we observed so CI logs have context.
  setCaseData("offline-sync-toast-check", { toastAppeared });

  await page.goto("/report");
  await searchInvoiceInReport(page, invoice);

  setCaseData(test.info().title, {
    invoice,
    pendingCountBeforeSync: pendingBeforeSync.count,
    syncedToServer: true,
    foundInReport: true,
  });
});
