import Link from "next/link";
import { getProducts } from "@/actions/products";
import { CATEGORY_LABELS } from "@/lib/constants";

export default async function ProductosPage() {
  const { data: products, error } = await getProducts();

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Productos de Esqui</h1>
        <Link href="/mis-productos/nuevo" style={{
          padding: "0.5rem 1rem", background: "#0070f3", color: "white",
          textDecoration: "none", borderRadius: 6, fontSize: "0.9rem",
        }}>
          Publicar Producto
        </Link>
      </div>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {!products || products.length === 0 ? (
        <p style={{ color: "#888", marginTop: "2rem" }}>No hay productos publicados aun.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
          {products.map((p: any) => (
            <Link key={p.id} href={`/productos/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                border: "1px solid #e5e5e5", borderRadius: 8, padding: "1rem",
                transition: "box-shadow 0.2s", cursor: "pointer",
              }}>
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6 }} />
                )}
                <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{p.title}</h3>
                <p style={{ color: "#0070f3", fontWeight: 600, margin: 0 }}>
                  ${Number(p.price).toLocaleString("es-CL")}
                </p>
                <p style={{ color: "#888", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
                  {CATEGORY_LABELS[p.category] ?? p.category}
                  {p.is_verified && " · Verificado"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
