"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CATEGORY_LABELS } from "@/lib/constants";
import { PRODUCT_CATEGORIES } from "@/lib/validations/product";
import { ShieldCheck, ShoppingBag, Tag } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  is_verified: boolean;
  images: string[];
  description?: string;
}

interface ProductCatalogProps {
  products: Product[];
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q")?.toLowerCase() ?? "";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = products.filter((p) => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (verifiedOnly && !p.is_verified) return false;
    if (queryParam && !p.title.toLowerCase().includes(queryParam) && !p.description?.toLowerCase().includes(queryParam)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Filters sidebar */}
      <aside className="w-full shrink-0 lg:w-64">
        <div className="sticky top-20 space-y-6 rounded-xl border bg-card p-5">
          {/* Verified toggle */}
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="verified-toggle" className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="size-4 text-accent" />
              Solo Verificados
            </Label>
            <Switch
              id="verified-toggle"
              checked={verifiedOnly}
              onCheckedChange={setVerifiedOnly}
            />
          </div>

          {/* Category filter */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Categoría
            </p>
            <div className="flex flex-col gap-1">
              <Button
                variant={selectedCategory === null ? "secondary" : "ghost"}
                size="sm"
                className="justify-start"
                onClick={() => setSelectedCategory(null)}
              >
                <Tag className="size-3.5" data-icon="inline-start" />
                Todas
              </Button>
              {PRODUCT_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "secondary" : "ghost"}
                  size="sm"
                  className="justify-start"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {CATEGORY_LABELS[cat]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Product grid */}
      <div className="flex-1">
        {/* Results count + publish CTA */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
          </p>
          <Button size="sm" render={<Link href="/mis-productos/nuevo" />}>
            <ShoppingBag className="size-4" data-icon="inline-start" />
            Publicar
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <ShoppingBag className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No se encontraron productos con estos filtros.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/productos/${product.id}`} className="group">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ShoppingBag className="size-10 text-muted-foreground/30" />
            </div>
          )}
          {product.is_verified && (
            <Badge className="absolute top-3 left-3 gap-1 bg-accent text-accent-foreground shadow-sm">
              <ShieldCheck className="size-3" />
              Verificado
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-heading line-clamp-1 text-base font-semibold">{product.title}</h3>
          <p className="mt-1 text-lg font-bold text-primary">
            ${Number(product.price).toLocaleString("es-CL")}
          </p>
          <Badge variant="outline" className="mt-2">
            {CATEGORY_LABELS[product.category] ?? product.category}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
