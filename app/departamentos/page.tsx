import { Suspense } from "react";
import { getProperties } from "@/actions/properties";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { DepartamentosCatalog } from "./DepartamentosCatalog";

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

      <Suspense fallback={null}>
        <DepartamentosCatalog properties={(properties as any[]) ?? []} />
      </Suspense>
    </div>
  );
}
