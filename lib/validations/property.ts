import { z } from "zod";

const chileanPhoneRegex = /^(\+?56)?\s?0?9\s?\d{8}$/;

export const createPropertySchema = z.object({
  title: z
    .string()
    .min(3, "El titulo debe tener al menos 3 caracteres")
    .max(200),
  description: z.string().min(1, "La descripcion es obligatoria"),
  price: z
    .number()
    .nonnegative("El precio no puede ser negativo")
    .max(99999999.99),
  location: z.string().min(1, "La ubicacion es obligatoria"),
  whatsapp_contact: z
    .string()
    .regex(chileanPhoneRegex, "Numero de WhatsApp chileno no valido"),
  images: z.array(z.string().url()).default([]),
});

export const updatePropertySchema = createPropertySchema.partial().extend({
  id: z.string().uuid(),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
