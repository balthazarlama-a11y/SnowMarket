import { notFound } from "next/navigation";
import { getProductById } from "@/actions/products";
import { WhatsAppButton } from "@/app/components/WhatsAppButton";
import { CATEGORY_LABELS, ADMIN_WHATSAPP } from "@/lib/constants";
import Link from "next/link";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: product, error } = await getProductById(id);

  if (error || !product) return notFound();

  const entityType = product.is_verified ? "product_verified" : "product_user";

  return (
    <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 2rem" }}>
      <Link href="/productos" style={{ color: "#0070f3", textDecoration: "none" }}>← Volver a productos</Link>

      <h1 style={{ marginTop: "1rem" }}>{product.title}</h1>

      {product.is_verified && (
        <span style={{ background: "#0070f3", color: "white", padding: "0.2rem 0.6rem", borderRadius: 4, fontSize: "0.8rem" }}>
          Verificado por SnowMarket
        </span>
      )}

      {product.images?.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", overflowX: "auto" }}>
          {product.images.map((img: string, i: number) => (
            <img key={i} src={img} alt={`${product.title} ${i + 1}`} style={{ width: 300, height: 200, objectFit: "cover", borderRadius: 8 }} />
          ))}
        </div>
      )}

      <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0070f3", marginTop: "1rem" }}>
        ${Number(product.price).toLocaleString("es-CL")}
      </p>

      <p style={{ color: "#888" }}>{CATEGORY_LABELS[product.category] ?? product.category}</p>

      <p style={{ lineHeight: 1.6, marginTop: "0.5rem" }}>{product.description}</p>

      <div style={{ marginTop: "1.5rem" }}>
        <WhatsAppButton
          phone={product.whatsapp_number}
          itemName={product.title}
          price={Number(product.price)}
          entityType={entityType}
          adminPhone={ADMIN_WHATSAPP}
        />
      </div>
    </main>
  );
}
