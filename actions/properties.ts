"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createPropertySchema,
  updatePropertySchema,
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "@/lib/validations/property";
import type { ActionResult } from "@/lib/types";

const PROPERTY_STATUSES = ["activo", "pausado", "arrendado", "vendido"] as const;
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];

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

  revalidatePath("/dashboard/properties");
  revalidatePath("/dashboard/properties/manage");
  revalidatePath("/departamentos");

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

  revalidatePath("/dashboard/properties");
  revalidatePath("/dashboard/properties/manage");
  revalidatePath("/departamentos");
  revalidatePath(`/departamentos/${id}`);

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

  revalidatePath("/dashboard/properties/manage");
  revalidatePath("/departamentos");

  return { success: true, data: null };
}

export async function updatePropertyStatus(
  id: string,
  status: PropertyStatus
): Promise<ActionResult<null>> {
  if (!PROPERTY_STATUSES.includes(status)) {
    return { success: false, error: "Estado inválido" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { error } = await supabase
    .from("properties")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/properties/manage");
  revalidatePath("/departamentos");
  return { success: true, data: null };
}

export async function getProperties(opts?: { includeHidden?: boolean }) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("properties")
    .select("*, creator:users(id, email)")
    .order("created_at", { ascending: false });

  if (!opts?.includeHidden) {
    query = query.in("status", ["activo", "arrendado"]);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function getAllPropertiesAdmin() {
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
