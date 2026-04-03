/**
 * URL base pública de la app (sin barra final).
 *
 * Supabase Auth (confirmación de correo y recuperación de contraseña) exige
 * `redirectTo` / `emailRedirectTo` absolutos que coincidan con la lista de
 * **Redirect URLs** del proyecto.
 *
 * Configuración en Supabase Dashboard → Authentication → URL Configuration:
 * - **Site URL**: producción, p. ej. `https://tu-dominio.vercel.app` (o tu dominio custom).
 * - **Redirect URLs**: incluir todas las URLs a las que puede redirigir el auth, por ejemplo:
 *   - `http://localhost:3000/auth/callback`
 *   - `https://tu-dominio.vercel.app/auth/callback`
 *   (y la misma base si usas preview deployments: `https://*.vercel.app/auth/callback` si tu plan lo permite,
 *   o cada preview explícita).
 *
 * En Vercel define `NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app` en Environment Variables (Production).
 * En local, `.env.local` puede tener `NEXT_PUBLIC_SITE_URL=http://localhost:3000` o se usa el fallback.
 *
 * Sin `NEXT_PUBLIC_SITE_URL`, en Vercel se usa `VERCEL_URL` (sin protocolo; aquí se antepone https://).
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  return "http://localhost:3000";
}
