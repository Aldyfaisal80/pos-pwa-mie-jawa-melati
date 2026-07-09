import "server-only";
import { env } from "@/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { type Prisma, PrismaClient } from "../../generated/prisma";

export type DBClient = PrismaClient | Prisma.TransactionClient;

const createPrismaClient = () => {
  // Runtime: use DATABASE_URL (PgBouncer, port 6543) — pooled & safe for serverless.
  // DIRECT_URL (port 5432) is ONLY for prisma migrate.
  const pool = new Pool({
    connectionString: String(env.DATABASE_URL),
    max: 3, // Low limit — PgBouncer handles actual DB connections
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

// Cache Prisma client di global — HENTIKAN membuat Pool baru di setiap serverless invocation
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

// WAJIB cache di production juga — tanpa ini, setiap Vercel serverless
// function invocation membuat PrismaClient + Pool baru = connection leak
globalForPrisma.prisma = db;
