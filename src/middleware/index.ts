import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client";

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
  const runtime = locals.runtime;

  if (!runtime) {
    // If runtime is not available, proceed without user context
    return next();
  }

  const { env } = runtime;

  // Simple test - if accessing /generate without proper setup, redirect to login
  if (url.pathname === "/generate") {
    // Check if we have basic env vars
    if (!env.SUPABASE_URL || !env.SUPABASE_KEY) {
      return redirect("/login");
    }
  }

  try {
    // Create Supabase server instance with proper SSR support
    const supabase = createSupabaseServerInstance({ headers: request.headers, cookies }, env);
    locals.supabase = supabase;

    // IMPORTANT: Always get user session first before any other operations
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      locals.user = {
        id: user.id,
        email: user.email,
      };
    } else {
      locals.user = null;
    }

    // Check if current path is public
    const isPublicPath = PUBLIC_PATHS.some((path) => {
      if (path === "/") {
        return url.pathname === "/";
      }
      return url.pathname === path || url.pathname.startsWith(path);
    });

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

    locals.supabase = createSupabaseServerInstance({ headers: request.headers, cookies }, env);
    const response = await next();
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  } catch {
    // On error, treat as unauthenticated
    locals.user = null;

    // If trying to access protected route, redirect to login
    const isPublicPath = PUBLIC_PATHS.some((path) => {
      if (path === "/") {
        return url.pathname === "/";
      }
      return url.pathname === path || url.pathname.startsWith(path);
    });

    if (!isPublicPath) {
      return redirect("/login");
    }

    locals.supabase = createSupabaseServerInstance({ headers: request.headers, cookies }, env);
    const response = await next();
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  }
});
