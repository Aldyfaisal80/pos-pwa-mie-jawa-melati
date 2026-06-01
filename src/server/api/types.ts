/**
 * Type-only re-exports for client-side usage.
 *
 * Client components (e.g. trpc/react.tsx) must import types from HERE,
 * NOT from root.ts — root.ts imports server-only code (db, supabase server)
 * which causes pg/tls/net/fs to bundle into the browser.
 */
import type { AppRouter } from "./root";

export type { AppRouter };
