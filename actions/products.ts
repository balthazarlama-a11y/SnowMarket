"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createProductSchema,
  updateProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/lib/validations/product";
import type { ActionResult } from "@/lib/types";

export async function createProduct(
  input: CreateProductInput
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesion para publicar" };
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...parsed.data,
      owner_id: user.id,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/mis-productos");
  revalidatePath("/productos");
  revalidatePath("/snowboard");
  return { success: true, data: { id: data.id } };
}

export async function updateProduct(
  input: UpdateProductInput
): Promise<ActionResult<null>> {
  const parsed = updateProductSchema.safeParse(input);
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

  const { id, ...updates } = parsed.data;
  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .eq("owner_id", user.id); // Security: ensure they own the product they are updating

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/mis-productos");
  revalidatePath("/productos");
  revalidatePath("/snowboard");
  revalidatePath(`/productos/${id}`);
  return { success: true, data: null };
}

export async function deleteProduct(
  id: string
): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: null };
}

export async function getProducts(filters?: {
  category?: string;
  categories?: string[];
  verified?: boolean;
}) {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("products")
    .select("*, owner:users!products_owner_id_fkey(id, email)")
    .order("created_at", { ascending: false });

  if (filters?.categories && filters.categories.length > 0) {
    query = query.in("category", filters.categories);
  } else if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.verified !== undefined) {
    query = query.eq("is_verified", filters.verified);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function getProductById(id: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, owner:users!products_owner_id_fkey(id, email)")
    .eq("id", id)
    .single();
  return { data, error };
}
