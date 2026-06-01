// Re-export the singleton browser client to prevent duplicate GoTrueClient instances.
// DO NOT use createClient() from @supabase/supabase-js here — it creates a separate
// GoTrueClient that causes "Multiple GoTrueClient instances" warnings.
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export const supabase = createSupabaseBrowserClient();
