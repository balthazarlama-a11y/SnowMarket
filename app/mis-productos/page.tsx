import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getProducts } from "@/actions/products";
import { CATEGORY_LABELS } from "@/lib/constants";
import { DeleteProductButton } from "./DeleteProductButton";

export default async function MisProductosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  const { data: allProducts } = await getProducts();
  const myProducts = allProducts?.filter((p: any) => p.owner_id === user.id) ?? [];

  return (
    <main style={{ maxWidth: 800, margin: "2rem auto", padding: "0 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Mis Productos</h1>
        <Link href="/mis-productos/nuevo" style={{
          padding: "0.5rem 1rem", background: "#0070f3", color: "white",
          textDecoration: "none", borderRadius: 6,
        }}>
          + Publicar Producto
        </Link>
      </div>

      {myProducts.length === 0 ? (
        <p style={{ color: "#888", marginTop: "2rem" }}>No has publicado productos aun.</p>
      ) : (
        <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {myProducts.map((p: any) => (
            <div key={p.id} style={{
              border: "1px solid #e5e5e5", borderRadius: 8, padding: "1rem",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <h3 style={{ margin: "0 0 0.25rem" }}>{p.title}</h3>
                <p style={{ margin: 0, color: "#888", fontSize: "0.85rem" }}>
                  {CATEGORY_LABELS[p.category]} · ${Number(p.price).toLocaleString("es-CL")}
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link href={`/productos/${p.id}`} style={{ color: "#0070f3", textDecoration: "none", fontSize: "0.9rem" }}>Ver</Link>
                <DeleteProductButton productId={p.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
