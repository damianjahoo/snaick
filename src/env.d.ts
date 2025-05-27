/// <reference types="astro/client" />

declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string | undefined;
      } | null;
    }
  }
}

declare module "astro:middleware" {
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string | undefined;
      } | null;
    }
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
