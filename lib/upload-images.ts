import { uploadImages } from "@/actions/upload";
import { compressImage } from "./compress-image";

export type ImageUploadStatus =
  | "pending"
  | "compressing"
  | "uploading"
  | "done"
  | "error";

export type ImageUploadProgress = Record<string, ImageUploadStatus>;

/**
 * Compresses and uploads images in batches of `batchSize` (default 2).
 * Reports per-file status via `onProgress`.
 */
export async function uploadImagesWithProgress(
  files: File[],
  folder: "products" | "properties",
  onProgress: (statuses: ImageUploadProgress) => void,
  batchSize = 2
): Promise<{ urls: string[]; errors: string[] }> {
  const statuses: ImageUploadProgress = {};
  for (const f of files) statuses[f.name] = "pending";
  onProgress({ ...statuses });

  // Phase 1: compress sequentially
  const compressed: File[] = [];
  for (let i = 0; i < files.length; i++) {
    statuses[files[i].name] = "compressing";
    onProgress({ ...statuses });
    compressed.push(await compressImage(files[i]));
  }

  // Phase 2: upload in batches
  const urls: string[] = [];
  const errors: string[] = [];

  for (let i = 0; i < compressed.length; i += batchSize) {
    const batch = compressed.slice(i, i + batchSize);
    const batchOriginals = files.slice(i, i + batchSize);

    for (const f of batchOriginals) statuses[f.name] = "uploading";
    onProgress({ ...statuses });

    const formData = new FormData();
    for (const f of batch) formData.append("files", f);

    const result = await uploadImages(formData, folder);

    if (result.success) {
      urls.push(...result.data.urls);
      for (const f of batchOriginals) statuses[f.name] = "done";
    } else {
      errors.push(result.error);
      for (const f of batchOriginals) statuses[f.name] = "error";
    }
    onProgress({ ...statuses });
  }

  return { urls, errors };
}
