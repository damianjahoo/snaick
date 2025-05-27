import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client.ts";

// Public paths - Auth API endpoints & Server-Rendered Astro Pages
const PUBLIC_PATHS = [
  // Server-Rendered Astro Pages
  "/",
  "/login",
  "/register",
  "/reset-password",
  // Auth API endpoints
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/reset-password",
];

// Paths that should redirect authenticated users
const AUTH_ONLY_PATHS = ["/login", "/register"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, locals, redirect, cookies, request } = context;

  // Simple test - if accessing /generate without proper setup, redirect to login
  if (url.pathname === "/generate") {
    // Check if we have basic env vars
    if (!import.meta.env.SUPABASE_URL || !import.meta.env.SUPABASE_KEY) {
      return redirect("/login");
    }
  }

  try {
    // Create Supabase server instance with proper SSR support
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    // IMPORTANT: Always get user session first before any other operations
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      (locals as typeof locals & { user: { id: string; email: string | undefined } | null }).user = {
        email: user.email,
        id: user.id,
      };
    } else {
      (locals as typeof locals & { user: { id: string; email: string | undefined } | null }).user = null;
    }

    // Check if current path is public
    const isPublicPath = PUBLIC_PATHS.some((path) => url.pathname === path || url.pathname.startsWith(path));

    // Check if current path is auth-only (login/register)
    const isAuthOnlyPath = AUTH_ONLY_PATHS.includes(url.pathname);

    // If user is authenticated and tries to access auth-only pages, redirect to main app
    if (user && isAuthOnlyPath) {
      return redirect("/generate");
    }

    // If user is not authenticated and tries to access protected routes, redirect to login
    if (!user && !isPublicPath) {
      return redirect("/login");
    }
    return next();
  } catch (error) {
    console.error("Middleware error:", error);

    // On error, treat as unauthenticated
    (locals as typeof locals & { user: { id: string; email: string | undefined } | null }).user = null;

    // If trying to access protected route, redirect to login
    const isPublicPath = PUBLIC_PATHS.some((path) => url.pathname === path || url.pathname.startsWith(path));

    if (!isPublicPath) {
      return redirect("/login");
    }

    return next();
  }
});
