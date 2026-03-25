"use client";

import { generateWhatsAppLink, type EntityType } from "@/lib/whatsapp";

interface Props {
  phone: string;
  itemName: string;
  price: number;
  entityType: EntityType;
  adminPhone?: string;
}

export function WhatsAppButton({ phone, itemName, price, entityType, adminPhone }: Props) {
  let link: string;
  try {
    link = generateWhatsAppLink({ phone, itemName, price, entityType, adminPhone });
  } catch {
    return null;
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-block",
        padding: "0.6rem 1.5rem",
        background: "#25D366",
        color: "white",
        textDecoration: "none",
        borderRadius: 6,
        fontWeight: 600,
        fontSize: "0.95rem",
      }}
    >
      Contactar por WhatsApp
    </a>
  );
}
