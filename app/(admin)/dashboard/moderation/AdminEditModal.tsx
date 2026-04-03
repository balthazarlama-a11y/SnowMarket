"use client";

import { useState, useRef, type FormEvent } from "react";
import { adminUpdateProduct } from "@/actions/admin-products";
import { uploadImages } from "@/actions/upload";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  CONDITION_LABELS,
  POPULAR_BRANDS,
  type ProductCategory,
} from "@/lib/validations/product";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, X, ImagePlus, Save, Pencil } from "lucide-react";
import { toast } from "sonner";

export function AdminEditModal({ product }: { product: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(product.images || []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    const valid = selected.filter((f) => {
      if (f.size > 6 * 1024 * 1024) { toast.error(`${f.name} excede 6MB`); return false; }
      return true;
    });
    setNewFiles((prev) => [...prev, ...valid]);
    setNewPreviews((prev) => [...prev, ...valid.map((f) => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeNewFile(i: number) {
    URL.revokeObjectURL(newPreviews[i]);
    setNewFiles((prev) => prev.filter((_, j) => j !== i));
    setNewPreviews((prev) => prev.filter((_, j) => j !== i));
  }

  function removeExisting(i: number) {
    setExistingImages((prev) => prev.filter((_, j) => j !== i));
  }

  function handleOpen() {
    setExistingImages(product.images || []);
    setNewFiles([]);
    setNewPreviews([]);
    setOpen(true);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);

    let finalImages = [...existingImages];
    if (newFiles.length > 0) {
      const uploadData = new FormData();
      newFiles.forEach((f) => uploadData.append("files", f));
      const uploadResult = await uploadImages(uploadData, "products");
      if (uploadResult.success) {
        finalImages = [...finalImages, ...uploadResult.data.urls];
      } else {
        toast.error(`Error subiendo imágenes: ${uploadResult.error}`);
        setLoading(false);
        return;
      }
    }

    const sizeVal = form.get("size_value") as string;
    const yearVal = form.get("manufacture_year") as string;

    const result = await adminUpdateProduct({
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
      condition: (form.get("condition") as string) || null,
      size_label: (form.get("size_label") as string) || null,
      size_value: sizeVal ? Number(sizeVal) : null,
      binding_type: (form.get("binding_type") as string) || null,
      manufacture_year: yearVal ? Number(yearVal) : null,
      included_accessories: (form.get("included_accessories") as string) || null,
      technical_observations: (form.get("technical_observations") as string) || null,
    });

    setLoading(false);

    if (result.success) {
      toast.success("Publicación actualizada");
      setOpen(false);
    } else {
      toast.error(result.error);
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleOpen}>
        <Pencil className="size-3.5" data-icon="inline-start" />
        Editar
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="relative w-full max-w-2xl rounded-xl border bg-background shadow-xl my-8">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="font-heading text-lg font-semibold">Editar publicación (admin)</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input id="edit-title" name="title" required minLength={3} defaultValue={product.title} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción corta</Label>
                <Textarea id="edit-description" name="description" required rows={3} maxLength={800} defaultValue={product.description} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-detailed">Descripción detallada (opcional)</Label>
                <Textarea id="edit-detailed" name="detailed_description" rows={5} maxLength={6000} defaultValue={product.detailed_description || ""} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Precio (CLP)</Label>
                  <Input id="edit-price" name="price" type="number" min={0} step="1" required defaultValue={product.price} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <select
                    id="edit-category"
                    name="category"
                    required
                    defaultValue={product.category}
                    className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Marca</Label>
                  <select
                    id="edit-brand"
                    name="brand"
                    defaultValue={product.brand || ""}
                    className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Sin especificar</option>
                    {POPULAR_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-model">Modelo</Label>
                  <Input id="edit-model" name="model" maxLength={120} defaultValue={product.model || ""} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-condition">Estado</Label>
                  <select
                    id="edit-condition"
                    name="condition"
                    defaultValue={product.condition || ""}
                    className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">Sin especificar</option>
                    {PRODUCT_CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-binding">Tipo de fijaciones</Label>
                  <Input id="edit-binding" name="binding_type" maxLength={120} defaultValue={product.binding_type || ""} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="edit-size-label">Longitud / Talle</Label>
                  <Input id="edit-size-label" name="size_label" maxLength={40} defaultValue={product.size_label || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-size-value">Medida (cm)</Label>
                  <Input id="edit-size-value" name="size_value" type="number" step="0.1" min={0} max={400} defaultValue={product.size_value || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Año</Label>
                  <Input id="edit-year" name="manufacture_year" type="number" min={1970} max={new Date().getFullYear() + 1} defaultValue={product.manufacture_year || ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-accessories">Accesorios incluidos</Label>
                <Textarea id="edit-accessories" name="included_accessories" rows={2} maxLength={2000} defaultValue={product.included_accessories || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-observations">Observaciones técnicas</Label>
                <Textarea id="edit-observations" name="technical_observations" rows={3} maxLength={2000} defaultValue={product.technical_observations || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-whatsapp">WhatsApp</Label>
                <Input id="edit-whatsapp" name="whatsapp_number" required defaultValue={product.whatsapp_number} />
              </div>

              <div className="space-y-2">
                <Label>Imágenes ({existingImages.length + newPreviews.length})</Label>
                <div className="flex flex-wrap gap-2 pb-2">
                  {existingImages.map((src, i) => (
                    <div key={`exist-${i}`} className="relative size-20 overflow-hidden rounded-lg ring-2 ring-primary/20">
                      <img src={src} alt="Imagen" className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExisting(i)}
                        className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-white"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                  {newPreviews.map((src, i) => (
                    <div key={`new-${i}`} className="relative size-20 overflow-hidden rounded-lg">
                      <img src={src} alt="Nueva" className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div
                  className="cursor-pointer rounded-lg border-2 border-dashed border-border p-4 text-center hover:border-accent hover:bg-secondary/30"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="mx-auto mb-1 size-5 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Agregar fotos</p>
                  <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" data-icon="inline-start" />}
                  {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
