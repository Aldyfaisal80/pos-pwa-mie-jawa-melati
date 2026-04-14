// src/lib/supabase/server.ts
// Server client — reads/writes session from COOKIES (for RSC, API routes, tRPC)
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/env";

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
              cookieStore.set(name, value, options as any);
            });
          } catch {
            // setAll called from Server Component — can be safely ignored
            // Middleware handles cookie refresh
          }
        },
      },
    },
  );
};
