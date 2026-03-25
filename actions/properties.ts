"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createPropertySchema,
  updatePropertySchema,
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "@/lib/validations/property";
import type { ActionResult } from "@/lib/types";

export async function createProperty(
  input: CreatePropertyInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = createPropertySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Datos invalidos",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const appMetadata = user.app_metadata;
  if (appMetadata?.role !== "admin") {
    return { success: false, error: "Solo administradores pueden publicar propiedades" };
  }

  const { data, error } = await supabase
    .from("properties")
    .insert({
      ...parsed.data,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: { id: data.id } };
}

export async function updateProperty(
  input: UpdatePropertyInput
): Promise<ActionResult<null>> {
  const parsed = updatePropertySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Datos invalidos",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { id, ...updates } = parsed.data;
  const { error } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: null };
}

export async function deleteProperty(
  id: string
): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: null };
}

export async function getProperties() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, creator:users(id, email)")
    .order("created_at", { ascending: false });
  return { data, error };
}

export async function getPropertyById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*, creator:users(id, email)")
    .eq("id", id)
    .single();
  return { data, error };
}
