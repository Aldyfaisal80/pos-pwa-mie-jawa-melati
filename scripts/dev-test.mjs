/**
 * Wrapper script to start Next.js dev with .env.test
 *
 * Problem: Next.js Turbopack inlines NEXT_PUBLIC_* at compile-time from
 * .env.development (NODE_ENV=development). dotenv-cli can't override this.
 *
 * Solution: This script:
 * 1. Manually loads .env.test into process.env
 * 2. Sets NEXT_ENV=test flag for next.config.js
 * 3. next.config.js reads NEXT_ENV=test and passes env vars via config.env
 * 4. Turbopack then inlines the correct (test) values into client code
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const envPath = resolve(process.cwd(), ".env.test");
const envContent = readFileSync(envPath, "utf-8");

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;

  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;

  const key = trimmed.slice(0, eqIndex);
  let value = trimmed.slice(eqIndex + 1);

  // Remove surrounding quotes
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  process.env[key] = value;
}

// Set flag for next.config.js to activate env override
process.env.NEXT_ENV = "test";

// Verify
console.log(
  `[env-test] ✅ Loaded .env.test → SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40)}...`,
);
console.log(`[env-test] ✅ NEXT_ENV=test → next.config.js will override client env`);

// Execute next dev with inherited env
try {
  execSync("npx next dev --turbo", {
    stdio: "inherit",
    env: process.env,
  });
} catch {
  // next dev was terminated (Ctrl+C) — exit gracefully
  process.exit(0);
}
