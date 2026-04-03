import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById } from "@/actions/products";
import { WhatsAppButton } from "@/app/components/WhatsAppButton";
import { CATEGORY_LABELS, ADMIN_WHATSAPP } from "@/lib/constants";
import { CONDITION_LABELS } from "@/lib/validations/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ShieldCheck, Tag, User } from "lucide-react";
import { ImageGallery } from "./ImageGallery";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: product, error } = await getProductById(id);

  if (error || !product) return notFound();

  const entityType = product.is_verified ? "product_verified" : "product_user";
  const shortDescription = product.description?.trim() || "Sin descripción corta.";
  const detailedDescription = product.detailed_description?.trim() || shortDescription;
  const includedAccessories = product.included_accessories?.trim() || "Sin especificar.";
  const technicalObservations =
    product.technical_observations?.trim() || "Sin observaciones técnicas.";
  const conditionLabel =
    (product.condition && CONDITION_LABELS[product.condition]) ||
    product.condition ||
    "Sin especificar";
  const specifications = [
    { label: "Marca", value: product.brand || "Sin especificar" },
    { label: "Modelo", value: product.model || "Sin especificar" },
    { label: "Estado", value: conditionLabel },
    { label: "Longitud / Talle", value: product.size_label || "Sin especificar" },
    {
      label: "Medida en cm",
      value:
        product.size_value !== null && product.size_value !== undefined
          ? `${product.size_value} cm`
          : "Sin especificar",
    },
    {
      label: "Tipo de fijaciones",
      value: product.binding_type || "Sin especificar",
    },
    {
      label: "Año",
      value: product.manufacture_year || "Sin especificar",
    },
  ];

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
            <ImageGallery images={product.images} title={product.title} />
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
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Información general
                </h2>
                <div className="grid gap-2 text-sm">
                  <p>
                    <span className="font-medium">Categoría:</span>{" "}
                    {CATEGORY_LABELS[product.category] ?? product.category}
                  </p>
                  <p>
                    <span className="font-medium">Descripción corta:</span>{" "}
                    {shortDescription}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Ficha técnica
                </h2>
                <dl className="space-y-2 text-sm">
                  {specifications.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-3 border-b border-border/60 pb-2"
                    >
                      <dt className="font-medium text-muted-foreground">{item.label}</dt>
                      <dd className="text-right">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Separator />

              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Descripción detallada
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-sm">
                  {detailedDescription}
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Accesorios incluidos
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {includedAccessories}
                </p>
              </div>

              <Separator />

              <div>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Observaciones técnicas
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed">
                  {technicalObservations}
                </p>
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
