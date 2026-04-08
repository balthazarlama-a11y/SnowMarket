import {
  isPasswordRecoveryPath,
  PASSWORD_RECOVERY_PATH,
  RECOVERY_ACCESS_TOKEN_COOKIE,
  RECOVERY_ACCESS_TOKEN_MAX_AGE_SECONDS,
  RECOVERY_REFRESH_TOKEN_COOKIE,
  RECOVERY_REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth/password-recovery";
import { isPasswordRecoveryJwt } from "@/lib/auth/is-password-recovery-jwt";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/** Evita redirecciones abiertas: solo rutas relativas internas. */
function safeNextPath(next: string | null): string {
  const fallback = "/";
  if (!next || typeof next !== "string") return fallback;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://") || trimmed.includes("\\")) return fallback;
  return trimmed;
}

function recoveryCookieOptions(maxAge: number, secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge,
  };
}

/** Aplica cookies pendientes al NextResponse de redirección. */
function applyPendingCookies(
  response: NextResponse,
  pendingCookies: Array<{ name: string; value: string; options?: CookieOptions }>,
) {
  for (const { name, value, options } of pendingCookies) {
    response.cookies.set(name, value, options);
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));
  const authError = searchParams.get("error");
  const authErrorCode = searchParams.get("error_code");
  const authErrorDescription = searchParams.get("error_description");
  const isSecure = new URL(request.url).protocol === "https:";

  if (isPasswordRecoveryPath(next) && authError) {
    const url = new URL("/auth/forgot-password", origin);
    url.searchParams.set("error", "invalid_or_expired_reset_link");
    if (authErrorCode) url.searchParams.set("error_code", authErrorCode);
    if (authErrorDescription) {
      url.searchParams.set("error_description", authErrorDescription);
    }
    return NextResponse.redirect(url);
  }

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("[auth/callback] Missing Supabase env vars");
      return NextResponse.redirect(
        `${origin}/auth/sign-in?error=recovery_not_available`
      );
    }

    // Collect all cookies that the Supabase client wants to set during the
    // code exchange so we can apply them to the final NextResponse.redirect().
    // Previously, session cookies were suppressed here and re-set via
    // cookieStore.set() — but those writes don't propagate to a separately
    // created NextResponse, causing the session to be lost on redirect.
    const cookieStore = await cookies();
    const pendingCookies: Array<{ name: string; value: string; options?: CookieOptions }> = [];

    const exchangeClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            pendingCookies.push(cookie);
          }
        },
      },
    });

    const isRecovery = isPasswordRecoveryPath(next);
    console.log(
      "[auth/callback] exchangeCodeForSession — next=%s, isRecovery=%s, hasError=%s",
      next,
      isRecovery,
      Boolean(authError),
    );

    const { data, error } = await exchangeClient.auth.exchangeCodeForSession(code);
    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    if (error) {
      console.error("[auth/callback] exchangeCodeForSession FAILED:", error.message);
    }

    if (!error && accessToken && refreshToken) {
      const treatAsRecovery = isRecovery || isPasswordRecoveryJwt(accessToken);
      console.log(
        "[auth/callback] flow=%s, redirectTo=%s",
        treatAsRecovery ? "recovery" : "signup-confirmation",
        treatAsRecovery ? PASSWORD_RECOVERY_PATH : next,
      );

      if (treatAsRecovery) {
        const response = NextResponse.redirect(`${origin}${PASSWORD_RECOVERY_PATH}`);

        response.cookies.set({
          name: RECOVERY_ACCESS_TOKEN_COOKIE,
          value: accessToken,
          ...recoveryCookieOptions(RECOVERY_ACCESS_TOKEN_MAX_AGE_SECONDS, isSecure),
        });

        response.cookies.set({
          name: RECOVERY_REFRESH_TOKEN_COOKIE,
          value: refreshToken,
          ...recoveryCookieOptions(RECOVERY_REFRESH_TOKEN_MAX_AGE_SECONDS, isSecure),
        });

        // Apply code-verifier cleanup cookies to the response
        for (const { name, value, options } of pendingCookies) {
          if (name.endsWith("-code-verifier")) {
            response.cookies.set(name, value, options);
          }
        }

        return response;
      }

      // Signup email confirmation: apply ALL session cookies from the exchange
      // (auth tokens + code-verifier cleanup) directly to the redirect response.
      const response = NextResponse.redirect(`${origin}${next}`);
      applyPendingCookies(response, pendingCookies);
      console.log("[auth/callback] signup confirmation success — cookies applied, redirecting to %s", next);
      return response;
    }

    // Exchange failed — redirect to appropriate error page
    const dest = isRecovery ? "/auth/forgot-password" : "/auth/sign-in";
    const url = new URL(dest, origin);
    if (isRecovery) {
      url.searchParams.set("error", "invalid_or_expired_reset_link");
    } else {
      url.searchParams.set("error", "confirmation_failed");
    }
    console.error("[auth/callback] exchange failed — redirecting to %s", dest);
    const response = NextResponse.redirect(url);
    response.cookies.delete(RECOVERY_ACCESS_TOKEN_COOKIE);
    response.cookies.delete(RECOVERY_REFRESH_TOKEN_COOKIE);
    return response;
  }

  if (isPasswordRecoveryPath(next)) {
    return NextResponse.redirect(
      `${origin}/auth/forgot-password?error=invalid_or_expired_reset_link`
    );
  }

  return NextResponse.redirect(`${origin}/auth/sign-in?error=confirmation_failed`);
}
