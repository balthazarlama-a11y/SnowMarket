import { Suspense } from "react";
import { getProperties } from "@/actions/properties";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ADMIN_WHATSAPP } from "@/lib/constants";
import {
  buildWhatsAppUrlWithText,
  LIST_PROPERTY_WHATSAPP_MESSAGE,
} from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/app/components/SearchBar";
import { Building2, MessageCircle } from "lucide-react";
import { DepartamentosCatalog } from "./DepartamentosCatalog";

import { getUserFavoriteIds } from "@/actions/favorites";

export const metadata = {
  title: "Departamentos en Arriendo",
  description: "Arrienda departamentos en los mejores centros de esquí de Chile",
};

export default async function DepartamentosPage() {
  const [{ data: properties, error }, supabase, favoriteIds] = await Promise.all([
    getProperties(),
    createSupabaseServerClient(),
    getUserFavoriteIds("property"),
  ]);
  const { data: reservations } = await supabase
    .from("reservations")
    .select("property_id, start_date, end_date")
    .gte("end_date", new Date().toISOString().split("T")[0]);
  const listPropertyWhatsAppHref = buildWhatsAppUrlWithText(
    ADMIN_WHATSAPP,
    LIST_PROPERTY_WHATSAPP_MESSAGE
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Badge variant="secondary" className="mb-3 gap-1.5">
            <Building2 className="size-3" />
            Arriendos Administrados
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Departamentos en la Nieve
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Propiedades seleccionadas y gestionadas por AndesMarket en los principales
            centros de esquí de Chile. Contacto directo con nuestro equipo.
          </p>
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto sm:justify-end">
          <div className="flex-1 sm:flex-none">
            <SearchBar />
          </div>
          <Button
            size="default"
            className="shrink-0 gap-2 bg-[#25D366] text-white hover:bg-[#1da851]"
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

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando propiedades: {error.message}
        </div>
      )}

      <Suspense fallback={null}>
        <DepartamentosCatalog
          properties={(properties as any[]) ?? []}
          reservations={(reservations as any[]) ?? []}
          initialFavoriteIds={favoriteIds}
        />
      </Suspense>
    </div>
  );
}
