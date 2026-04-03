"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, CalendarDays, Moon } from "lucide-react";
import { PropertyCalendar } from "./PropertyCalendar";
import { buildWhatsAppUrlWithText, sanitizePhone } from "@/lib/whatsapp";
import type { DateRange } from "react-day-picker";

interface Reservation {
  start_date: string;
  end_date: string;
}

interface Props {
  propertyTitle: string;
  propertyLocation: string;
  pricePerNight: number | null;
  whatsappContact: string;
  adminPhone: string;
  reservations: Reservation[];
}

function formatDateEs(date: Date): string {
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function nightsBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function buildUrl(phone: string, message: string): string {
  try {
    return buildWhatsAppUrlWithText(phone, message);
  } catch {
    return `https://wa.me/${sanitizePhone(phone)}?text=${encodeURIComponent(message)}`;
  }
}

export function PropertyContactSection({
  propertyTitle,
  propertyLocation,
  pricePerNight,
  whatsappContact,
  adminPhone,
  reservations,
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const from = range?.from;
  const to = range?.to;
  const hasRange = !!from && !!to && from < to;

  const nights = hasRange ? nightsBetween(from, to) : 0;
  const totalPrice = pricePerNight != null ? nights * pricePerNight : null;

  const phone = adminPhone || whatsappContact;

  function buildAvailabilityUrl(): string {
    if (!hasRange) return "#";
    const priceNote = pricePerNight == null ? " ¿Cuál es el precio por noche?" : "";
    const message =
      `Hola, vengo de AndesMarket 👋 Me interesa el ${propertyTitle} ` +
      `ubicado en ${propertyLocation}. ` +
      `Quisiera arrendar desde el ${formatDateEs(from)} ` +
      `hasta el ${formatDateEs(to)}. ¿Está disponible?${priceNote}`;
    return buildUrl(phone, message);
  }

  function buildPriceInquiryUrl(): string {
    const message =
      `Hola, vengo de AndesMarket 👋 Me interesa el ${propertyTitle} ` +
      `en ${propertyLocation}. ¿Cuál es el precio por noche?`;
    return buildUrl(phone, message);
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <h2 className="text-sm font-medium">Selecciona tus fechas</h2>
        </div>

        {/* Calendar */}
        <PropertyCalendar
          reservations={reservations}
          selected={range}
          onSelect={setRange}
        />

        {/* Range summary */}
        {(from || to) && (
          <>
            <Separator />
            <div className="rounded-lg bg-secondary/50 p-3 text-sm space-y-1.5">
              {from && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desde</span>
                  <span className="font-medium">{formatDateEs(from)}</span>
                </div>
              )}
              {to && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hasta</span>
                  <span className="font-medium">{formatDateEs(to)}</span>
                </div>
              )}
              {hasRange && (
                <>
                  <Separator className="my-1" />
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Moon className="size-3.5" />
                      {nights} {nights === 1 ? "noche" : "noches"}
                    </span>
                    {totalPrice != null ? (
                      <span className="font-bold text-primary text-base">
                        ${totalPrice.toLocaleString("es-CL")}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-primary">Consultar precio</span>
                    )}
                  </div>
                  {totalPrice != null && pricePerNight != null && (
                    <p className="text-xs text-muted-foreground text-right">
                      {nights} × ${pricePerNight.toLocaleString("es-CL")}/noche
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}

        {/* Info note */}
        <div className="rounded-lg bg-secondary/50 p-3 text-center text-xs text-muted-foreground">
          Las consultas de arriendo son gestionadas directamente por el equipo de SnowMarket.
        </div>

        {/* WhatsApp buttons */}
        {hasRange ? (
          <Button
            size="lg"
            className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#1da851]"
            render={
              <a href={buildAvailabilityUrl()} target="_blank" rel="noopener noreferrer" />
            }
          >
            <MessageCircle className="size-5" data-icon="inline-start" />
            Consultar disponibilidad por WhatsApp
          </Button>
        ) : (
          <Button size="lg" className="w-full gap-2" disabled>
            <MessageCircle className="size-5" data-icon="inline-start" />
            {from ? "Selecciona la fecha de salida" : "Selecciona tus fechas para continuar"}
          </Button>
        )}

        {/* Price inquiry shortcut (only when price is null) */}
        {pricePerNight == null && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            render={
              <a href={buildPriceInquiryUrl()} target="_blank" rel="noopener noreferrer" />
            }
          >
            <MessageCircle className="size-4" data-icon="inline-start" />
            Solo consultar precio
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
