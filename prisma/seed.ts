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

  console.log("Membuat Produk (sesuai DB dev)...");
  const products = await Promise.all([
    // Makanan
    prisma.product.create({
      data: {
        name: "Mie Goreng",
        price: 12000,
        categoryId: catMakanan.id,
        image: "/images/products/mie-goreng.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Mie Kuah",
        price: 12000,
        categoryId: catMakanan.id,
        image: "/images/products/mie-kuah.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Mie Nyemek",
        price: 12000,
        categoryId: catMakanan.id,
        image: "/images/products/mie-nyemek.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Nasi Goreng",
        price: 12000,
        categoryId: catMakanan.id,
        image: "/images/products/nasi-goreng.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Nasi Mawut",
        price: 12000,
        categoryId: catMakanan.id,
        image: "/images/products/nasi-mawut.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Nasi Mie Godog",
        price: 12000,
        categoryId: catMakanan.id,
        image: "/images/products/nasi-mie-godog.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Sop Sayur",
        price: 12000,
        categoryId: catMakanan.id,
        image: "/images/products/sop-sayur.jpg",
      },
    }),

    // Minuman
    prisma.product.create({
      data: {
        name: "Aqua",
        price: 1000,
        categoryId: catMinuman.id,
        image: "/images/products/aqua.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Es Jeruk",
        price: 4000,
        categoryId: catMinuman.id,
        image: "/images/products/es-jeruk.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Es Strup",
        price: 4000,
        categoryId: catMinuman.id,
        image: "/images/products/es-strup.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Es Teh",
        price: 4000,
        categoryId: catMinuman.id,
        image: "/images/products/es-teh.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Jeruk Hangat",
        price: 4000,
        categoryId: catMinuman.id,
        image: "/images/products/jeruk-hangat.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Strup Hangat",
        price: 4000,
        categoryId: catMinuman.id,
        image: "/images/products/strup-hangat.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Teh Hangat",
        price: 4000,
        categoryId: catMinuman.id,
        image: "/images/products/teh-hangat.jpg",
      },
    }),

    // Tambahan
    prisma.product.create({
      data: {
        name: "Krupuk",
        description: "Tambahan Krupuk",
        price: 1000,
        categoryId: catTambahan.id,
        image: "/images/products/krupuk.jpg",
      },
    }),
    prisma.product.create({
      data: {
        name: "Telur",
        description: "Tambahan Telur",
        price: 3000,
        categoryId: catTambahan.id,
        image: "/images/products/telur.jpg",
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
