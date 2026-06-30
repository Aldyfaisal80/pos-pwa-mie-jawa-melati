"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

import { type AppRouter } from "@/server/api/types";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
let isHydrated = false;
const PERSIST_KEY = "pos-rq-cache";

const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  clientQueryClientSingleton ??= createQueryClient();

  // Hydrate + subscribe only once per page lifecycle
  if (!isHydrated) {
    isHydrated = true;

    // Hydrate from localStorage on first access (survives refresh)
    try {
      const cached = localStorage.getItem(PERSIST_KEY);
      if (cached) {
        const parsed: unknown = JSON.parse(cached);
        if (!Array.isArray(parsed)) throw new Error("Invalid cache format");
        for (const entry of parsed as { queryKey: unknown[]; data: string; dataUpdatedAt: number }[]) {
          if (
            !entry ||
            !Array.isArray(entry.queryKey) ||
            typeof entry.data !== "string"
          )
            continue;
          const data = SuperJSON.parse(entry.data);
          clientQueryClientSingleton.setQueryData(entry.queryKey, data, {
            updatedAt: entry.dataUpdatedAt,
          });
        }
      }
    } catch {
      // Corrupted cache — clear so it doesn't block future persist
      localStorage.removeItem(PERSIST_KEY);
    }

    // Persist on cache changes (debounced)
    let saveTimer: ReturnType<typeof setTimeout> | undefined;
    clientQueryClientSingleton.getQueryCache().subscribe(() => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        try {
          const state = clientQueryClientSingleton!.getQueryCache().getAll();
          const persistable = state
            .filter((q) => q.state.status === "success")
            .map((q) => ({
              queryKey: q.queryKey,
              data: SuperJSON.stringify(q.state.data),
              dataUpdatedAt: q.state.dataUpdatedAt,
            }));
          localStorage.setItem(PERSIST_KEY, JSON.stringify(persistable));
        } catch {
          // Quota exceeded — drop oldest entries and retry once
          try {
            const state = clientQueryClientSingleton!
              .getQueryCache()
              .getAll()
              .filter((q) => q.state.status === "success")
              .slice(-3);
            const minimal = state.map((q) => ({
              queryKey: q.queryKey,
              data: SuperJSON.stringify(q.state.data),
              dataUpdatedAt: q.state.dataUpdatedAt,
            }));
            localStorage.setItem(PERSIST_KEY, JSON.stringify(minimal));
          } catch {
            // Still failing — clear to prevent repeated throws
            localStorage.removeItem(PERSIST_KEY);
          }
        }
      }, 500);
    });
  }

  return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
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
            headers.set("x-trpc-source", "nextjs-react");
            // Inject Supabase access token for protectedProcedure
            const supabase = createSupabaseBrowserClient();
            const { data } = await supabase.auth.getSession();
            if (data.session?.access_token) {
              headers.set(
                "authorization",
                `Bearer ${data.session.access_token}`,
              );
            }
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
