"use client";

import { generateWhatsAppLink, type EntityType } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

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
    <Button
      size="lg"
      className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#1da851]"
      render={<a href={link} target="_blank" rel="noopener noreferrer" />}
    >
      <MessageCircle className="size-5" data-icon="inline-start" />
      Contactar por WhatsApp
    </Button>
  );
}
