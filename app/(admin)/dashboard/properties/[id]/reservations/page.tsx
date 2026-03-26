import { notFound } from "next/navigation";
import Link from "next/link";
import { getPropertyById } from "@/actions/properties";
import { getReservationsByProperty } from "@/actions/reservations";
import { ReservationForm } from "./ReservationForm";
import { DeleteReservationButton } from "./DeleteReservationButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays } from "lucide-react";

export const metadata = { title: "Reservas de Propiedad" };

export default async function PropertyReservationsPage({
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

  const all = (reservations as any[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Button variant="ghost" size="sm" className="mb-4" render={<Link href="/dashboard/properties/manage" />}>
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Volver a propiedades
      </Button>

      <div className="mb-8">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <CalendarDays className="size-3" />
          Reservas
        </Badge>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {property.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{property.location}</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Nueva Reserva / Bloqueo</CardTitle>
        </CardHeader>
        <CardContent>
          <ReservationForm propertyId={id} />
        </CardContent>
      </Card>

      <h2 className="mb-4 font-heading text-lg font-semibold">
        Reservas existentes ({all.length})
      </h2>

      {all.length === 0 ? (
        <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
          Sin reservas registradas.
        </div>
      ) : (
        <div className="space-y-2">
          {all.map((r: any) => (
            <Card key={r.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span>{new Date(r.start_date + "T00:00:00").toLocaleDateString("es-CL")}</span>
                    <span className="text-muted-foreground">→</span>
                    <span>{new Date(r.end_date + "T00:00:00").toLocaleDateString("es-CL")}</span>
                  </div>
                  {r.guest_name && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.guest_name}</p>
                  )}
                  {r.notes && (
                    <p className="mt-0.5 text-xs text-muted-foreground italic">{r.notes}</p>
                  )}
                </div>
                <DeleteReservationButton id={r.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
