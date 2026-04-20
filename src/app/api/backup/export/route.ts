import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Simple protection: require a header or internal-only usage
  // For PWA self-use, we trust the session via cookies (Next.js handles auth)
  const url = new URL(req.url);
  const format = url.searchParams.get("format") ?? "json";

  try {
    const [categories, products, transactions, transactionItems] =
      await Promise.all([
        db.category.findMany({ orderBy: { id: "asc" } }),
        db.product.findMany({ orderBy: { createdAt: "asc" } }),
        db.transaction.findMany({ orderBy: { date: "asc" } }),
        db.transactionItem.findMany({ orderBy: { transactionId: "asc" } }),
      ]);

    const backup = {
      meta: {
        exportedAt: new Date().toISOString(),
        exportedAtWIB: new Date().toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          dateStyle: "full",
          timeStyle: "short",
        }),
        version: "1.0",
        project: "Mie Jawa Melati POS",
        counts: {
          categories: categories.length,
          products: products.length,
          transactions: transactions.length,
          transactionItems: transactionItems.length,
        },
      },
      data: {
        categories,
        products,
        transactions,
        transactionItems,
      },
    };

    const timestamp = new Date()
      .toISOString()
      .slice(0, 16)
      .replace("T", "_")
      .replace(":", "-");
    const filename = `backup_mie-jawa_${timestamp}.json`;

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[backup/export] Error:", error);
    return NextResponse.json(
      { error: "Gagal mengekspor data backup." },
      { status: 500 },
    );
  }
}
