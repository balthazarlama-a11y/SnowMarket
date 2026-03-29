import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getProducts } from "@/actions/products";
import { CATEGORY_LABELS } from "@/lib/constants";
import { DeleteProductButton } from "./DeleteProductButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Package,
  Eye,
  ShieldCheck,
  Pencil,
} from "lucide-react";

export const metadata = {
  title: "Mis Productos",
};

export default async function MisProductosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const { data: allProducts } = await getProducts();
  const myProducts =
    allProducts?.filter((p: any) => p.owner_id === user.id) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Mis Productos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {myProducts.length}{" "}
            {myProducts.length === 1 ? "producto publicado" : "productos publicados"}
          </p>
        </div>
        <Button render={<Link href="/mis-productos/nuevo" />}>
          <Plus className="size-4" data-icon="inline-start" />
          Publicar
        </Button>
      </div>

      {myProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <Package className="mb-3 size-12 text-muted-foreground/30" />
          <p className="text-lg text-muted-foreground">
            No has publicado productos aún.
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Publica tu primer equipo de esquí para empezar a vender.
          </p>
          <Button className="mt-6" render={<Link href="/mis-productos/nuevo" />}>
            <Plus className="size-4" data-icon="inline-start" />
            Publicar Producto
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {myProducts.map((p: any) => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-heading font-semibold">
                      {p.title}
                    </h3>
                    {p.is_verified && (
                      <Badge
                        variant="secondary"
                        className="shrink-0 gap-1 text-accent"
                      >
                        <ShieldCheck className="size-3" />
                        Verificado
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {CATEGORY_LABELS[p.category]}
                    </Badge>
                    <span className="font-medium text-primary">
                      ${Number(p.price).toLocaleString("es-CL")}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="ghost" size="sm" render={<Link href={`/productos/${p.id}`} />}>
                    <Eye className="size-3.5" data-icon="inline-start" />
                    Ver
                  </Button>
                  <Button variant="ghost" size="sm" render={<Link href={`/mis-productos/${p.id}/editar`} />}>
                    <Pencil className="size-3.5" data-icon="inline-start" />
                    Editar
                  </Button>
                  <DeleteProductButton productId={p.id} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
