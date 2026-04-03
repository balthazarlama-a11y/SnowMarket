"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createProductSchema } from "@/lib/validations/product";
import type { ActionResult } from "@/lib/types";

const BUCKET = "snowmarket-images";

export async function createVerifiedProduct(
  input: {
    title: string;
    description: string;
    detailed_description?: string | null;
    price: number;
    category: string;
    whatsapp_number: string;
    images: string[];
  }
): Promise<ActionResult<{ id: string }>> {
  const parsed = createProductSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Datos invalidos",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...parsed.data,
      owner_id: user.id,
      is_verified: true,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: { id: data.id } };
}

/**
 * Extracts the storage path from a public Supabase URL.
 * e.g. ".../storage/v1/object/public/snowmarket-images/products/abc.jpg"
 *   -> "products/abc.jpg"
 */
function storagePathFromUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function adminDeleteProduct(
  id: string
): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("images")
    .eq("id", id)
    .single();

  if (fetchError || !product) {
    return { success: false, error: "Producto no encontrado" };
  }

  const storagePaths = (product.images as string[])
    .map(storagePathFromUrl)
    .filter((p): p is string => p !== null);

  if (storagePaths.length > 0) {
    await supabase.storage.from(BUCKET).remove(storagePaths);
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/moderation");
  revalidatePath("/productos");
  return { success: true, data: null };
}

export async function adminUpdateProduct(
  input: {
    id: string;
    title: string;
    description: string;
    detailed_description?: string | null;
    price: number;
    category: string;
    whatsapp_number: string;
    images: string[];
    brand?: string | null;
    model?: string | null;
    condition?: string | null;
    size_label?: string | null;
    size_value?: number | null;
    binding_type?: string | null;
    manufacture_year?: number | null;
    included_accessories?: string | null;
    technical_observations?: string | null;
  }
): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { id, ...updates } = input;

  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/moderation");
  revalidatePath("/productos");
  revalidatePath(`/productos/${id}`);
  return { success: true, data: null };
}

export async function toggleProductVerified(
  id: string
): Promise<ActionResult<{ is_verified: boolean }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("is_verified")
    .eq("id", id)
    .single();

  if (fetchError || !product) {
    return { success: false, error: "Producto no encontrado" };
  }

  const newValue = !product.is_verified;
  const { error } = await supabase
    .from("products")
    .update({ is_verified: newValue })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/moderation");
  revalidatePath("/productos");
  return { success: true, data: { is_verified: newValue } };
}
