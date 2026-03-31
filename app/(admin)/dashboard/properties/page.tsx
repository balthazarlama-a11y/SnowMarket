"use client";

import { useState, useRef, type FormEvent } from "react";
import { createProperty } from "@/actions/properties";
import { uploadImages } from "@/actions/upload";
import { AMENITY_OPTIONS, AMENITY_LABELS } from "@/lib/validations/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Building2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminPropertiesPage() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

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
      const uploadResult = await uploadImages(uploadData, "properties");
      if (uploadResult.success) {
        imageUrls = uploadResult.data.urls;
      } else {
        toast.error(`Error subiendo imágenes: ${uploadResult.error}`);
        setLoading(false);
        return;
      }
    }

    const latRaw = form.get("latitude") as string;
    const lngRaw = form.get("longitude") as string;

    const selectedAmenities = AMENITY_OPTIONS.filter(
      (a) => form.get(`amenity_${a}`) === "on"
    );

    const result = await createProperty({
      title: form.get("title") as string,
      description: form.get("description") as string,
      full_description: (form.get("full_description") as string) || null,
      price: Number(form.get("price")),
      location: form.get("location") as string,
      google_maps_url: (form.get("google_maps_url") as string) || null,
      whatsapp_contact: form.get("whatsapp_contact") as string,
      images: imageUrls,
      latitude: latRaw ? Number(latRaw) : null,
      longitude: lngRaw ? Number(lngRaw) : null,
      max_guests: Number(form.get("max_guests")) || 2,
      bedrooms: Number(form.get("bedrooms")) || 1,
      amenities: selectedAmenities as string[],
    });

    setLoading(false);

    if (result.success) {
      toast.success(`Propiedad creada (ID: ${result.data.id})`);
      formRef.current?.reset();
      setFiles([]);
      previews.forEach((url) => URL.revokeObjectURL(url));
      setPreviews([]);
    } else {
      toast.error(result.error);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="size-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-heading text-2xl">
                Crear Propiedad
              </CardTitle>
              <CardDescription>
                Publica un departamento en un centro de esquí.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" required minLength={3} placeholder="Ej: Depto 2D/1B Valle Nevado" />
              {fieldErrors.title && (
                <p className="text-sm text-destructive">{fieldErrors.title[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" name="description" required rows={4} placeholder="Describe el departamento, amenidades, capacidad..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_description">Descripción completa del inmueble (opcional)</Label>
              <Textarea
                id="full_description"
                name="full_description"
                rows={7}
                placeholder="Incluye comodidades, capacidad, distribución de ambientes, cercanía a pistas y cualquier detalle relevante para el huésped."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Precio por noche (CLP)</Label>
                <Input id="price" name="price" type="number" min={0} step="1" required placeholder="120000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input id="location" name="location" required placeholder="Valle Nevado, Chile" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="max_guests">Huéspedes máx.</Label>
                <Input id="max_guests" name="max_guests" type="number" min={1} defaultValue={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Habitaciones</Label>
                <Input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={1} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Comodidades</Label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITY_OPTIONS.map((a) => (
                  <label key={a} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name={`amenity_${a}`} className="rounded border-input" />
                    {AMENITY_LABELS[a]}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitud (opcional)</Label>
                <Input id="latitude" name="latitude" type="number" step="any" placeholder="-33.3547" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitud (opcional)</Label>
                <Input id="longitude" name="longitude" type="number" step="any" placeholder="-70.2563" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="google_maps_url">URL de Google Maps (opcional)</Label>
              <Input
                id="google_maps_url"
                name="google_maps_url"
                type="url"
                placeholder="https://maps.google.com/..."
              />
              <p className="text-xs text-muted-foreground">
                Pega el enlace exacto para que el botón de ubicación lleve a la dirección correcta.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_contact">WhatsApp contacto (admin)</Label>
              <Input id="whatsapp_contact" name="whatsapp_contact" required placeholder="+56 9 1234 5678" />
              {fieldErrors.whatsapp_contact && (
                <p className="text-sm text-destructive">{fieldErrors.whatsapp_contact[0]}</p>
              )}
            </div>

            {/* Dropzone */}
            <div className="space-y-2">
              <Label>Imágenes</Label>
              <div
                className="cursor-pointer rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-accent hover:bg-secondary/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Haz clic para seleccionar imágenes</p>
                <p className="mt-1 text-xs text-muted-foreground/70">JPG, PNG o WebP — máximo 6MB</p>
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
                      <img src={src} alt={`Preview ${i + 1}`} className="size-full object-cover" />
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

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Building2 className="size-4" data-icon="inline-start" />}
              {loading ? "Creando..." : "Crear Propiedad"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
