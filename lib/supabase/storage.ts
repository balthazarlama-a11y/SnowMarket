import { createSupabaseServerClient } from "./server";

const BUCKET_NAME = "snowmarket-images";

export async function uploadImage(
  file: File,
  folder: "products" | "properties"
): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = await createSupabaseServerClient();

    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);

    return { url: publicUrl };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Error al subir imagen",
    };
  }
}

export async function uploadMultipleImages(
  files: File[],
  folder: "products" | "properties"
): Promise<{ urls: string[]; errors: string[] }> {
  const results = await Promise.allSettled(
    files.map((file) => uploadImage(file, folder))
  );

  const urls: string[] = [];
  const errors: string[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      if ("url" in result.value) {
        urls.push(result.value.url);
      } else {
        errors.push(result.value.error);
      }
    } else {
      errors.push(result.reason?.message ?? "Error desconocido");
    }
  }

  return { urls, errors };
}
