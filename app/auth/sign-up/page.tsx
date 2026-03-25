"use client";

import { useState, type FormEvent } from "react";
import { signUp } from "@/actions/auth";
import Link from "next/link";

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error);
    }
  }

  if (success) {
    return (
      <main style={{ maxWidth: 400, margin: "4rem auto", padding: "2rem" }}>
        <h1>Registro exitoso</h1>
        <p>Revisa tu email para confirmar tu cuenta.</p>
        <Link href="/auth/sign-in">Ir a iniciar sesion</Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 400, margin: "4rem auto", padding: "2rem" }}>
      <h1>Crear Cuenta</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
        <input name="email" type="email" placeholder="Email" required style={{ padding: "0.5rem" }} />
        <input name="password" type="password" placeholder="Contrasena (min 6 caracteres)" required minLength={6} style={{ padding: "0.5rem" }} />
        <button type="submit" style={{ padding: "0.5rem", cursor: "pointer" }}>Registrarse</button>
      </form>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
      <p style={{ marginTop: "1rem" }}>
        Ya tienes cuenta? <Link href="/auth/sign-in">Inicia sesion</Link>
      </p>
    </main>
  );
}
