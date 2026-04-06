"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchBar } from "@/app/components/SearchBar";
import { ADMIN_WHATSAPP, CATEGORY_LABELS } from "@/lib/constants";
import {
  buildWhatsAppUrlWithText,
  WHATSAPP_PUBLISH_STANDARD,
  WHATSAPP_PUBLISH_VERIFIED,
} from "@/lib/whatsapp";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  CONDITION_LABELS,
  POPULAR_BRANDS,
  CLOTHING_SIZES,
  SKI_MODES,
  SKI_MODE_LABELS,
} from "@/lib/validations/product";
import {
  ShieldCheck,
  ShoppingBag,
  Tag,
  X,
  SlidersHorizontal,
  Check,
  ArrowRight,
} from "lucide-react";
import { FavoriteButton } from "@/app/components/FavoriteButton";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  is_verified: boolean;
  images: string[];
  description?: string;
  detailed_description?: string | null;
  brand?: string | null;
  model?: string | null;
  condition?: string | null;
  size_label?: string | null;
  size_value?: number | null;
  binding_type?: string | null;
  manufacture_year?: number | null;
  included_accessories?: string | null;
  technical_observations?: string | null;
  ski_modes?: string[];
}

interface ProductCatalogProps {
  products: Product[];
  initialFavoriteIds?: string[];
}

const PRODUCT_PUBLISH_STANDARD_HREF = buildWhatsAppUrlWithText(
  ADMIN_WHATSAPP,
  WHATSAPP_PUBLISH_STANDARD
);
const PRODUCT_PUBLISH_VERIFIED_HREF = buildWhatsAppUrlWithText(
  ADMIN_WHATSAPP,
  WHATSAPP_PUBLISH_VERIFIED
);

