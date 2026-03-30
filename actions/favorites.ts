"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

export async function toggleFavorite(
  itemId: string,
  itemType: "product" | "property" = "product"
): Promise<ActionResult<{ isFavorite: boolean }>> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Debes iniciar sesión para dar me gusta" };
  }

  const column = itemType === "product" ? "product_id" : "property_id";

  // Verificar si ya le dio like usando equals al id para la columna seleccionada
  const { data: existingLike, error: checkError } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq(column, itemId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    return { success: false, error: "Error verificando estado de favorito" };
  }

  if (existingLike) {
    // Si ya existe, lo eliminamos (dislike)
    const { error: deleteError } = await supabase
      .from("user_favorites")
      .delete()
      .eq("id", existingLike.id); // Usamos el id interno para borrar especificamente esa fila

    if (deleteError) {
      return { success: false, error: "Error al quitar de favoritos" };
    }
    
    // Invalidamos cats para que la UI se entere del dislike en la bd en su recarga
    revalidatePath("/productos");
    revalidatePath("/departamentos");
    revalidatePath("/favoritos");
    return { success: true, data: { isFavorite: false } };
  }

  // Si no existe, lo creamos (like)
  const payload: any = { user_id: user.id };
  payload[column] = itemId;

  const { error: insertError } = await supabase
    .from("user_favorites")
    .insert(payload);

  if (insertError) {
    return { success: false, error: "Error al agregar a favoritos: " + insertError.message };
  }

  revalidatePath("/productos");
  revalidatePath("/departamentos");
  revalidatePath("/favoritos");
  return { success: true, data: { isFavorite: true } };
}

export async function getUserFavoriteIds(
  itemType: "product" | "property" = "product"
): Promise<string[]> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const column = itemType === "product" ? "product_id" : "property_id";

  const { data, error } = await supabase
    .from("user_favorites")
    .select(column)
    .eq("user_id", user.id)
    .not(column, "is", null);

  if (error || !data) return [];

  return data.map((fav: any) => fav[column]);
}

export async function getFavoriteProducts() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: new Error("No autenticado") };

  const { data, error } = await supabase
    .from("user_favorites")
    .select(`
      product:products (
        *, 
        owner:users!products_owner_id_fkey(id, email)
      )
    `)
    .eq("user_id", user.id)
    .not("product_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  const products = data
    .map((fav: any) => fav.product)
    .filter((p) => p !== null);

  return { data: (Array.isArray(products[0]) ? products.flat() : products) as any[], error: null };
}

export async function getFavoriteProperties() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: new Error("No autenticado") };

  const { data, error } = await supabase
    .from("user_favorites")
    .select(`
      property:properties (
        *, 
        creator:users!properties_created_by_fkey(id, email)
      )
    `)
    .eq("user_id", user.id)
    .not("property_id", "is", null)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error };

  const properties = data
    .map((fav: any) => fav.property)
    .filter((p) => p !== null);

  return { data: (Array.isArray(properties[0]) ? properties.flat() : properties) as any[], error: null };
}
