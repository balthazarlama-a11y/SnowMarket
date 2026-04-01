/**
 * Motor de enlaces WhatsApp para AndesMarket.
 * Valida numeros chilenos, sanitiza y genera links wa.me contextuales.
 */

export type EntityType = "product_user" | "product_verified" | "property";

const CHILEAN_PHONE_REGEX = /^(\+?56)?\s?0?9\s?\d{8}$/;

export function isValidChileanPhone(phone: string): boolean {
  return CHILEAN_PHONE_REGEX.test(phone.trim());
}

export function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("56") && digits.length === 11) {
    return digits;
  }

  if (digits.startsWith("9") && digits.length === 9) {
    return `56${digits}`;
  }

  if (digits.startsWith("09") && digits.length === 10) {
    return `56${digits.slice(1)}`;
  }

  return digits;
}

function buildMessage(itemName: string, price: number, entityType: EntityType): string {
  const formattedPrice = Number(price).toLocaleString("es-CL");

  switch (entityType) {
    case "product_user":
    case "product_verified":
      return `Hola, vengo de AndesMarket y me interesa el producto: ${itemName}.\nPrecio: $${formattedPrice} CLP.`;
    case "property":
      return `Hola, vengo de AndesMarket y me interesa el departamento: ${itemName}.`;
  }
}

export interface WhatsAppLinkParams {
  phone: string;
  itemName: string;
  price: number;
  entityType: EntityType;
  adminPhone?: string;
}

export function generateWhatsAppLink(params: WhatsAppLinkParams): string {
  const { phone, itemName, price, entityType, adminPhone } = params;

  const targetPhone =
    entityType === "product_user" ? phone : (adminPhone ?? phone);

  if (!isValidChileanPhone(targetPhone)) {
    throw new Error(`Numero de telefono invalido: ${targetPhone}`);
  }

  const cleanPhone = sanitizePhone(targetPhone);
  const message = buildMessage(itemName, price, entityType);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/** Enlace wa.me con mensaje libre (ej. publicar propiedad). */
export function buildWhatsAppUrlWithText(phone: string, text: string): string {
  if (!isValidChileanPhone(phone)) {
    throw new Error(`Numero de telefono invalido: ${phone}`);
  }
  const cleanPhone = sanitizePhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

/** Mensaje para el botón de publicar artículo estándar (catálogo de productos). */
export const WHATSAPP_PUBLISH_STANDARD = "Hola, quiero publicar un artículo.";

/** Mensaje para publicar con verificación (catálogo de productos). */
export const WHATSAPP_PUBLISH_VERIFIED = "Hola, quiero publicar un artículo verificado.";

/** Mensaje para el botón de publicar departamento (sección Departamentos). */
export const WHATSAPP_PUBLISH_DEPARTMENT = "Hola, quiero publicar un departamento.";

/** @deprecated Usar WHATSAPP_PUBLISH_DEPARTMENT */
export const LIST_PROPERTY_WHATSAPP_MESSAGE = WHATSAPP_PUBLISH_DEPARTMENT;
