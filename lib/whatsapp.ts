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

/** Enlace wa.me con mensaje libre (ej. publicar propiedad). */
export function buildWhatsAppUrlWithText(phone: string, text: string): string {
  if (!isValidChileanPhone(phone)) {
    throw new Error(`Numero de telefono invalido: ${phone}`);
  }
  const cleanPhone = sanitizePhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

export const LIST_PROPERTY_WHATSAPP_MESSAGE = `¡Perfecto! Para poder publicar tu propiedad en la plataforma, necesito validar algunos datos 👇

🏔️ *Ubicación exacta:*
🏠 *Tipo de propiedad:* (depto, casa, cabaña)
👥 *Capacidad (personas):*
🛏️ *Dormitorios:*
🛁 *Baños:*

📅 *Disponibilidad:* (fechas o meses)
💰 *Precio por noche (CLP):*

📸 *Fotos reales del departamento:* (mínimo 5)

📝 *Extras:* (ej: ski-in/ski-out, estacionamiento, jacuzzi, etc.)

---

🔐 *Validación:*

👤 Nombre completo:
🆔 RUT:
📱 Teléfono:

📍 Dirección exacta del departamento

📄 Algún respaldo de que eres dueño o administrador (puede ser contribuciones, contrato o similar)

---

🤝 *Gestión de reservas:*

* Nosotros te enviaremos cada solicitud de arriendo
* Tú podrás **aceptar o rechazar al cliente antes de confirmar la reserva**

---

💼 *Condiciones de la plataforma:*

* Trabajamos con una comisión del 7% por reserva confirmada
* Nosotros gestionamos los pagos para mayor seguridad
* No se comparte contacto directo con clientes antes de la reserva

---

Con eso puedo revisar y dejar tu propiedad lista para publicar 🙌`;
