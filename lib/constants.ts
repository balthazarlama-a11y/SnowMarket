export const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "+56951010473";

export const KNOWN_LOCATIONS = [
  "La Parva",
  "Valle Nevado",
  "El Colorado",
  "Farellones",
] as const;

export type KnownLocation = (typeof KNOWN_LOCATIONS)[number];

export function isKnownLocation(loc: string): boolean {
  return KNOWN_LOCATIONS.some((k) => k.toLowerCase() === loc?.toLowerCase());
}

export const CATEGORY_LABELS: Record<string, string> = {
  esquis: "Esquis",
  botas: "Botas",
  ropa_de_esqui: "Ropa de esqui",
  cascos: "Cascos",
  antiparras: "Antiparras",
  otros_accesorios: "Otros accesorios",
};
