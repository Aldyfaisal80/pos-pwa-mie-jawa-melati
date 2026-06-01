// src/lib/supabase/client.ts
// Browser client — stores session in COOKIES (not localStorage)
// This ensures the session is shared with server-side middleware
import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/env";

export const createSupabaseBrowserClient = () =>
  createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
