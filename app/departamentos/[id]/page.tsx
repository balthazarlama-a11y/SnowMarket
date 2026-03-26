import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPropertyById } from "@/actions/properties";
import { getReservationsByProperty } from "@/actions/reservations";
import { WhatsAppButton } from "@/app/components/WhatsAppButton";
import { ADMIN_WHATSAPP } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building2, MapPin, CalendarDays } from "lucide-react";
import { PropertyCalendar } from "./PropertyCalendar";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data: property, error }, { data: reservations }] = await Promise.all([
    getPropertyById(id),
    getReservationsByProperty(id),
  ]);

  if (error || !property) return notFound();

  const hasCoords = property.latitude != null && property.longitude != null;
  const mapsUrl = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Button variant="ghost" size="sm" className="mb-6" render={<Link href="/departamentos" />}>
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Volver a departamentos
      </Button>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Images */}
        <div className="lg:col-span-3">
          {property.images?.length > 0 ? (
            <div className="space-y-3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-secondary/50">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </div>
              {property.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {property.images.slice(1).map((img: string, i: number) => (
                    <div
                      key={i}
                      className="relative size-20 shrink-0 overflow-hidden rounded-lg sm:size-24"
                    >
                      <Image
                        src={img}
                        alt={`${property.title} ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-secondary/50">
              <Building2 className="size-16 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="space-y-4 p-6">
              <Badge variant="secondary" className="gap-1.5">
                <Building2 className="size-3" />
                Gestionado por SnowMarket
              </Badge>

              <h1 className="font-heading text-2xl font-bold tracking-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="size-4" />
                {property.location}
              </div>

              {mapsUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  render={
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <MapPin className="size-3.5" data-icon="inline-start" />
                  Ver ruta en Google Maps
                </Button>
              )}

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">
                  ${Number(property.price).toLocaleString("es-CL")}
                </span>
                <span className="text-muted-foreground">/noche</span>
              </div>

              <Separator />

              <div>
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                  Descripción
                </h2>
                <p className="leading-relaxed">{property.description}</p>
              </div>

              <Separator />

              <div className="rounded-lg bg-secondary/50 p-3 text-center text-xs text-muted-foreground">
                Las consultas de arriendo son gestionadas directamente por el equipo de SnowMarket.
              </div>

              <WhatsAppButton
                phone={property.whatsapp_contact}
                itemName={property.title}
                price={Number(property.price)}
                entityType="property"
                adminPhone={ADMIN_WHATSAPP}
              />
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                <h2 className="text-sm font-medium">Disponibilidad</h2>
              </div>
              <PropertyCalendar reservations={(reservations as any[]) ?? []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
