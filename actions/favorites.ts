"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function toggleFavorite(productId: string): Promise<ActionResult<{ isFavorite: boolean }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para dar me gusta" };
  }

  // Verificar si ya existe el like
  const { data: existing } = await supabase
    .from("user_favorites")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    // Si existe, lo borramos (unlike)
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/productos"); // Revalidar la vista de productos
    revalidatePath("/favoritos"); // Revalidar la vista de favoritos
    return { success: true, data: { isFavorite: false } };
  } else {
    // Si no existe, lo insertamos (like)
    const { error } = await supabase
      .from("user_favorites")
      .insert({ user_id: user.id, product_id: productId });

    if (error) return { success: false, error: error.message };

    revalidatePath("/productos");
    revalidatePath("/favoritos");
    return { success: true, data: { isFavorite: true } };
  }
}

export async function getUserFavoriteIds(): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("user_favorites")
    .select("product_id")
    .eq("user_id", user.id);

  if (error || !data) return [];

  return data.map((fav) => fav.product_id);
}

export async function getFavoriteProducts() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: { message: "No autenticado" } };

  // Inner join manual o vía vistas.
  // Pero lo más limpio en Supabase es referenciar directamente.
  const { data, error } = await supabase
    .from("user_favorites")
    .select(`
      product_id,
      product:products (
        *
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  const products = data
    .map((fav) => fav.product)
    .filter((p) => p !== null);

  // Forza el tipo a any[] para evitar problemas de types con Supabase
  return { data: (Array.isArray(products[0]) ? products.flat() : products) as any[], error: null };
}
