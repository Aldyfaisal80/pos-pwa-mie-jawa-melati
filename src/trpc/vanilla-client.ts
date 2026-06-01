/**
 * vanilla-client.ts
 *
 * Vanilla tRPC client — dapat dipanggil di luar React component lifecycle.
 * Digunakan oleh useOfflineSync agar sync loop tidak terputus saat page re-render/unmount.
 */

import { createTRPCClient, httpBatchStreamLink, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { type AppRouter } from "@/server/api/types";

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const vanillaTrpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    httpBatchStreamLink({
      transformer: SuperJSON,
      url: getBaseUrl() + "/api/trpc",
      headers: async () => {
        const headers = new Headers();
        headers.set("x-trpc-source", "nextjs-react-vanilla");
        // Inject Supabase access token untuk protectedProcedure
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (data.session?.access_token) {
          headers.set("authorization", `Bearer ${data.session.access_token}`);
        }
        return headers;
      },
    }),
  ],
});
