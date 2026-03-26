import { Suspense } from "react";
import { getProperties } from "@/actions/properties";
import { ADMIN_WHATSAPP } from "@/lib/constants";
import {
  buildWhatsAppUrlWithText,
  LIST_PROPERTY_WHATSAPP_MESSAGE,
} from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MessageCircle } from "lucide-react";
import { DepartamentosCatalog } from "./DepartamentosCatalog";

export const metadata = {
  title: "Departamentos en Arriendo",
  description: "Arrienda departamentos en los mejores centros de esquí de Chile",
};

export default async function DepartamentosPage() {
  const { data: properties, error } = await getProperties();
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
            Propiedades seleccionadas y gestionadas por SnowMarket en los principales
            centros de esquí de Chile. Contacto directo con nuestro equipo.
          </p>
        </div>
        <Button
          size="default"
          className="w-full shrink-0 gap-2 bg-[#25D366] text-white hover:bg-[#1da851] sm:w-auto"
          render={
            <a
              href={listPropertyWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <MessageCircle className="size-4" data-icon="inline-start" />
          Cómo subir departamento
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando propiedades: {error.message}
        </div>
      )}

      <Suspense fallback={null}>
        <DepartamentosCatalog properties={(properties as any[]) ?? []} />
      </Suspense>
    </div>
  );
}
