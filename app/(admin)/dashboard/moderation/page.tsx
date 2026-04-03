import { getProducts } from "@/actions/products";
import { CATEGORY_LABELS } from "@/lib/constants";
import { AdminDeleteButton } from "./AdminDeleteButton";
import { VerifyToggle } from "./VerifyToggle";
import { AdminEditModal } from "./AdminEditModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ShieldCheck,
  Shield,
  Eye,
  Package,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "Moderar Publicaciones",
};

export default async function ModerationPage() {
  const { data: products, error } = await getProducts();

  const allProducts = (products as any[]) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          render={<Link href="/dashboard" />}
        >
          <ArrowLeft className="size-4" data-icon="inline-start" />
          Volver al panel
        </Button>
        <Badge variant="secondary" className="mb-3 gap-1.5">
          <Shield className="size-3" />
          Moderación
        </Badge>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Moderar Publicaciones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {allProducts.length}{" "}
          {allProducts.length === 1
            ? "producto en el catálogo"
            : "productos en el catálogo"}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error cargando productos: {error.message}
        </div>
      )}

      {allProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
          <Package className="mb-3 size-12 text-muted-foreground/30" />
          <p className="text-lg text-muted-foreground">
            No hay productos publicados.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {allProducts.map((p: any) => (
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
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {CATEGORY_LABELS[p.category] ?? p.category}
                    </Badge>
                    <span className="font-medium text-primary">
                      ${Number(p.price).toLocaleString("es-CL")}
                    </span>
                    <span className="text-xs">
                      por {p.owner?.email ?? "desconocido"}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">Verificado</span>
                    <VerifyToggle
                      productId={p.id}
                      initialVerified={!!p.is_verified}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    render={<Link href={`/productos/${p.id}`} />}
                  >
                    <Eye className="size-3.5" data-icon="inline-start" />
                    Ver
                  </Button>
                  <AdminEditModal product={p} />
                  <AdminDeleteButton
                    productId={p.id}
                    productTitle={p.title}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
