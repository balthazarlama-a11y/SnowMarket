import { Suspense } from "react";
import { getProperties } from "@/actions/properties";
import { getAllAvailability } from "@/actions/availability";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADMIN_WHATSAPP } from "@/lib/constants";
import {
  buildWhatsAppUrlWithText,
  WHATSAPP_PUBLISH_DEPARTMENT,
} from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { DepartamentosCatalog } from "./DepartamentosCatalog";

import { getUserFavoriteIds } from "@/actions/favorites";

export const metadata = {
  title: "Departamentos en Arriendo",
  description: "Arrienda departamentos en los mejores centros de esquí de Chile",
};

export default async function DepartamentosPage() {
  const [{ data: properties, error }, supabase, favoriteIds, { data: availability }] =
    await Promise.all([
      getProperties(),
      createSupabaseServerClient(),
      getUserFavoriteIds("property"),
      getAllAvailability(),
    ]);
  const { data: reservations } = await supabase
    .from("reservations")
    .select("property_id, start_date, end_date")
    .gte("end_date", new Date().toISOString().split("T")[0]);
  const listPropertyWhatsAppHref = buildWhatsAppUrlWithText(
    ADMIN_WHATSAPP,
    WHATSAPP_PUBLISH_DEPARTMENT
  );

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
        <p className="mt-2 text-muted-foreground">
          Propiedades seleccionadas y gestionadas por AndesMarket en los principales
          centros de esquí de Chile. Contacto directo con nuestro equipo.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando propiedades: {error.message}
        </div>
      )}

      <Suspense fallback={null}>
        <DepartamentosCatalog
          properties={(properties as any[]) ?? []}
          reservations={(reservations as any[]) ?? []}
          availability={(availability as any[]) ?? []}
          initialFavoriteIds={favoriteIds}
          listPropertyWhatsAppHref={listPropertyWhatsAppHref}
        />
      </Suspense>
    </div>
  );
}
