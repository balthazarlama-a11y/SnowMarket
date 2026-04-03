/**
 * Detecta sesión de recuperación de contraseña a partir del access token JWT emitido por GoTrue.
 * Usado en el callback PKCE cuando `next` no es /auth/update-password pero el flujo sigue siendo recovery.
 */
export function isPasswordRecoveryJwt(accessToken: string): boolean {
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return false;

  const amr = payload.amr;
  if (Array.isArray(amr)) {
    for (const entry of amr) {
      if (entry === "recovery") return true;
      if (
        entry &&
        typeof entry === "object" &&
        "method" in entry &&
        String((entry as { method?: string }).method).toLowerCase() === "recovery"
      ) {
        return true;
      }
    }
  }

  return false;
}

function decodeJwtPayload(accessToken: string): Record<string, unknown> | null {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}
