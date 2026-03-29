import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import { ProductCatalog } from "./ProductCatalog";

export const metadata = {
  title: "Productos de Esquí",
  description: "Encuentra equipos de esquí nuevos y usados — verificados y de la comunidad",
};

export default async function ProductosPage() {
  const { data: products, error } = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Productos de Esquí
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explora equipos verificados por AndesMarket y publicaciones de la comunidad.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando productos: {error.message}
        </div>
      )}

      <Suspense fallback={null}>
        <ProductCatalog products={products ?? []} />
      </Suspense>
    </div>
  );
}
