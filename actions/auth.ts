"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/auth/site-url";
import {
  RECOVERY_ACCESS_TOKEN_COOKIE,
  RECOVERY_ACCESS_TOKEN_MAX_AGE_SECONDS,
  RECOVERY_REFRESH_TOKEN_COOKIE,
  RECOVERY_REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth/password-recovery";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { ActionResult } from "@/lib/types";

const authSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(6, "Minimo 6 caracteres"),
});

const resetEmailSchema = z.object({
  email: z.string().email("Email invalido"),
});

const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Minimo 8 caracteres")
      .max(72, "Demasiado largo"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contrasenas no coinciden",
    path: ["confirmPassword"],
  });

type RecoveryReason =
  | "invalid_link"
  | "otp_expired"
  | "configuration_error"
  | "technical_error";

type RecoveryActionResult =
  | { success: true; data: { ready: true } }
  | { success: false; error: string; reason: RecoveryReason };

function getRecoveryFailure(error: unknown): RecoveryActionResult {
  const message =
    error && typeof error === "object" && "message" in error
      ? String((error as { message?: unknown }).message ?? "")
      : "";

  const msg = message.toLowerCase();

  if (msg.includes("otp") || msg.includes("expired") || msg.includes("invalid")) {
    return {
      success: false,
      reason: "otp_expired",
      error: "El enlace de recuperacion expiro o ya fue usado. Solicita uno nuevo.",
    };
  }

  if (msg.includes("redirect") || msg.includes("url") || msg.includes("config")) {
    return {
      success: false,
      reason: "configuration_error",
      error:
        "La configuracion de recuperacion en Supabase no es valida. Revisa Site URL y Redirect URLs.",
    };
  }

  return {
    success: false,
    reason: "technical_error",
    error: message || "No se pudo validar el enlace de recuperacion.",
  };
}

function setRecoveryCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  accessToken: string,
  refreshToken: string
) {
  const secure = process.env.NODE_ENV === "production";

  cookieStore.set({
    name: RECOVERY_ACCESS_TOKEN_COOKIE,
    value: accessToken,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: RECOVERY_ACCESS_TOKEN_MAX_AGE_SECONDS,
  });

  cookieStore.set({
    name: RECOVERY_REFRESH_TOKEN_COOKIE,
    value: refreshToken,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: RECOVERY_REFRESH_TOKEN_MAX_AGE_SECONDS,
  });
}

function clearRecoveryCookies(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  cookieStore.delete(RECOVERY_ACCESS_TOKEN_COOKIE);
  cookieStore.delete(RECOVERY_REFRESH_TOKEN_COOKIE);
}

export async function clearPasswordRecoverySession(): Promise<void> {
  const cookieStore = await cookies();
  clearRecoveryCookies(cookieStore);
}

export async function setPasswordRecoverySessionFromTokens(input: {
  accessToken?: string;
  refreshToken?: string;
  type?: string;
}): Promise<RecoveryActionResult> {
  const accessToken = input.accessToken?.trim();
  const refreshToken = input.refreshToken?.trim();
  const type = input.type?.trim();

  if (type && type !== "recovery") {
    return {
      success: false,
      reason: "invalid_link",
      error: "El enlace no corresponde a recuperacion de contrasena.",
    };
  }

  if (!accessToken || !refreshToken) {
    return {
      success: false,
      reason: "invalid_link",
      error: "Faltan credenciales de recuperacion en el enlace.",
    };
  }

  const cookieStore = await cookies();
  setRecoveryCookies(cookieStore, accessToken, refreshToken);
  return { success: true, data: { ready: true } };
}

export async function preparePasswordRecoveryFromLink(input: {
  code?: string;
  tokenHash?: string;
  type?: string;
}): Promise<RecoveryActionResult> {
  const code = input.code?.trim();
  const tokenHash = input.tokenHash?.trim();
  const type = input.type?.trim();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[auth/recovery] Missing Supabase env vars for recovery flow.");
    return {
      success: false,
      reason: "configuration_error",
      error:
        "No se pudo completar la recuperacion por configuracion del servidor.",
    };
  }

  if (!code && !tokenHash) {
    return {
      success: false,
      reason: "invalid_link",
      error: "El enlace de recuperacion no incluye un token valido.",
    };
  }

  const recoveryClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  try {
    let accessToken: string | undefined;
    let refreshToken: string | undefined;

    if (code) {
      const { data, error } = await recoveryClient.auth.exchangeCodeForSession(code);
      if (error) {
        const failure = getRecoveryFailure(error);
        console.error("[auth/recovery] exchangeCodeForSession failed:", error.message);
        return failure;
      }
      accessToken = data.session?.access_token;
      refreshToken = data.session?.refresh_token;
    } else {
      if (type !== "recovery") {
        return {
          success: false,
          reason: "invalid_link",
          error: "El enlace no corresponde a recuperacion de contrasena.",
        };
      }

      const { data, error } = await recoveryClient.auth.verifyOtp({
        type: "recovery",
        token_hash: tokenHash!,
      });

      if (error) {
        const failure = getRecoveryFailure(error);
        console.error("[auth/recovery] verifyOtp failed:", error.message);
        return failure;
      }

      accessToken = data.session?.access_token;
      refreshToken = data.session?.refresh_token;
    }

    if (!accessToken || !refreshToken) {
      return {
        success: false,
        reason: "invalid_link",
        error: "No fue posible obtener una sesion de recuperacion valida.",
      };
    }

    const cookieStore = await cookies();
    setRecoveryCookies(cookieStore, accessToken, refreshToken);
    return { success: true, data: { ready: true } };
  } catch (error) {
    const failure = getRecoveryFailure(error);
    console.error("[auth/recovery] Unexpected recovery error:", error);
    return failure;
  }
}

