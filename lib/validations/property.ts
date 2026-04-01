import { z } from "zod";

const chileanPhoneRegex = /^(\+?56)?\s?0?9\s?\d{8}$/;

export const AMENITY_OPTIONS = [
  "ski_in_out",
  "estacionamiento",
  "calefaccion",
  "wifi",
] as const;

export const AMENITY_LABELS: Record<string, string> = {
  ski_in_out: "Ski-in / Ski-out",
  estacionamiento: "Estacionamiento",
  calefaccion: "Calefacción",
  wifi: "WiFi",
};

export const createPropertySchema = z.object({
  title: z
    .string()
    .min(3, "El titulo debe tener al menos 3 caracteres")
    .max(200),
  description: z
    .string()
    .min(1, "La descripcion es obligatoria")
    .max(800, "La descripcion corta no puede superar 800 caracteres"),
  full_description: z
    .string()
    .max(6000, "La descripcion completa no puede superar 6000 caracteres")
    .nullish(),
  price: z
    .number()
    .nonnegative("El precio no puede ser negativo")
    .max(99999999.99),
  location: z.string().min(1, "La ubicacion es obligatoria"),
  google_maps_url: z.string().url("URL de Google Maps no valida").nullish(),
  whatsapp_contact: z
    .string()
    .regex(chileanPhoneRegex, "Numero de WhatsApp chileno no valido"),
  images: z.array(z.string().url()).default([]),
  latitude: z.number().min(-90).max(90).nullish(),
  longitude: z.number().min(-180).max(180).nullish(),
  max_guests: z.number().int().min(1).max(30).default(2),
  bedrooms: z.number().int().min(0).max(12).default(1),
  bathrooms: z.number().int().min(1).max(12).default(1),
  amenities: z.array(z.enum(AMENITY_OPTIONS)).default([]),
  distance_to_slopes_meters: z.number().int().min(0).max(50000).nullish(),
  parking_included: z.boolean().default(false),
  pet_policy: z.string().max(300, "La politica de mascotas no puede superar 300 caracteres").nullish(),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  id: z.string().uuid(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
