import { getAllPropertiesAdmin } from "@/actions/properties";
import { PropertyStatusSelect } from "./PropertyStatusSelect";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, CalendarDays } from "lucide-react";

export const metadata = {
  title: "Gestionar Propiedades",
};

export default async function ManagePropertiesPage() {
  const { data: properties, error } = await getAllPropertiesAdmin();
  const all = (properties as any[]) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" render={<Link href="/dashboard" />}>
          <ArrowLeft className="size-4" data-icon="inline-start" />
          Volver al panel
        </Button>
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Building2 className="size-3" />
          Propiedades
        </Badge>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Gestionar Propiedades
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {all.length} {all.length === 1 ? "propiedad" : "propiedades"} en total
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando propiedades: {error.message}
        </div>
      )}

      {all.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <Building2 className="mb-3 size-12 text-muted-foreground/30" />
          <p className="text-lg text-muted-foreground">No hay propiedades.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {all.map((p: any) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-heading font-semibold">{p.title}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      <span>{p.location}</span>
                    </div>
                    <span className="font-medium text-primary">
                      ${Number(p.price).toLocaleString("es-CL")}/noche
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    render={<Link href={`/dashboard/properties/${p.id}/reservations`} />}
                  >
                    <CalendarDays className="size-3.5" data-icon="inline-start" />
                    Reservas
                  </Button>
                  <PropertyStatusSelect
                    propertyId={p.id}
                    currentStatus={p.status ?? "activo"}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
