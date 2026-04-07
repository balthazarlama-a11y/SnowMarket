"use client";

import { useState, useRef, type FormEvent, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/actions/products";
import { uploadImages } from "@/actions/upload";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  CONDITION_LABELS,
  POPULAR_BRANDS,
  type ProductCategory,
  type SkiMode,
} from "@/lib/validations/product";
import { SkiModesField } from "@/app/components/SkiModesField";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, X, ImagePlus, Save } from "lucide-react";
import { toast } from "sonner";

export function EditProductForm({ product }: { product: any }) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // Existing images from DB
  const [existingImages, setExistingImages] = useState<string[]>(product.images || []);
  const [skiModes, setSkiModes] = useState<SkiMode[]>(product.ski_modes || []);
  const [category, setCategory] = useState(product.category || "");
  const [isDragging, setIsDragging] = useState(false);

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

    setNewFiles((prev) => [...prev, ...validFiles]);
    setNewPreviews((prev) => [
      ...prev,
      ...validFiles.map((f) => URL.createObjectURL(f)),
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeNewFile(index: number) {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }
  
  function removeExistingImage(index: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );
    const validFiles = dropped.filter((f) => {
      if (f.size > 6 * 1024 * 1024) {
        toast.error(`${f.name} excede 6MB`);
        return false;
      }
      return true;
    });
    if (validFiles.length === 0) return;
    setNewFiles((prev) => [...prev, ...validFiles]);
    setNewPreviews((prev) => [...prev, ...validFiles.map((f) => URL.createObjectURL(f))]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const formCategory = form.get("category") as string;

    if ((formCategory === "esquis" || formCategory === "snowboard") && skiModes.length === 0) {
      setFieldErrors({ ski_modes: ["Debes seleccionar al menos una modalidad."] });
      setLoading(false);
      return;
    }

    let finalImages = [...existingImages];
    
    if (newFiles.length > 0) {
      const uploadData = new FormData();
      newFiles.forEach((f) => uploadData.append("files", f));
      const uploadResult = await uploadImages(uploadData, "products");
      if (uploadResult.success) {
        finalImages = [...finalImages, ...uploadResult.data.urls];
      } else {
        toast.error(`Error subiendo imágenes nuevas: ${uploadResult.error}`);
        setLoading(false);
        return;
      }
    }

    const sizeVal = form.get("size_value") as string;
    const yearVal = form.get("manufacture_year") as string;
    const result = await updateProduct({
      id: product.id,
      title: form.get("title") as string,
      description: form.get("description") as string,
      detailed_description: (form.get("detailed_description") as string) || null,
      price: Number(form.get("price")),
      category: form.get("category") as ProductCategory,
      whatsapp_number: form.get("whatsapp_number") as string,
      images: finalImages,
      brand: (form.get("brand") as string) || null,
      model: (form.get("model") as string) || null,
      condition: (form.get("condition") as any) || null,
      size_label: (form.get("size_label") as string) || null,
      size_value: sizeVal ? Number(sizeVal) : null,
      binding_type: (form.get("binding_type") as string) || null,
      manufacture_year: yearVal ? Number(yearVal) : null,
      included_accessories: (form.get("included_accessories") as string) || null,
      technical_observations: (form.get("technical_observations") as string) || null,
      ski_modes: skiModes,
    });

    setLoading(false);

    if (result.success) {
      toast.success("Producto modificado exitosamente");
      router.push("/mis-productos");
    } else {
      toast.error(result.error);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          Editar Producto
        </CardTitle>
        <CardDescription>
          Modifica los detalles de tu publicación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-lg border bg-muted/20 p-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Informacion general
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              required
              minLength={3}
              defaultValue={product.title}
              placeholder="Ej: Esquís Rossignol Hero 170cm"
            />
            {fieldErrors.title && (
              <p className="text-sm text-destructive">{fieldErrors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción corta</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={4}
              maxLength={800}
              defaultValue={product.description}
              placeholder="Resumen breve del artículo para el catálogo."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailed_description">Descripción detallada (opcional)</Label>
            <Textarea
              id="detailed_description"
              name="detailed_description"
              rows={6}
              maxLength={6000}
              defaultValue={product.detailed_description || ""}
              placeholder="Incluye estado real, marca, modelo, fijaciones, historial de uso, mantenciones y detalles técnicos relevantes."
            />
            <p className="text-xs text-muted-foreground">
              Esta descripción aparece en la publicación para que el comprador vea toda la información técnica.
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
                defaultValue={product.price}
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
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

          {(category === "esquis" || category === "snowboard" || category === "") && (
            <SkiModesField
              selected={skiModes}
              onChange={setSkiModes}
              required={category === "esquis" || category === "snowboard"}
              error={fieldErrors.ski_modes?.[0]}
              label={category === "snowboard" ? "Modalidad de snowboard" : "Modalidad de ski"}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca (opcional)</Label>
              <select
                id="brand"
                name="brand"
                defaultValue={product.brand || ""}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Sin especificar</option>
                {POPULAR_BRANDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modelo (opcional)</Label>
                <Input
                  id="model"
                  name="model"
                  maxLength={120}
                  defaultValue={product.model || ""}
                  placeholder="Ej: Hero Elite ST TI"
                />
              </div>
            </div>

          <div className="rounded-lg border bg-muted/20 p-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Especificaciones tecnicas
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="condition">Estado (opcional)</Label>
              <select
                id="condition"
                name="condition"
                defaultValue={product.condition || "usado_buen_estado"}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Sin especificar</option>
                {PRODUCT_CONDITIONS.map((c) => (
                  <option key={c} value={c}>{CONDITION_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="binding_type">Tipo de fijaciones (opcional)</Label>
              <Input
                id="binding_type"
                name="binding_type"
                maxLength={120}
                defaultValue={product.binding_type || ""}
                placeholder="Ej: Alpine, GripWalk, Touring"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="size_label">Longitud / Talle (opcional)</Label>
              <Input id="size_label" name="size_label" maxLength={40} defaultValue={product.size_label || ""} placeholder="Ej: 170 cm, 27.5 MP, Talle L" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size_value">Medida numérica en cm (opcional)</Label>
              <Input id="size_value" name="size_value" type="number" step="0.1" min={0} max={400} defaultValue={product.size_value || ""} placeholder="170" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="manufacture_year">Año (opcional)</Label>
              <Input
                id="manufacture_year"
                name="manufacture_year"
                type="number"
                min={1970}
                max={new Date().getFullYear() + 1}
                defaultValue={product.manufacture_year || ""}
                placeholder="2022"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Incluye
            </h2>
          </div>

          <div className="space-y-2">
            <Label htmlFor="included_accessories">Accesorios incluidos (opcional)</Label>
            <Textarea
              id="included_accessories"
              name="included_accessories"
              rows={3}
              maxLength={2000}
              defaultValue={product.included_accessories || ""}
              placeholder="Ej: funda, bastones, kit de mantenimiento, tornillos extra."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technical_observations">Observaciones técnicas (opcional)</Label>
            <Textarea
              id="technical_observations"
              name="technical_observations"
              rows={4}
              maxLength={2000}
              defaultValue={product.technical_observations || ""}
              placeholder="Ej: últimos servicios, cantos, base, reparaciones realizadas, compatibilidades."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">Tu WhatsApp</Label>
            <Input
              id="whatsapp_number"
              name="whatsapp_number"
              required
              defaultValue={product.whatsapp_number}
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

          <div className="space-y-2">
            <Label>Imágenes ({(existingImages.length + newPreviews.length)} en total)</Label>
            
            <div className="flex flex-wrap gap-2 pt-1 pb-3">
              {existingImages.map((src: string, i: number) => (
                <div key={`exist-${i}`} className="group relative size-20 overflow-hidden rounded-lg ring-2 ring-primary/20">
                  <img src={src} alt="Existente" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={`new-${i}`} className="group relative size-20 overflow-hidden rounded-lg">
                  <img src={src} alt="Nueva" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewFile(i)}
                    className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>

            <div
              className={`cursor-pointer rounded-lg border-2 border-dashed p-5 text-center transition-colors ${
                isDragging
                  ? "border-[#e8622c] bg-orange-50"
                  : "border-border hover:border-accent hover:bg-secondary/30"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <ImagePlus className={`mx-auto mb-2 size-6 transition-colors ${isDragging ? "text-[#e8622c]" : "text-muted-foreground/50"}`} />
              <p className="text-sm text-muted-foreground">
                {isDragging ? "Suelta las imágenes aquí" : "Arrastra imágenes aquí o haz clic para agregar"}
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
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" data-icon="inline-start" />}
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
