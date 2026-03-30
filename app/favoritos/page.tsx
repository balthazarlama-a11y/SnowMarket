import { Suspense } from "react";
import { redirect } from "next/navigation";
import { HeartCrack, ShoppingBag, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFavoriteProducts, getFavoriteProperties } from "@/actions/favorites";
import { getCurrentUser } from "@/actions/auth";
import { ProductCard } from "@/app/productos/ProductCatalog";
import { PropertyCard } from "@/app/departamentos/DepartamentosCatalog";

export const metadata = {
  title: "Mis Favoritos",
  description: "Tus elementos favoritos guardados en AndesMarket",
};

export default async function FavoritosPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // Fetch all user favorites in parallel (both products and properties)
  const [productsResponse, propertiesResponse] = await Promise.all([
    getFavoriteProducts(),
    getFavoriteProperties(),
  ]);

  const products = productsResponse.data ?? [];
  const properties = propertiesResponse.data ?? [];
  const productsError = productsResponse.error;
  const propertiesError = propertiesResponse.error;

  const totalFavorites = products.length + properties.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Mis Favoritos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Tus publicaciones y departamentos guardados para ver más tarde.
        </p>
      </div>

      {(productsError || propertiesError) && (
        <div className="mb-8 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando algunos de tus favoritos. Por favor, intenta de nuevo más tarde.
        </div>
      )}

      {totalFavorites === 0 && !productsError && !propertiesError ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
          <HeartCrack className="mb-3 size-12 text-muted-foreground/30" />
          <h2 className="text-xl font-semibold">No tienes elementos guardados</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Explora el catálogo de AndesMarket y usa el corazón para guardar los productos de equipo o departamentos que más te gusten.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button variant="outline" className="gap-2" render={<Link href="/productos" />}>
              <ShoppingBag className="size-4" /> Equipos de Esquí
            </Button>
            <Button variant="outline" className="gap-2" render={<Link href="/departamentos" />}>
              <Building2 className="size-4" /> Departamentos
            </Button>
          </div>
        </div>
      ) : (
        <Tabs defaultValue={products.length > 0 ? "productos" : "departamentos"} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="productos" className="gap-2">
              <ShoppingBag className="size-4" />
              Equipos de Esquí
              <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {products.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="departamentos" className="gap-2">
              <Building2 className="size-4" />
              Departamentos
              <span className="ml-1.5 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {properties.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="productos" className="mt-0 outline-none">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                <ShoppingBag className="mb-3 size-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">No tienes equipos de esquí en favoritos.</p>
                <Button variant="link" render={<Link href="/productos" />} className="mt-2 text-primary">
                  Explorar catálogo de equipos
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.isArray(products) && products.map((product) => (
                  <ProductCard key={product.id} product={product} isFavorite={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="departamentos" className="mt-0 outline-none">
            {properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                <Building2 className="mb-3 size-10 text-muted-foreground/30" />
                <p className="text-muted-foreground">No tienes departamentos en favoritos.</p>
                <Button variant="link" render={<Link href="/departamentos" />} className="mt-2 text-primary">
                  Ver opciones en la nieve
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(properties) && properties.map((property) => (
                  <PropertyCard key={property.id} property={property} isFavorite={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
