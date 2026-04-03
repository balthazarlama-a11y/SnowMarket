import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  isPasswordRecoveryPath,
  PASSWORD_RECOVERY_PATH,
  RECOVERY_ACCESS_TOKEN_COOKIE,
  RECOVERY_ACCESS_TOKEN_MAX_AGE_SECONDS,
  RECOVERY_REFRESH_TOKEN_COOKIE,
  RECOVERY_REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth/password-recovery";
import { isPasswordRecoveryJwt } from "@/lib/auth/is-password-recovery-jwt";
import { createClient } from "@supabase/supabase-js";
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
      return NextResponse.redirect(
        `${origin}/auth/sign-in?error=recovery_not_available`
      );
    }

    const ephemeral = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { data, error } = await ephemeral.auth.exchangeCodeForSession(code);
    const accessToken = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    if (!error && accessToken && refreshToken) {
      const treatAsRecovery =
        isPasswordRecoveryPath(next) || isPasswordRecoveryJwt(accessToken);

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

        return response;
      }

      const supabase = await createSupabaseServerClient();
      const { error: setSessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (!setSessionError) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    const dest = isPasswordRecoveryPath(next)
      ? "/auth/forgot-password"
      : "/auth/sign-in";
    const url = new URL(dest, origin);
    if (isPasswordRecoveryPath(next)) {
      url.searchParams.set("error", "invalid_or_expired_reset_link");
    } else {
      url.searchParams.set("error", "confirmation_failed");
    }
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
