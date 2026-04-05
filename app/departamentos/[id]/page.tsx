import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PropertyGallery } from "./PropertyGallery";
import { getPropertyById } from "@/actions/properties";
import { getReservationsByProperty } from "@/actions/reservations";
import { getAvailabilityByProperty } from "@/actions/availability";
import { ADMIN_WHATSAPP } from "@/lib/constants";
import { AMENITY_LABELS } from "@/lib/validations/property";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Building2, MapPin, MessageCircle } from "lucide-react";
import { PropertyContactSection } from "./PropertyContactSection";
import { AvailabilityBadges } from "./AvailabilityBadges";
import { buildWhatsAppUrlWithText, sanitizePhone } from "@/lib/whatsapp";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data: property, error }, { data: reservations }, { data: availability }] =
    await Promise.all([
      getPropertyById(id),
      getReservationsByProperty(id),
      getAvailabilityByProperty(id),
    ]);

  if (error || !property) return notFound();

  const hasCoords = property.latitude != null && property.longitude != null;
  const mapsUrlFromCoords = hasCoords
    ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
    : null;
  const mapsUrlFromLocation = property.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location)}`
    : null;
  const mapsUrl = property.google_maps_url?.trim() || mapsUrlFromCoords || mapsUrlFromLocation;
  const isActivePublication = !property.status || property.status === "activo";
  const shortDescription = property.description?.trim() || "Sin descripción corta.";
  const completeDescription = property.full_description?.trim() || shortDescription;
  const amenitiesList = Array.isArray(property.amenities)
    ? property.amenities.map((amenity: string) => AMENITY_LABELS[amenity] ?? amenity)
    : [];
  const hasParking = property.parking_included ?? amenitiesList.includes("Estacionamiento");
  const distanceLabel = property.distance_to_slopes_meters != null
    ? `${Number(property.distance_to_slopes_meters).toLocaleString("es-CL")} m`
    : "No informada";
  const petPolicy = property.pet_policy?.trim() || "No especificada";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Button variant="ghost" size="sm" className="mb-6" render={<Link href="/departamentos" />}>
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Volver a departamentos
      </Button>

      <div className="grid items-start gap-8 lg:grid-cols-5">
        {/* Images */}
        <div className="lg:col-span-3">
          {property.images?.length > 0 ? (
            <PropertyGallery images={property.images} title={property.title} />
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center rounded-xl bg-secondary/50">
              <Building2 className="size-16 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-6">
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

              {isActivePublication && mapsUrl && (
                <Button
                  variant="outline"
                  className="h-11 w-full gap-2 rounded-lg"
                  render={
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  <MapPin className="size-4" data-icon="inline-start" />
                  Ver ubicación exacta en Google Maps
                </Button>
              )}

              {!isActivePublication && (
                <p className="text-xs text-muted-foreground">
                  La ubicación exacta estará disponible cuando la publicación esté activa.
                </p>
              )}

              {property.price != null ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">
                    ${Number(property.price).toLocaleString("es-CL")}
                  </span>
                  <span className="text-muted-foreground">/noche</span>
                </div>
              ) : (() => {
                const phone = ADMIN_WHATSAPP || property.whatsapp_contact;
                const msg = `Hola, vengo de AndesMarket 👋 Me interesa el ${property.title} en ${property.location}. ¿Cuál es el precio por noche?`;
                let href = "#";
                try { href = buildWhatsAppUrlWithText(phone, msg); } catch { href = `https://wa.me/${sanitizePhone(phone)}?text=${encodeURIComponent(msg)}`; }
                return (
                  <Button
                    variant="outline"
                    className="h-11 w-full gap-2 rounded-lg text-primary"
                    render={
                      <a href={href} target="_blank" rel="noopener noreferrer" />
                    }
                  >
                    <MessageCircle className="size-4" data-icon="inline-start" />
                    Consultar precio
                  </Button>
                );
              })()}

              <Separator />

              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Informacion general
                </h2>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Capacidad total:</span>{" "}
                    {property.max_guests ?? "No informada"} personas
                  </p>
                  <p>
                    <span className="font-medium">Habitaciones:</span>{" "}
                    {property.bedrooms ?? "No informada"}
                  </p>
                  <p>
                    <span className="font-medium">Baños:</span>{" "}
                    {property.bathrooms ?? "No informada"}
                  </p>
                  <p>
                    <span className="font-medium">Descripción corta:</span>{" "}
                    {shortDescription}
                  </p>
                </div>
              </div>

              <Separator />

              <details className="rounded-lg border bg-secondary/30 p-3">
                <summary className="cursor-pointer text-sm font-semibold">
                  Detalle completo del inmueble
                </summary>
                <div className="mt-3 space-y-4">
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Comodidades
                    </h3>
                    {amenitiesList.length > 0 ? (
                      <p className="text-sm leading-relaxed">{amenitiesList.join(", ")}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin comodidades cargadas.</p>
                    )}
                  </div>

                  <div className="grid gap-2 text-sm">
                    <p>
                      <span className="font-medium">Distancia / cercanía a pistas:</span>{" "}
                      {distanceLabel}
                    </p>
                    <p>
                      <span className="font-medium">Estacionamiento:</span>{" "}
                      {hasParking ? "Incluido" : "No incluido"}
                    </p>
                    <p>
                      <span className="font-medium">Política de mascotas:</span>{" "}
                      {petPolicy}
                    </p>
                  </div>

                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Descripción completa
                    </h3>
                    <p className="whitespace-pre-line leading-relaxed text-sm">{completeDescription}</p>
                  </div>
                </div>
              </details>

              {(availability?.length ?? 0) > 0 && (
                <>
                  <Separator />
                  <AvailabilityBadges ranges={availability as any[]} />
                </>
              )}

            </CardContent>
          </Card>

          {/* Calendar + Contact */}
          <PropertyContactSection
            propertyTitle={property.title}
            propertyLocation={property.location ?? ""}
            pricePerNight={property.price != null ? Number(property.price) : null}
            whatsappContact={property.whatsapp_contact ?? ""}
            adminPhone={ADMIN_WHATSAPP}
            reservations={(reservations as any[]) ?? []}
          />
        </div>
      </div>
    </div>
  );
}
