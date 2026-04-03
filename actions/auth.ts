"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/auth/site-url";
import { redirect } from "next/navigation";
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

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error:
        "El enlace expiro o no es valido. Solicita un nuevo correo desde Olvide mi contrasena.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

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

  redirect("/");
}
