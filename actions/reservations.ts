"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

const createReservationSchema = z.object({
  property_id: z.string().uuid(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guest_name: z.string().optional(),
  notes: z.string().optional(),
});

type CreateReservationInput = z.infer<typeof createReservationSchema>;

export async function createReservation(
  input: CreateReservationInput
): Promise<ActionResult<{ id: string }>> {
  const parsed = createReservationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Datos inválidos" };
  }

  if (parsed.data.end_date <= parsed.data.start_date) {
    return { success: false, error: "La fecha de fin debe ser posterior a la de inicio" };
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { data, error } = await supabase
    .from("reservations")
    .insert({ ...parsed.data, created_by: user.id })
    .select("id")
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/departamentos/${parsed.data.property_id}`);
  revalidatePath("/departamentos");
  return { success: true, data: { id: data.id } };
}

export async function deleteReservation(
  id: string
): Promise<ActionResult<null>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { success: false, error: "Solo administradores" };
  }

  const { error } = await supabase.from("reservations").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/departamentos");
  return { success: true, data: null };
}

export async function getReservationsByProperty(propertyId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("property_id", propertyId)
    .order("start_date", { ascending: true });
  return { data, error };
}
