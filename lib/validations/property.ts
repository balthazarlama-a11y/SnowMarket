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
  description: z.string().min(1, "La descripcion es obligatoria"),
  full_description: z.string().max(6000).nullish(),
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
  max_guests: z.number().int().min(1).default(2),
  bedrooms: z.number().int().min(0).default(1),
  amenities: z.array(z.string()).default([]),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  id: z.string().uuid(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
