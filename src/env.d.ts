/// <reference types="astro/client" />

import type { SupabaseClient } from "@supabase/supabase-js";

declare namespace App {
  interface Locals {
    supabase: SupabaseClient;
    user: {
      id: string;
      email: string | undefined;
    } | null;
    runtime: import("@astrojs/cloudflare/runtime").Runtime<Env>;
  }
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly OPENROUTER_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
