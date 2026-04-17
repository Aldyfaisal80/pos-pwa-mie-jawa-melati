import "dotenv/config";
import { PaymentMethod, PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Direct client — avoids `server-only` guard in src/server/db.ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Menghapus data lama...");
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.storeConfig.deleteMany();

  console.log("Setting konfigurasi toko...");
  await prisma.storeConfig.create({
    data: {
      name: "Mie Jawa Melati",
      address: "Jl. Nasional III, Blitar, Jawa Timur",
      phone: "081234567890",
    },
  });

  console.log("Membuat Kategori...");
  const catMakanan = await prisma.category.create({
    data: { name: "Makanan" },
  });
  const catMinuman = await prisma.category.create({
    data: { name: "Minuman" },
  });
  const catTambahan = await prisma.category.create({
    data: { name: "Tambahan" },
  });

  console.log("Membuat Produk Realistis...");
  const products = await Promise.all([
    // Makanan
    prisma.product.create({
      data: {
        name: "Sego Mie Godog",
        description: "Mie godog dicampur nasi (magelangan) khas Jawa",
        price: 15000,
        categoryId: catMakanan.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Mie Godog",
        description: "Mie rebus khas Jawa dengan kuah kental",
        price: 13000,
        categoryId: catMakanan.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Mie Goreng",
        description: "Mie goreng manis gurih",
        price: 13000,
        categoryId: catMakanan.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Nasi Goreng Mawut",
        description: "Nasi goreng campur mie",
        price: 14000,
        categoryId: catMakanan.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sop Tunjang",
        description: "Sop balungan/tunjang sapi",
        price: 20000,
        categoryId: catMakanan.id,
      },
    }),

    // Minuman
    prisma.product.create({
      data: {
        name: "Es Teh Manis / Panas",
        price: 3000,
        categoryId: catMinuman.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Es Jeruk / Panas",
        price: 4000,
        categoryId: catMinuman.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Es Kampul",
        description: "Teh kampul khas Solo",
        price: 5000,
        categoryId: catMinuman.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Kopi Hitam",
        price: 4000,
        categoryId: catMinuman.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Kopi Susu",
        price: 5000,
        categoryId: catMinuman.id,
      },
    }),

    // Tambahan
    prisma.product.create({
      data: {
        name: "Krupuk Uyel",
        price: 1000,
        categoryId: catTambahan.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sate Usus",
        price: 2500,
        categoryId: catTambahan.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sate Telur Puyuh",
        price: 3000,
        categoryId: catTambahan.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sate Hati Ampela",
        price: 3500,
        categoryId: catTambahan.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Gorengan",
        price: 1000,
        categoryId: catTambahan.id,
      },
    }),
  ]);

  console.log("Membuat Data Transaksi Historis (30 hari terakhir)...");

  // Membuat fungsi untuk memperkirakan penjualan acak
  const past30Days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d;
  });

  let totalTransactions = 0;

  for (const date of past30Days) {
    // Hari libur rame (Jumat-Minggu) = 15-30 transaksi, Hari biasa = 5-15 transaksi
    const isWeekend =
      date.getDay() === 0 || date.getDay() === 5 || date.getDay() === 6;
    const numTx = isWeekend
      ? Math.floor(Math.random() * 15) + 15
      : Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < numTx; i++) {
      // Waktu acak antara jam 10 pagi - 10 malam
      const txDate = new Date(date);
      txDate.setHours(10 + Math.floor(Math.random() * 12));
      txDate.setMinutes(Math.floor(Math.random() * 60));

      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 item per transaksi (jenis beda)
      const items = [];
      let totalAmount = 0;

      // Pilih produk secara acak
      const shuffledProducts = [...products].sort(() => 0.5 - Math.random());

      for (let j = 0; j < numItems; j++) {
        const prod = shuffledProducts[j]!;
        const qty = Math.floor(Math.random() * 3) + 1; // 1-3 porsi
        const subTotal = Number(prod.price) * qty;

        let note = "";
        if (prod.categoryId === catMakanan.id) {
          const notes = [
            "Pedas",
            "Sedang",
            "Bungkus",
            "Pedas Banget",
            "Tidak Pedas",
            "",
          ];
          note = notes[Math.floor(Math.random() * notes.length)]!;
        } else if (prod.categoryId === catMinuman.id) {
          const notes = ["Es Banyak", "Kurang Manis", "Panas", ""];
          note = notes[Math.floor(Math.random() * notes.length)]!;
        }

        items.push({
          productId: prod.id,
          productName: prod.name,
          quantity: qty,
          unitPrice: prod.price,
          subTotal: subTotal,
          note: note,
        });
        totalAmount += subTotal;
      }

      // Generate Invoice
      const dateStr =
        txDate.getFullYear().toString() +
        (txDate.getMonth() + 1).toString().padStart(2, "0") +
        txDate.getDate().toString().padStart(2, "0");

      const randomId = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");
      const invoiceNumber = `INV-${dateStr}-${i.toString().padStart(3, "0")}-${randomId}`;

      // Metode pembayaran (70% Cash, 30% QRIS)
      const isQris = Math.random() > 0.7;

      await prisma.transaction.create({
        data: {
          invoiceNumber,
          date: txDate,
          totalAmount,
          paymentMethod: isQris ? PaymentMethod.QRIS : PaymentMethod.CASH,
          paidAmount: isQris
            ? totalAmount
            : totalAmount + Math.floor(Math.random() * 20000), // Uang pas / bayar lebih jika cash
          change: isQris
            ? 0
            : Math.max(
                0,
                totalAmount + Math.floor(Math.random() * 20000) - totalAmount,
              ), // Change
          isSynced: true, // Karena ini data historis
          createdAt: txDate,
          updatedAt: txDate,
          items: {
            create: items,
          },
        },
      });

      totalTransactions++;
    }
  }

  console.log(
    `✅ Seed Selesai! Berhasil membuat ${totalTransactions} transaksi historis selama 30 hari.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
