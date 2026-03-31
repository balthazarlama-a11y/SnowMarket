"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/actions/products";
import { uploadImages } from "@/actions/upload";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  CONDITION_LABELS,
  POPULAR_BRANDS,
  CLOTHING_SIZES,
  type ProductCategory,
} from "@/lib/validations/product";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const validFiles = selected.filter((f) => {
      if (f.size > 6 * 1024 * 1024) {
        toast.error(`${f.name} excede 6MB`);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [
      ...prev,
      ...validFiles.map((f) => URL.createObjectURL(f)),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    const form = new FormData(e.currentTarget);

    let imageUrls: string[] = [];
    if (files.length > 0) {
      const uploadData = new FormData();
      files.forEach((f) => uploadData.append("files", f));
      const uploadResult = await uploadImages(uploadData, "products");
      if (uploadResult.success) {
        imageUrls = uploadResult.data.urls;
      } else {
        toast.error(`Error subiendo imágenes: ${uploadResult.error}`);
        setLoading(false);
        return;
      }
    }

    const sizeVal = form.get("size_value") as string;
    const result = await createProduct({
      title: form.get("title") as string,
      description: form.get("description") as string,
      detailed_description: (form.get("detailed_description") as string) || null,
      price: Number(form.get("price")),
      category: form.get("category") as ProductCategory,
      whatsapp_number: form.get("whatsapp_number") as string,
      images: imageUrls,
      brand: (form.get("brand") as string) || null,
      condition: (form.get("condition") as any) || null,
      size_label: (form.get("size_label") as string) || null,
      size_value: sizeVal ? Number(sizeVal) : null,
    });

    setLoading(false);

    if (result.success) {
      toast.success("Producto publicado exitosamente");
      router.push("/mis-productos");
    } else {
      toast.error(result.error);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl">
            Publicar Producto
          </CardTitle>
          <CardDescription>
            Completa los datos de tu equipo de esquí. Se publicará como producto
            de la comunidad.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                required
                minLength={3}
                placeholder="Ej: Esquís Rossignol Hero 170cm"
              />
              {fieldErrors.title && (
                <p className="text-sm text-destructive">{fieldErrors.title[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="Describe el estado, talla, temporadas de uso..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailed_description">Descripción detallada (opcional)</Label>
              <Textarea
                id="detailed_description"
                name="detailed_description"
                rows={6}
                placeholder="Incluye estado real, marca, modelo, fijaciones, historial de uso, mantenciones y cualquier detalle técnico relevante."
              />
              <p className="text-xs text-muted-foreground">
                Esta descripción aparecerá en la publicación para dar contexto completo al comprador.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Precio (CLP)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={0}
                  step="1"
                  required
                  placeholder="150000"
                />
                {fieldErrors.price && (
                  <p className="text-sm text-destructive">
                    {fieldErrors.price[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Seleccionar...</option>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand">Marca (opcional)</Label>
                <select
                  id="brand"
                  name="brand"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Sin especificar</option>
                  {POPULAR_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Estado (opcional)</Label>
                <select
                  id="condition"
                  name="condition"
                  className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Sin especificar</option>
                  {PRODUCT_CONDITIONS.map((c) => (
                    <option key={c} value={c}>{CONDITION_LABELS[c]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="size_label">Talla (opcional)</Label>
                <Input id="size_label" name="size_label" placeholder="Ej: L, 27.5, 170cm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size_value">Medida en cm (opcional)</Label>
                <Input id="size_value" name="size_value" type="number" step="0.1" placeholder="170" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">Tu WhatsApp</Label>
              <Input
                id="whatsapp_number"
                name="whatsapp_number"
                required
                placeholder="+56 9 1234 5678"
              />
              {fieldErrors.whatsapp_number && (
                <p className="text-sm text-destructive">
                  {fieldErrors.whatsapp_number[0]}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Número chileno con código +56. Los compradores te contactarán aquí.
              </p>
            </div>

            {/* Image upload */}
            <div className="space-y-2">
              <Label>Imágenes</Label>
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-accent hover:bg-secondary/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Haz clic para seleccionar imágenes
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  JPG, PNG o WebP — máximo 6MB por archivo
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {previews.map((src, i) => (
                    <div key={i} className="group relative size-20 overflow-hidden rounded-lg">
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="size-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" data-icon="inline-start" />
              )}
              {loading ? "Publicando..." : "Publicar Producto"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
