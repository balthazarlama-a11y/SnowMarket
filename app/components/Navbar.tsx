import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { SignOutButton } from "./SignOutButton";

export async function Navbar() {
  const user = await getCurrentUser();
  const isAdmin = user?.app_metadata?.role === "admin";

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      borderBottom: "1px solid #e5e5e5",
      background: "#fafafa",
    }}>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link href="/" style={{ fontWeight: "bold", fontSize: "1.2rem", textDecoration: "none", color: "#111" }}>
          SnowMarket
        </Link>
        <Link href="/productos" style={{ textDecoration: "none", color: "#555" }}>Productos</Link>
        <Link href="/departamentos" style={{ textDecoration: "none", color: "#555" }}>Departamentos</Link>
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {user ? (
          <>
            <Link href="/mis-productos" style={{ textDecoration: "none", color: "#555" }}>Mis Productos</Link>
            {isAdmin && (
              <Link href="/dashboard" style={{ textDecoration: "none", color: "#0070f3", fontWeight: 600 }}>Admin</Link>
            )}
            <span style={{ color: "#888", fontSize: "0.85rem" }}>{user.email}</span>
            <SignOutButton />
          </>
        ) : (
          <Link href="/auth/sign-in" style={{ textDecoration: "none", color: "#0070f3" }}>Iniciar Sesion</Link>
        )}
      </div>
    </nav>
  );
}
