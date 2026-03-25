/**
 * Motor de enlaces WhatsApp para SnowMarket.
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

function buildMessage(
  itemName: string,
  price: number,
  entityType: EntityType
): string {
  const formattedPrice = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(price);

  switch (entityType) {
    case "product_user":
      return `¡Hola! Vi tu producto "${itemName}" por ${formattedPrice} en SnowMarket y me interesa.`;
    case "product_verified":
      return `¡Hola SnowMarket! Me interesa el producto verificado "${itemName}" por ${formattedPrice}.`;
    case "property":
      return `¡Hola SnowMarket! Me interesa el departamento "${itemName}" por ${formattedPrice}. ¿Podemos coordinar una visita?`;
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
