"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Tag } from "lucide-react";

const LOCATION_FILTERS = [
  { value: "La Parva", label: "La Parva" },
  { value: "El Colorado", label: "El Colorado" },
  { value: "Farellones", label: "Farellones" },
  { value: "Valle Nevado", label: "Valle Nevado" },
] as const;

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  description?: string;
}

interface DepartamentosCatalogProps {
  properties: Property[];
}

export function DepartamentosCatalog({ properties }: DepartamentosCatalogProps) {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q")?.toLowerCase() ?? "";
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const filtered = properties.filter((p) => {
    if (selectedLocation && !p.location?.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }
    if (queryParam && !p.title.toLowerCase().includes(queryParam) && !p.location?.toLowerCase().includes(queryParam)) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-20 space-y-6 rounded-xl border bg-card p-5">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Centro de Ski
            </p>
            <div className="flex flex-col gap-1">
              <Button
                variant={selectedLocation === null ? "secondary" : "ghost"}
                size="sm"
                className="justify-start"
                onClick={() => setSelectedLocation(null)}
              >
                <Tag className="size-3.5" data-icon="inline-start" />
                Todos
              </Button>
              {LOCATION_FILTERS.map((loc) => (
                <Button
                  key={loc.value}
                  variant={selectedLocation === loc.value ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => setSelectedLocation(loc.value)}
                >
                  <MapPin className="size-3.5" data-icon="inline-start" />
                  {loc.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "departamento" : "departamentos"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <Building2 className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No se encontraron departamentos con estos filtros.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((property) => (
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
    </div>
  );
}
