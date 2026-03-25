import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProductById } from "@/actions/products";
import { WhatsAppButton } from "@/app/components/WhatsAppButton";
import { CATEGORY_LABELS, ADMIN_WHATSAPP } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShieldCheck, Tag, User } from "lucide-react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: product, error } = await getProductById(id);

  if (error || !product) return notFound();

  const entityType = product.is_verified ? "product_verified" : "product_user";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Back link */}
      <Button variant="ghost" size="sm" className="mb-6" render={<Link href="/productos" />}>
        <ArrowLeft className="size-4" data-icon="inline-start" />
        Volver a productos
      </Button>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Images */}
        <div className="lg:col-span-3">
          {product.images?.length > 0 ? (
            <div className="space-y-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary/50">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.slice(1).map((img: string, i: number) => (
                    <div
                      key={i}
                      className="relative size-20 shrink-0 overflow-hidden rounded-lg sm:size-24"
                    >
                      <Image
                        src={img}
                        alt={`${product.title} ${i + 2}`}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-secondary/50">
              <Tag className="size-16 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 p-6">
              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                {product.is_verified && (
                  <Badge className="gap-1 bg-accent text-accent-foreground">
                    <ShieldCheck className="size-3" />
                    Verificado por SnowMarket
                  </Badge>
                )}
                <Badge variant="outline">
                  {CATEGORY_LABELS[product.category] ?? product.category}
                </Badge>
              </div>

              <h1 className="font-heading text-2xl font-bold tracking-tight">
                {product.title}
              </h1>

              <p className="text-3xl font-bold text-primary">
                ${Number(product.price).toLocaleString("es-CL")}
              </p>

              <Separator />

              <div>
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                  Descripción
                </h2>
                <p className="leading-relaxed">{product.description}</p>
              </div>

              <Separator />

              {/* Seller info */}
              {!product.is_verified && product.owner && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="size-4" />
                  Publicado por {product.owner.email}
                </div>
              )}

              {/* WhatsApp CTA */}
              <WhatsAppButton
                phone={product.whatsapp_number}
                itemName={product.title}
                price={Number(product.price)}
                entityType={entityType}
                adminPhone={ADMIN_WHATSAPP}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