export function ProductCatalog({ products, initialFavoriteIds = [] }: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Internalize query as local state so clearFilters can reset it
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const queryParam = searchQuery.toLowerCase().trim();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeMin, setSizeMin] = useState("");
  const [sizeMax, setSizeMax] = useState("");
  const [selectedSkiModes, setSelectedSkiModes] = useState<string[]>([]);

  const hasFilters =
    selectedCategory !== null ||
    verifiedOnly ||
    searchQuery.trim() !== "" ||
    priceMin !== "" ||
    priceMax !== "" ||
    selectedConditions.length > 0 ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    sizeMin !== "" ||
    sizeMax !== "" ||
    selectedSkiModes.length > 0;

  function clearFilters() {
    setSelectedCategory(null);
    setSearchQuery("");
    setVerifiedOnly(false);
    setPriceMin("");
    setPriceMax("");
    setSelectedConditions([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSizeMin("");
    setSizeMax("");
    setSelectedSkiModes([]);
    // Clear URL search params so they don't re-apply on navigation
    router.replace("/productos", { scroll: false });
  }

  function toggleItem(list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) {
    setList((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  const showClothingSizes = selectedCategory === "ropa_de_esqui" || selectedCategory === "ropa_snowboard";
  const showCmRange = selectedCategory === "esquis" || selectedCategory === "tablas_snowboard" || selectedCategory === null;
  const showBootSizes = selectedCategory === "botas" || selectedCategory === "botas_snowboard";

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (verifiedOnly && !p.is_verified) return false;
      if (
        queryParam &&
        !p.title.toLowerCase().includes(queryParam) &&
        !p.description?.toLowerCase().includes(queryParam) &&
        !p.detailed_description?.toLowerCase().includes(queryParam)
      ) {
        return false;
      }
      const pMin = priceMin ? Number(priceMin) : 0;
      const pMax = priceMax ? Number(priceMax) : Infinity;
      if (p.price < pMin || p.price > pMax) return false;
      if (selectedConditions.length > 0 && (!p.condition || !selectedConditions.includes(p.condition))) return false;
      if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) return false;
      if (selectedSizes.length > 0 && (!p.size_label || !selectedSizes.includes(p.size_label))) return false;
      if (sizeMin && p.size_value != null && p.size_value < Number(sizeMin)) return false;
      if (sizeMax && p.size_value != null && p.size_value > Number(sizeMax)) return false;
      if (selectedSkiModes.length > 0) {
        const modes = p.ski_modes ?? [];
        if (!selectedSkiModes.some((m) => modes.includes(m))) return false;
      }
      return true;
    });
  }, [products, selectedCategory, verifiedOnly, queryParam, priceMin, priceMax, selectedConditions, selectedBrands, selectedSizes, sizeMin, sizeMax, selectedSkiModes]);

  const filterContent = (
    <div className="space-y-6">
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3" />
          Limpiar filtros
        </button>
      )}

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

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Precio (CLP)
        </p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Mín"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-8 text-xs"
            min={0}
          />
          <span className="text-xs text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Máx"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-8 text-xs"
            min={0}
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Estado
        </p>
        <div className="space-y-2">
          {PRODUCT_CONDITIONS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedConditions.includes(c)}
                onChange={() => toggleItem(selectedConditions, setSelectedConditions, c)}
                className="rounded border-input"
              />
              {CONDITION_LABELS[c]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Marca
        </p>
        <div className="max-h-40 space-y-2 overflow-y-auto">
          {POPULAR_BRANDS.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b)}
                onChange={() => toggleItem(selectedBrands, setSelectedBrands, b)}
                className="rounded border-input"
              />
              {b}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Modalidad
        </p>
        <div className="space-y-2">
          {SKI_MODES.map((m) => (
            <label key={m} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedSkiModes.includes(m)}
                onChange={() => toggleItem(selectedSkiModes, setSelectedSkiModes, m)}
                className="rounded border-input"
              />
              {SKI_MODE_LABELS[m]}
            </label>
          ))}
        </div>
      </div>

      {showClothingSizes && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Talla Ropa
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CLOTHING_SIZES.map((s) => (
              <Button
                key={s}
                variant={selectedSizes.includes(s) ? "secondary" : "outline"}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => toggleItem(selectedSizes, setSelectedSizes, s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}

      {(showCmRange || showBootSizes) && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {showBootSizes ? "Talla (Mondopoint cm)" : "Longitud / Ancho (cm)"}
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={sizeMin}
              onChange={(e) => setSizeMin(e.target.value)}
              className="h-8 text-xs"
              min={0}
            />
            <span className="text-xs text-muted-foreground">—</span>
            <Input
              type="number"
              placeholder="Máx"
              value={sizeMax}
              onChange={(e) => setSizeMax(e.target.value)}
              className="h-8 text-xs"
              min={0}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <aside className="hidden w-full shrink-0 lg:block lg:w-64">
        <div className="sticky top-20 space-y-6 rounded-xl border bg-card p-5">
          {filterContent}
        </div>
      </aside>

      <div className="flex-1">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
          </p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger
                  render={
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <SlidersHorizontal className="size-3.5" />
                      Filtros
                      {hasFilters && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          !
                        </span>
                      )}
                    </Button>
                  }
                />
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl pb-8">
                  <div className="p-4">
                    <h3 className="mb-4 font-heading text-lg font-semibold">Filtros</h3>
                    {filterContent}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-1 sm:flex-row sm:items-center sm:gap-2">
              <SearchBar />
              <div className="flex shrink-0 flex-row flex-nowrap items-center gap-2">
                <Button
                  size="sm"
                  className="shrink-0 whitespace-nowrap"
                  render={
                    <a
                      href={PRODUCT_PUBLISH_STANDARD_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <ShoppingBag className="size-4" data-icon="inline-start" />
                  Publicar
                </Button>
                <Button
                  size="sm"
                  className="shrink-0 gap-1.5 whitespace-nowrap bg-emerald-600 text-white hover:bg-emerald-700"
                  render={
                    <a
                      href={PRODUCT_PUBLISH_VERIFIED_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Check className="size-4" data-icon="inline-start" strokeWidth={2.5} />
                  Publicar Verificado
                </Button>
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <ShoppingBag className="mb-3 size-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No se encontraron productos con estos filtros.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isFavorite={initialFavoriteIds.includes(product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductCard({ product, isFavorite }: { product: Product; isFavorite: boolean }) {
  const listingDescription = product.description || product.detailed_description;

  return (
    <Link href={`/productos/${product.id}`} className="group relative block">
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
          
          <FavoriteButton itemId={product.id} initialIsFavorite={isFavorite} itemType="product" />

          {product.is_verified && (
            <Badge className="absolute top-3 left-3 gap-1 bg-accent text-accent-foreground shadow-sm z-10">
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
          {listingDescription && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {listingDescription}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </Badge>
            {product.brand && (
              <Badge variant="secondary" className="text-xs">{product.brand}</Badge>
            )}
            {product.model && (
              <Badge variant="secondary" className="text-xs">{product.model}</Badge>
            )}
            {product.condition && (
              <Badge variant="secondary" className="text-xs">
                {CONDITION_LABELS[product.condition] ?? product.condition}
              </Badge>
            )}
            {product.size_label && (
              <Badge variant="secondary" className="text-xs">{product.size_label}</Badge>
            )}
            {product.size_value !== null && product.size_value !== undefined && (
              <Badge variant="secondary" className="text-xs">{product.size_value} cm</Badge>
            )}
            {product.ski_modes?.map((m) => (
              <Badge key={m} variant="secondary" className="text-xs">
                {SKI_MODE_LABELS[m] ?? m}
              </Badge>
            ))}
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Ver detalles
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
