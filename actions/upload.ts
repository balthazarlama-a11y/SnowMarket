"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";

const BUCKET = "snowmarket-images";

export async function uploadImages(
  formData: FormData,
  folder: "products" | "properties"
): Promise<ActionResult<{ urls: string[] }>> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  const files = formData.getAll("files") as File[];
  if (files.length === 0) {
    return { success: true, data: { urls: [] } };
  }

  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) {
      errors.push(`${file.name}: ${error.message}`);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(publicUrl);
  }

  if (errors.length > 0 && urls.length === 0) {
    return { success: false, error: errors.join("; ") };
  }

  return { success: true, data: { urls } };
}
