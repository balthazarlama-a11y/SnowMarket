import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Panel de Administracion - SnowMarket</h1>
      <nav style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Link href="/dashboard/products">Gestionar Productos Verificados</Link>
        <Link href="/dashboard/properties">Gestionar Propiedades</Link>
      </nav>
    </main>
  );
}
