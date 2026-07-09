import "server-only";
import { env } from "@/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { type Prisma, PrismaClient } from "../../generated/prisma";

export type DBClient = PrismaClient | Prisma.TransactionClient;

const createConnectionPool = () => {
  // Use DIRECT_URL (port 5432, no pgbouncer) for runtime — supports writes.
  // DATABASE_URL (port 6543, pgbouncer) is only for Prisma migrations.
  return new Pool({
    connectionString: String(env.DIRECT_URL ?? env.DATABASE_URL),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
};

const createPrismaClient = () => {
  const pool = createConnectionPool();
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
