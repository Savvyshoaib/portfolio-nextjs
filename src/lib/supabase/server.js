import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ENV } from "./env";

const SERVER_AUTH_OPTIONS = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
};

export function createSupabaseServerClient({ useServiceRole = false } = {}) {
  const key = useServiceRole ? SUPABASE_ENV.serviceRoleKey : SUPABASE_ENV.anonKey;

  if (!SUPABASE_ENV.url || !key) {
    return null;
  }

  return createClient(SUPABASE_ENV.url, key, SERVER_AUTH_OPTIONS);
}

