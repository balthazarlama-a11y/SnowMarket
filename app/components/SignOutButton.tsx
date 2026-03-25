"use client";

import { signOut } from "@/actions/auth";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      style={{ background: "none", border: "1px solid #ccc", padding: "0.3rem 0.75rem", cursor: "pointer", borderRadius: 4 }}
    >
      Salir
    </button>
  );
}
