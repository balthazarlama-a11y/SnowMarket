import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import { getUserFavoriteIds } from "@/actions/favorites";
import { ProductCatalog } from "@/app/productos/ProductCatalog";

const SNOWBOARD_CATEGORIES = ["tablas_snowboard", "botas_snowboard", "fijaciones_snowboard", "ropa_snowboard"];

export const metadata = {
  title: "Snowboard",
  description: "Encuentra tablas, botas y fijaciones de snowboard nuevas y usadas — verificadas y de la comunidad",
};

export default async function SnowboardPage() {
  const [{ data: products, error }, favoriteIds] = await Promise.all([
    getProducts({ categories: SNOWBOARD_CATEGORIES }),
    getUserFavoriteIds(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Snowboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explora equipos de snowboard verificados por AndesMarket y publicaciones de la comunidad.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando productos: {error.message}
        </div>
      )}

      <Suspense fallback={null}>
        <ProductCatalog
          products={products ?? []}
          initialFavoriteIds={favoriteIds}
          allowedCategories={SNOWBOARD_CATEGORIES}
        />
      </Suspense>
    </div>
  );
}
