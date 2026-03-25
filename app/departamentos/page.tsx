import Link from "next/link";
import { getProperties } from "@/actions/properties";

export default async function DepartamentosPage() {
  const { data: properties, error } = await getProperties();

  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 2rem" }}>
      <h1>Departamentos en Arriendo</h1>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      {!properties || properties.length === 0 ? (
        <p style={{ color: "#888", marginTop: "2rem" }}>No hay departamentos publicados aun.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "1.5rem" }}>
          {properties.map((p: any) => (
            <Link key={p.id} href={`/departamentos/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{
                border: "1px solid #e5e5e5", borderRadius: 8, padding: "1rem",
                cursor: "pointer",
              }}>
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.title} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 6 }} />
                )}
                <h3 style={{ margin: "0.5rem 0 0.25rem" }}>{p.title}</h3>
                <p style={{ color: "#0070f3", fontWeight: 600, margin: 0 }}>
                  ${Number(p.price).toLocaleString("es-CL")} /noche
                </p>
                <p style={{ color: "#888", fontSize: "0.85rem", margin: "0.25rem 0 0" }}>
                  {p.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
