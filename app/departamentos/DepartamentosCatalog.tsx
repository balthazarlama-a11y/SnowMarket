"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AMENITY_LABELS } from "@/lib/validations/property";
import {
  Building2,
  MapPin,
  Tag,
  X,
  SlidersHorizontal,
  MessageCircle,
  Users,
  BedDouble,
  CalendarDays,
  Minus,
  Plus,
} from "lucide-react";
import { FavoriteButton } from "@/app/components/FavoriteButton";
import { SearchBar } from "@/app/components/SearchBar";

const LOCATION_FILTERS = [
  { value: "La Parva", label: "La Parva" },
  { value: "El Colorado", label: "El Colorado" },
  { value: "Farellones", label: "Farellones" },
  { value: "Valle Nevado", label: "Valle Nevado" },
] as const;

const ALL_AMENITIES = Object.keys(AMENITY_LABELS);

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  images: string[];
  description?: string;
  full_description?: string | null;
  max_guests?: number;
  bedrooms?: number;
  amenities?: string[];
}

interface Reservation {
  property_id: string;
  start_date: string;
  end_date: string;
}

interface DepartamentosCatalogProps {
  properties: Property[];
  reservations?: Reservation[];
  initialFavoriteIds?: string[];
  listPropertyWhatsAppHref: string;
}

export function PropertyCard({ property, isFavorite }: { property: Property; isFavorite: boolean }) {
  const listingDescription = property.full_description || property.description;

  return (
    <Link href={`/departamentos/${property.id}`} className="group relative block">
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
          
          <FavoriteButton itemId={property.id} initialIsFavorite={isFavorite} itemType="property" />
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
          {listingDescription && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {listingDescription}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {(property.max_guests ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <Users className="size-3" />{property.max_guests}
              </span>
            )}
            {(property.bedrooms ?? 0) > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble className="size-3" />{property.bedrooms}
              </span>
            )}
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
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useState(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  });
  if (debounced !== value) setDebounced(value);
  return debounced;
}

function Stepper({
  value,
  onChange,
  min = 0,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  label: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-secondary"
        >
          <Minus className="size-3" />
        </button>
        <span className="w-6 text-center text-sm font-medium">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-secondary"
        >
          <Plus className="size-3" />
        </button>
      </div>
    </div>
  );
}

export function DepartamentosCatalog({
  properties,
  reservations = [],
  initialFavoriteIds = [],
  listPropertyWhatsAppHref,
}: DepartamentosCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q")?.toLowerCase() ?? "";
  const locationParam = searchParams.get("location");

  const [selectedLocation, setSelectedLocation] = useState<string | null>(locationParam ?? null);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [dateFrom, setDateFrom] = useState(searchParams.get("from") ?? "");
  const [dateTo, setDateTo] = useState(searchParams.get("to") ?? "");
  const [guests, setGuests] = useState(0);
  const [bedrooms, setBedrooms] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const hasFilters =
    selectedLocation !== null ||
    priceMin !== "" ||
    priceMax !== "" ||
    dateFrom !== "" ||
    dateTo !== "" ||
    guests > 0 ||
    bedrooms > 0 ||
    selectedAmenities.length > 0;

  function clearFilters() {
    setSelectedLocation(null);
    setPriceMin("");
    setPriceMax("");
    setDateFrom("");
    setDateTo("");
    setGuests(0);
    setBedrooms(0);
    setSelectedAmenities([]);
  }

  function toggleAmenity(a: string) {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }

  const bookedPropertyIds = useMemo(() => {
    if (!dateFrom || !dateTo) return new Set<string>();
    const ids = new Set<string>();
    for (const r of reservations) {
      if (r.start_date < dateTo && r.end_date > dateFrom) {
        ids.add(r.property_id);
      }
    }
    return ids;
  }, [reservations, dateFrom, dateTo]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (selectedLocation && !p.location?.toLowerCase().includes(selectedLocation.toLowerCase())) return false;
      if (
        queryParam &&
        !p.title.toLowerCase().includes(queryParam) &&
        !p.location?.toLowerCase().includes(queryParam) &&
        !p.description?.toLowerCase().includes(queryParam) &&
        !p.full_description?.toLowerCase().includes(queryParam)
      ) {
        return false;
      }
      const pMin = priceMin ? Number(priceMin) : 0;
      const pMax = priceMax ? Number(priceMax) : Infinity;
      if (p.price < pMin || p.price > pMax) return false;
      if (dateFrom && dateTo && bookedPropertyIds.has(p.id)) return false;
      if (guests > 0 && (p.max_guests ?? 2) < guests) return false;
      if (bedrooms > 0 && (p.bedrooms ?? 1) < bedrooms) return false;
      if (selectedAmenities.length > 0) {
        const propAmenities = p.amenities ?? [];
        if (!selectedAmenities.every((a) => propAmenities.includes(a))) return false;
      }
      return true;
    });
  }, [properties, selectedLocation, queryParam, priceMin, priceMax, dateFrom, dateTo, bookedPropertyIds, guests, bedrooms, selectedAmenities]);

  const filterContent = (
    <div className="space-y-6">
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3" />
          Limpiar filtros
        </button>
      )}

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

      <div>
        <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <CalendarDays className="size-3" />
          Fechas de Estancia
        </p>
        <div className="space-y-2">
          <div>
            <Label className="text-xs text-muted-foreground">Check-in</Label>
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 text-xs" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Check-out</Label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} min={dateFrom || undefined} className="h-8 text-xs" />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Precio por noche (CLP)
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Mín"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-8 text-xs"
            min={0}
          />
          <span className="text-xs text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Máx"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-8 text-xs"
            min={0}
          />
        </div>
      </div>

      <div>
        <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Users className="size-3" />
          Capacidad
        </p>
        <div className="space-y-3">
          <Stepper label="Huéspedes" value={guests} onChange={setGuests} />
          <Stepper label="Habitaciones" value={bedrooms} onChange={setBedrooms} />
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Comodidades
        </p>
        <div className="space-y-2">
          {ALL_AMENITIES.map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="rounded border-input"
              />
              {AMENITY_LABELS[a]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="hidden w-full shrink-0 lg:block lg:w-64">
        <div className="sticky top-20 space-y-6 rounded-xl border bg-card p-5">
          {filterContent}
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "departamento" : "departamentos"}
          </p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <SlidersHorizontal className="size-3.5" />
                      Filtros
                      {hasFilters && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          !
                        </span>
                      )}
                    </Button>
                  }
                />
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl pb-8">
                  <div className="p-4">
                    <h3 className="mb-4 font-heading text-lg font-semibold">Filtros</h3>
                    {filterContent}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center sm:gap-2">
              <SearchBar />
              <Button
                size="sm"
                className="shrink-0 gap-2 whitespace-nowrap bg-[#25D366] text-white hover:bg-[#1da851]"
                render={
                  <a
                    href={listPropertyWhatsAppHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <MessageCircle className="size-4" data-icon="inline-start" />
                <span className="hidden sm:inline">¡Sube tu departamento por aquí!</span>
                <span className="sm:hidden">Publicar</span>
              </Button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <Building2 className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No se encontraron departamentos con estos filtros.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                isFavorite={initialFavoriteIds.includes(property.id)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
