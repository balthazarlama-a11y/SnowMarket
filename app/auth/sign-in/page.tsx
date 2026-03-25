"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "@/actions/auth";
import Link from "next/link";

export default function SignInPage() {
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);
    if (!result.success) {
      setError(result.error);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", padding: "2rem" }}>
      <h1>Iniciar Sesion</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
        <input name="email" type="email" placeholder="Email" required style={{ padding: "0.5rem" }} />
        <input name="password" type="password" placeholder="Contrasena" required minLength={6} style={{ padding: "0.5rem" }} />
        <button type="submit" style={{ padding: "0.5rem", cursor: "pointer" }}>Entrar</button>
      </form>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      <p style={{ marginTop: "1rem" }}>
        No tienes cuenta? <Link href="/auth/sign-up">Registrate</Link>
      </p>
    </main>
  );
}
