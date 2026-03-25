import { notFound } from "next/navigation";
import { getPropertyById } from "@/actions/properties";
import { WhatsAppButton } from "@/app/components/WhatsAppButton";
import { ADMIN_WHATSAPP } from "@/lib/constants";
import Link from "next/link";

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: property, error } = await getPropertyById(id);

  if (error || !property) return notFound();

  return (
    <main style={{ maxWidth: 700, margin: "2rem auto", padding: "0 2rem" }}>
      <Link href="/departamentos" style={{ color: "#0070f3", textDecoration: "none" }}>← Volver a departamentos</Link>

      <h1 style={{ marginTop: "1rem" }}>{property.title}</h1>
      <p style={{ color: "#888" }}>{property.location}</p>

      {property.images?.length > 0 && (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", overflowX: "auto" }}>
          {property.images.map((img: string, i: number) => (
            <img key={i} src={img} alt={`${property.title} ${i + 1}`} style={{ width: 350, height: 220, objectFit: "cover", borderRadius: 8 }} />
          ))}
        </div>
      )}

      <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0070f3", marginTop: "1rem" }}>
        ${Number(property.price).toLocaleString("es-CL")} /noche
      </p>

      <p style={{ lineHeight: 1.6, marginTop: "0.5rem" }}>{property.description}</p>

      <div style={{ marginTop: "1.5rem" }}>
        <WhatsAppButton
          phone={property.whatsapp_contact}
          itemName={property.title}
          price={Number(property.price)}
          entityType="property"
          adminPhone={ADMIN_WHATSAPP}
        />
      </div>
    </main>
  );
}
