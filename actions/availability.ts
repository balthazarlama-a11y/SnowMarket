"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

const dateRangeSchema = z.object({
  property_id: z.string().uuid(),
  available_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  available_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type AvailabilityRange = {
  id: string;
  property_id: string;
  available_from: string;
  available_to: string;
};

export async function addAvailabilityRange(
  input: z.infer<typeof dateRangeSchema>
): Promise<ActionResult<{ id: string }>> {
  const parsed = dateRangeSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Datos invalidos" };

  if (parsed.data.available_to <= parsed.data.available_from) {
    return { success: false, error: "La fecha de fin debe ser posterior a la de inicio" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { data, error } = await supabase
    .from("availability_calendar")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath(`/departamentos/${parsed.data.property_id}`);
  revalidatePath("/departamentos");
  return { success: true, data: { id: data.id } };
}

export async function deleteAvailabilityRange(
  id: string
): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { error } = await supabase
    .from("availability_calendar")
    .delete()
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  revalidatePath("/departamentos");
  return { success: true, data: null };
}

export async function getAvailabilityByProperty(
  propertyId: string
): Promise<{ data: AvailabilityRange[] | null; error: any }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("availability_calendar")
    .select("*")
    .eq("property_id", propertyId)
    .order("available_from", { ascending: true });
  return { data, error };
}

export async function getAllAvailability(): Promise<{
  data: AvailabilityRange[] | null;
  error: any;
}> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("availability_calendar")
    .select("*")
    .gte("available_to", new Date().toISOString().split("T")[0])
    .order("available_from", { ascending: true });
  return { data, error };
}
