import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 800, margin: "3rem auto", padding: "0 2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>SnowMarket</h1>
      <p style={{ color: "#666", fontSize: "1.1rem" }}>
        Marketplace de equipos de esqui y arriendo de departamentos en Chile
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2rem" }}>
        <Link href="/productos" style={{
          display: "inline-block", padding: "0.75rem 2rem",
          background: "#0070f3", color: "white", textDecoration: "none",
          borderRadius: 6, fontWeight: 600,
        }}>
          Ver Productos
        </Link>
        <Link href="/departamentos" style={{
          display: "inline-block", padding: "0.75rem 2rem",
          background: "#333", color: "white", textDecoration: "none",
          borderRadius: 6, fontWeight: 600,
        }}>
          Ver Departamentos
        </Link>
      </div>
    </main>
  );
}
