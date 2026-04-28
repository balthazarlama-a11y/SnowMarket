import { ADMIN_WHATSAPP } from "@/lib/constants";
import { sanitizePhone } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export function WhatsAppFAB() {
  const phone = sanitizePhone(ADMIN_WHATSAPP);
  const href = `https://wa.me/${phone}?text=${encodeURIComponent("Hola, necesito ayuda con AndesMarket")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-[9999] flex size-14 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
