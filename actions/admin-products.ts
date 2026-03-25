"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createProductSchema } from "@/lib/validations/product";
import type { ActionResult } from "@/lib/types";

export async function createVerifiedProduct(
  input: {
    title: string;
    description: string;
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
