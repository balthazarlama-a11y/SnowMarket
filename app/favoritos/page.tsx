import { Suspense } from "react";
import { redirect } from "next/navigation";
import { HeartCrack } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getFavoriteProducts, getUserFavoriteIds } from "@/actions/favorites";
import { ProductCatalog } from "@/app/productos/ProductCatalog";
import { getCurrentUser } from "@/actions/auth";

export const metadata = {
  title: "Mis Favoritos",
  description: "Tus productos favoritos de esquí guardados en AndesMarket",
};

export default async function FavoritosPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const [{ data: products, error }, favoriteIds] = await Promise.all([
    getFavoriteProducts(),
    getUserFavoriteIds(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Mis Favoritos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Los equipos de esquí que has guardado para ver más tarde.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando tus favoritos: {error.message}
        </div>
      )}

      {products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
          <HeartCrack className="mb-3 size-12 text-muted-foreground/30" />
          <h2 className="text-xl font-semibold">No tienes productos guardados</h2>
          <p className="mt-2 text-muted-foreground">
            Explora el catálogo y usa el corazón para guardar lo que más te guste.
          </p>
          <Button variant="outline" className="mt-6" render={<Link href="/productos" />}>
            Explorar Catálogo
          </Button>
        </div>
      ) : (
        <Suspense fallback={null}>
          <ProductCatalog products={products ?? []} initialFavoriteIds={favoriteIds} />
        </Suspense>
      )}
    </div>
  );
}
