import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "esquis",
  "botas",
  "ropa_de_esqui",
  "cascos",
  "antiparras",
  "otros_accesorios",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_CONDITIONS = [
  "nuevo",
  "usado_como_nuevo",
  "usado_buen_estado",
] as const;

export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number];

export const CONDITION_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  usado_como_nuevo: "Usado - Como nuevo",
  usado_buen_estado: "Usado - Buen estado",
};

export const POPULAR_BRANDS = [
  "Burton",
  "Salomon",
  "Rossignol",
  "K2",
  "Head",
  "Atomic",
  "Nordica",
  "Fischer",
  "Dynastar",
  "Otra",
] as const;

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const chileanPhoneRegex = /^(\+?56)?\s?0?9\s?\d{8}$/;

export const createProductSchema = z.object({
  title: z
    .string()
    .min(3, "El titulo debe tener al menos 3 caracteres")
    .max(200),
  description: z.string().min(1, "La descripcion es obligatoria"),
  price: z
    .number()
    .nonnegative("El precio no puede ser negativo")
    .max(99999999.99),
  category: z.enum(PRODUCT_CATEGORIES, {
    error: "Categoria no valida",
  }),
  whatsapp_number: z
    .string()
    .regex(chileanPhoneRegex, "Numero de WhatsApp chileno no valido"),
  images: z.array(z.string().url()).default([]),
  brand: z.string().nullish(),
  condition: z.enum(PRODUCT_CONDITIONS).nullish(),
  size_label: z.string().nullish(),
  size_value: z.number().nullish(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
