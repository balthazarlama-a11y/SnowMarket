import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "esquis",
  "botas",
  "ropa_de_esqui",
  "cascos",
  "antiparras",
  "bastones",
  "snowboard",
  "botas_snowboard",
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
  usado_buen_estado: "Usado - Aceptable",
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
  "Lib Tech",
  "Capita",
  "Gnu",
  "Never Summer",
  "Otra",
] as const;

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const SKI_MODES = [
  "pista",
  "freestyle",
  "carrera",
  "freeride",
  "backcountry",
] as const;

export type SkiMode = (typeof SKI_MODES)[number];

export const SKI_MODE_LABELS: Record<string, string> = {
  pista: "Pista (Carving / All-Mountain)",
  freestyle: "Freestyle (Park & Pipe)",
  carrera: "Carrera (Racing)",
  freeride: "Freeride (Fuera de Pista)",
  backcountry: "Backcountry (Randonnée)",
};

const chileanPhoneRegex = /^(\+?56)?\s?0?9\s?\d{8}$/;
const nextYear = new Date().getFullYear() + 1;

export const createProductSchema = z.object({
  title: z
    .string()
    .min(3, "El titulo debe tener al menos 3 caracteres")
    .max(200),
  description: z
    .string()
    .min(1, "La descripcion es obligatoria")
    .max(800, "La descripcion corta no puede superar 800 caracteres"),
  detailed_description: z
    .string()
    .max(6000, "La descripcion detallada no puede superar 6000 caracteres")
    .nullish(),
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
  brand: z.string().max(80, "La marca no puede superar 80 caracteres").nullish(),
  model: z.string().max(120, "El modelo no puede superar 120 caracteres").nullish(),
  condition: z.enum(PRODUCT_CONDITIONS).nullish(),
  size_label: z
    .string()
    .max(40, "La referencia de longitud/talle no puede superar 40 caracteres")
    .nullish(),
  size_value: z
    .number()
    .min(0, "La medida no puede ser negativa")
    .max(400, "La medida no puede superar 400 cm")
    .nullish(),
  binding_type: z
    .string()
    .max(120, "El tipo de fijaciones no puede superar 120 caracteres")
    .nullish(),
  manufacture_year: z
    .number()
    .int("El ano debe ser un numero entero")
    .min(1970, "El ano debe ser 1970 o posterior")
    .max(nextYear, `El ano no puede ser mayor a ${nextYear}`)
    .nullish(),
  included_accessories: z
    .string()
    .max(2000, "La seccion de accesorios no puede superar 2000 caracteres")
    .nullish(),
  technical_observations: z
    .string()
    .max(2000, "Las observaciones tecnicas no pueden superar 2000 caracteres")
    .nullish(),
  ski_modes: z.array(z.enum(SKI_MODES)).default([]),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
