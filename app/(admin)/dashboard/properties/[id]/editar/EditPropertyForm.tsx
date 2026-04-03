"use client";

import { useState, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { updateProperty } from "@/actions/properties";
import { uploadImages } from "@/actions/upload";
import { AMENITY_OPTIONS, AMENITY_LABELS } from "@/lib/validations/property";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { KNOWN_LOCATIONS, isKnownLocation } from "@/lib/constants";

export function EditPropertyForm({ property }: { property: any }) {
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(property.images || []);

  const initialAmenities: string[] = Array.isArray(property.amenities) ? property.amenities : [];
  const initialParking =
    property.parking_included ?? initialAmenities.includes("estacionamiento");

  const [locationPreset, setLocationPreset] = useState<string>(
    isKnownLocation(property.location) ? property.location : "otro"
  );
  const [customLocation, setCustomLocation] = useState<string>(
    isKnownLocation(property.location) ? "" : (property.location || "")
  );
  const finalLocation = locationPreset === "otro" ? customLocation : locationPreset;

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    const form = new FormData(e.currentTarget);

    let finalImages = [...existingImages];
    if (newFiles.length > 0) {
      const uploadData = new FormData();
      newFiles.forEach((f) => uploadData.append("files", f));
      const uploadResult = await uploadImages(uploadData, "properties");
      if (uploadResult.success) {
        finalImages = [...finalImages, ...uploadResult.data.urls];
      } else {
        toast.error(`Error subiendo imagenes nuevas: ${uploadResult.error}`);
        setLoading(false);
        return;
      }
    }

    const latRaw = form.get("latitude") as string;
    const lngRaw = form.get("longitude") as string;
    const bathroomsRaw = form.get("bathrooms") as string;
    const distanceRaw = form.get("distance_to_slopes_meters") as string;
    const parkingIncluded = form.get("parking_included") === "on";

    const selectedAmenities = AMENITY_OPTIONS.filter(
      (a) => form.get(`amenity_${a}`) === "on"
    );
    const amenitiesWithParking = parkingIncluded && !selectedAmenities.includes("estacionamiento")
      ? [...selectedAmenities, "estacionamiento"]
      : selectedAmenities;

    const result = await updateProperty({
      id: property.id,
      title: form.get("title") as string,
      description: form.get("description") as string,
      full_description: (form.get("full_description") as string) || null,
      price: Number(form.get("price")),
      location: form.get("location") as string,
      google_maps_url: (form.get("google_maps_url") as string) || null,
      whatsapp_contact: form.get("whatsapp_contact") as string,
      images: finalImages,
      latitude: latRaw ? Number(latRaw) : null,
      longitude: lngRaw ? Number(lngRaw) : null,
      max_guests: Number(form.get("max_guests")) || 2,
      bedrooms: Number(form.get("bedrooms")) || 1,
      bathrooms: bathroomsRaw ? Number(bathroomsRaw) : 1,
      distance_to_slopes_meters: distanceRaw ? Number(distanceRaw) : null,
      parking_included: parkingIncluded,
      pet_policy: (form.get("pet_policy") as string) || null,
      amenities: amenitiesWithParking as (typeof AMENITY_OPTIONS)[number][],
    });

    setLoading(false);

    if (result.success) {
      toast.success("Propiedad actualizada exitosamente");
      router.push("/dashboard/properties/manage");
      return;
    }

    toast.error(result.error);
    if (result.fieldErrors) setFieldErrors(result.fieldErrors);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Editar Propiedad</CardTitle>
        <CardDescription>
          Modifica la informacion publicada del inmueble.
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
            <Label htmlFor="title">Titulo</Label>
            <Input
              id="title"
              name="title"
              required
              minLength={3}
              defaultValue={property.title}
              placeholder="Ej: Depto 2D/1B Valle Nevado"
            />
            {fieldErrors.title && (
              <p className="text-sm text-destructive">{fieldErrors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripcion corta</Label>
            <Textarea
              id="description"
              name="description"
              required
              rows={4}
              maxLength={800}
              defaultValue={property.description || ""}
              placeholder="Resumen breve del inmueble para el catalogo."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_description">Descripcion completa del inmueble (opcional)</Label>
            <Textarea
              id="full_description"
              name="full_description"
              rows={7}
              maxLength={6000}
              defaultValue={property.full_description || ""}
              placeholder="Incluye comodidades, capacidad, distribucion y detalles de cercania a pistas."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Precio por noche (CLP)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step="1"
                required
                defaultValue={property.price}
                placeholder="120000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_preset">Ubicacion</Label>
              <select
                id="location_preset"
                value={locationPreset}
                onChange={(e) => setLocationPreset(e.target.value)}
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Seleccionar destino...</option>
                {KNOWN_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
                <option value="otro">Otro destino</option>
              </select>
              {locationPreset === "otro" && (
                <Input
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="Ej: Chillán, Pucón, Corralco, Portillo..."
                  maxLength={50}
                  required
                />
              )}
              <input type="hidden" name="location" value={finalLocation} />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Detalle completo del inmueble
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="max_guests">Capacidad total</Label>
              <Input
                id="max_guests"
                name="max_guests"
                type="number"
                min={1}
                max={30}
                defaultValue={property.max_guests ?? 2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Habitaciones</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min={0}
                max={12}
                defaultValue={property.bedrooms ?? 1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Banos</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min={1}
                max={12}
                defaultValue={property.bathrooms ?? 1}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="distance_to_slopes_meters">Distancia a pistas (metros, opcional)</Label>
              <Input
                id="distance_to_slopes_meters"
                name="distance_to_slopes_meters"
                type="number"
                min={0}
                max={50000}
                defaultValue={property.distance_to_slopes_meters ?? ""}
                placeholder="Ej: 350"
              />
            </div>
            <div className="space-y-2 rounded-lg border p-3">
              <Label htmlFor="parking_included" className="text-sm font-medium">Estacionamiento</Label>
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  id="parking_included"
                  name="parking_included"
                  type="checkbox"
                  className="rounded border-input"
                  defaultChecked={initialParking}
                />
                Incluye estacionamiento
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Comodidades</Label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITY_OPTIONS.map((a) => (
                <label key={a} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={`amenity_${a}`}
                    className="rounded border-input"
                    defaultChecked={initialAmenities.includes(a)}
                  />
                  {AMENITY_LABELS[a]}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pet_policy">Politica de mascotas (opcional)</Label>
            <Textarea
              id="pet_policy"
              name="pet_policy"
              rows={2}
              maxLength={300}
              defaultValue={property.pet_policy || ""}
              placeholder="Ej: Se aceptan mascotas pequenas con aviso previo."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitud (opcional)</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                defaultValue={property.latitude ?? ""}
                placeholder="-33.3547"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitud (opcional)</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                defaultValue={property.longitude ?? ""}
                placeholder="-70.2563"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_maps_url">URL de Google Maps (opcional)</Label>
            <Input
              id="google_maps_url"
              name="google_maps_url"
              type="url"
              defaultValue={property.google_maps_url || ""}
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp_contact">WhatsApp contacto</Label>
            <Input
              id="whatsapp_contact"
              name="whatsapp_contact"
              required
              defaultValue={property.whatsapp_contact}
              placeholder="+56 9 1234 5678"
            />
            {fieldErrors.whatsapp_contact && (
              <p className="text-sm text-destructive">{fieldErrors.whatsapp_contact[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Imagenes ({existingImages.length + newPreviews.length} en total)</Label>

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
              className="cursor-pointer rounded-lg border-2 border-dashed border-border p-5 text-center transition-colors hover:border-accent hover:bg-secondary/30"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="mx-auto mb-2 size-6 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Agregar mas fotos</p>
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
