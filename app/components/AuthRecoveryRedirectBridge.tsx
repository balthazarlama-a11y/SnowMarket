"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Señales de recuperación Supabase (hash implícito, PKCE con code, errores otp, etc.).
 * Importante: el flujo PKCE suele dejar `?code=...` sin `type=recovery`; si exigimos type+code,
 * el usuario cae en Site URL (/) y nunca se redirige a /auth/update-password.
 */
function isRecoverySignal(url: URL, pathname: string): boolean {
  if (pathname.startsWith("/auth/callback")) return false;

  const query = url.searchParams;
  const hash = new URLSearchParams(url.hash.startsWith("#") ? url.hash.slice(1) : "");

  const read = (key: string) => hash.get(key) ?? query.get(key);

  const type = read("type");
  const hasTokens = Boolean(read("access_token")?.trim() && read("refresh_token")?.trim());
  const hasTokenHash = Boolean(read("token_hash")?.trim());
  const code = read("code")?.trim();
  const hasCode = Boolean(code);
  const errorCode = read("error_code");
  const hasError = Boolean(read("error")?.trim());

  if (type === "recovery") return true;
  if (hasTokens) return true;
  if (hasTokenHash) return true;
  if (errorCode === "otp_expired") return true;
  if (hasError && (errorCode || read("error_description"))) return true;

  // PKCE: `code` sin type en query; limitar a / y rutas /auth (evita ?code= cupones en tienda).
  if (hasCode) {
    if (pathname === "/") return true;
    if (pathname.startsWith("/auth/") && pathname !== "/auth/callback") return true;
  }

  return false;
}

export function AuthRecoveryRedirectBridge() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/auth/update-password") return;

    const url = new URL(window.location.href);
    if (!isRecoverySignal(url, pathname)) return;

    const target = `/auth/update-password${url.search}${url.hash}`;
    router.replace(target);
  }, [pathname, router]);

  return null;
}
