import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Snowflake, Footprints, Shirt, HardHat, Glasses, Puzzle, LayoutGrid, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CATEGORY_LABELS } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Explora todas las categorías de equipos de esquí y snowboard disponibles en AndesMarket.",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  esquis: <Snowflake className="size-7" />,
  botas: <Footprints className="size-7" />,
  ropa_de_esqui: <Shirt className="size-7" />,
  cascos: <HardHat className="size-7" />,
  antiparras: <Glasses className="size-7" />,
  bastones: <TrendingUp className="size-7" />,
  snowboard: <Snowflake className="size-7" />,
  botas_snowboard: <Footprints className="size-7" />,
  otros_accesorios: <Puzzle className="size-7" />,
};

const CATEGORY_IMAGES: Record<string, string> = {
  esquis: "/images/esquis.png",
  botas: "/images/botas.png",
  ropa_de_esqui: "/images/ropa.jpg",
  cascos: "/images/casco.png",
  antiparras: "/images/antiparras.jpg",
  bastones: "/images/hero-skier.png",
  snowboard: "/images/hero-mountain-hd.jpg",
  botas_snowboard: "/images/botas.png",
  otros_accesorios: "/images/hero-esquis-hd.png",
};

function getProductCountLabel(count: number) {
  return `${count} ${count === 1 ? "producto" : "productos"}`;
}

export default async function CategoriasPage() {
  const supabase = await createSupabaseServerClient();
  const { data: categoryRows } = await supabase
    .from("products")
    .select("category")
    .not("category", "is", null);

  const categoryCounts = Object.keys(CATEGORY_LABELS).reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {} as Record<string, number>);

  for (const row of categoryRows ?? []) {
    if (row.category && row.category in categoryCounts) {
      categoryCounts[row.category] += 1;
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <LayoutGrid className="size-3" />
            Catálogo
          </Badge>
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Explora por categoría
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Encuentra exactamente lo que necesitas para tu próxima temporada en la nieve.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link
              key={key}
              href={`/productos?category=${key}`}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={CATEGORY_IMAGES[key] ?? "/images/hero-mountain-hd.jpg"}
                  alt={label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <div className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-xl bg-white/85 text-primary shadow-md backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  {CATEGORY_ICONS[key]}
                </div>
              </div>
              <div className="flex items-end justify-between gap-3 p-5">
                <div>
                  <p className="font-heading text-base font-semibold leading-tight">{label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {getProductCountLabel(categoryCounts[key] ?? 0)}
                  </p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
