"use client";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ENV } from "./env";

let browserClient = null;

export function getSupabaseBrowserClient() {
  if (browserClient) {
    return browserClient;
  }

  if (!SUPABASE_ENV.hasPublicEnv) {
    return null;
  }

  browserClient = createClient(SUPABASE_ENV.url, SUPABASE_ENV.anonKey);
  return browserClient;
}

