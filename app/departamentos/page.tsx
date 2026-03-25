import Link from "next/link";
import Image from "next/image";
import { getProperties } from "@/actions/properties";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin } from "lucide-react";

export const metadata = {
  title: "Departamentos en Arriendo",
  description: "Arrienda departamentos en los mejores centros de esquí de Chile",
};

export default async function DepartamentosPage() {
  const { data: properties, error } = await getProperties();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Building2 className="size-3" />
          Arriendos Administrados
        </Badge>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Departamentos en la Nieve
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Propiedades seleccionadas y gestionadas por SnowMarket en los principales
          centros de esquí de Chile. Contacto directo con nuestro equipo.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando propiedades: {error.message}
        </div>
      )}

      {!properties || properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <Building2 className="mb-3 size-12 text-muted-foreground/30" />
          <p className="text-lg text-muted-foreground">
            No hay departamentos publicados aún.
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Próximamente nuevas propiedades.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property: any) => (
            <Link
              key={property.id}
              href={`/departamentos/${property.id}`}
              className="group"
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary/50">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 className="size-12 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-heading line-clamp-1 text-lg font-semibold">
                        {property.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-3.5 shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-xl font-bold text-primary">
                      ${Number(property.price).toLocaleString("es-CL")}
                    </span>
                    <span className="text-sm text-muted-foreground">/noche</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