export async function signUp(
  formData: FormData
): Promise<ActionResult<null>> {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Datos invalidos",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const site = getSiteUrl();
  const emailRedirectTo = `${site}/auth/callback?next=${encodeURIComponent("/")}`;

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("rate") || msg.includes("limit") || msg.includes("many")) {
      return {
        success: false,
        error:
          "Demasiados correos enviados desde este proyecto. Espera unos minutos e intenta de nuevo.",
      };
    }
    return { success: false, error: error.message };
  }

  return { success: true, data: null };
}

export async function signIn(
  formData: FormData
): Promise<ActionResult<null>> {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Datos invalidos",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Envía correo de recuperación. Supabase no indica si el email existe (anti-enumeración);
 * ante éxito técnico, la UI debe mostrar un mensaje genérico.
 */
export async function requestPasswordReset(
  formData: FormData
): Promise<ActionResult<{ sent: true }>> {
  const parsed = resetEmailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Datos invalidos",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const site = getSiteUrl();
  const redirectTo = `${site}/auth/callback?next=${encodeURIComponent("/auth/update-password")}`;

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo }
  );

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("rate") || msg.includes("limit") || msg.includes("many")) {
      return {
        success: false,
        error: "Demasiados intentos. Espera unos minutos e intenta de nuevo.",
      };
    }
    if (msg.includes("redirect") || msg.includes("url")) {
      return {
        success: false,
        error:
          "Error de configuracion del enlace de recuperacion. Contacta soporte si persiste.",
      };
    }
    return { success: false, error: error.message };
  }

  return { success: true, data: { sent: true } };
}

export async function updatePassword(formData: FormData): Promise<ActionResult<null>> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<
      string,
      string[]
    >;
    const first =
      fieldErrors.password?.[0] ??
      fieldErrors.confirmPassword?.[0] ??
      "Datos invalidos";
    return { success: false, error: first, fieldErrors };
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(RECOVERY_ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = cookieStore.get(RECOVERY_REFRESH_TOKEN_COOKIE)?.value;
  const hasRecoverySession = Boolean(accessToken && refreshToken);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let error: { message: string } | null = null;

  if (hasRecoverySession) {
    if (!accessToken || !refreshToken) {
      return {
        success: false,
        error:
          "El enlace expiro o no es valido. Solicita un nuevo correo desde Olvide mi contrasena.",
      };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        error:
          "No se pudo completar la recuperacion por configuracion del servidor.",
      };
    }

    const recoveryClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const { error: setSessionError } = await recoveryClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (setSessionError) {
      cookieStore.delete(RECOVERY_ACCESS_TOKEN_COOKIE);
      cookieStore.delete(RECOVERY_REFRESH_TOKEN_COOKIE);
      return {
        success: false,
        error:
          "Sesion de recuperacion invalida o expirada. Solicita un nuevo enlace.",
      };
    }

    const updateResult = await recoveryClient.auth.updateUser({
      password: parsed.data.password,
    });

    error = updateResult.error;
    cookieStore.delete(RECOVERY_ACCESS_TOKEN_COOKIE);
    cookieStore.delete(RECOVERY_REFRESH_TOKEN_COOKIE);
  } else if (user) {
    const updateResult = await supabase.auth.updateUser({
      password: parsed.data.password,
    });
    error = updateResult.error;
  } else {
    return {
      success: false,
      error:
        "El enlace expiro o no es valido. Solicita un nuevo correo desde Olvide mi contrasena.",
    };
  }

  if (error) {
    if (error.message.toLowerCase().includes("session")) {
      return {
        success: false,
        error:
          "Sesion invalida o expirada. Abre de nuevo el enlace del correo o solicita uno nuevo.",
      };
    }
    return { success: false, error: error.message };
  }

  if (!hasRecoverySession && user) {
    redirect("/");
  }

  redirect("/auth/sign-in?reset=success");
}
