"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/actions/products";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/validations/product";
import { CATEGORY_LABELS } from "@/lib/constants";

export default function NuevoProductoPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    const form = new FormData(e.currentTarget);

    const result = await createProduct({
      title: form.get("title") as string,
      description: form.get("description") as string,
      price: Number(form.get("price")),
      category: form.get("category") as ProductCategory,
      whatsapp_number: form.get("whatsapp_number") as string,
      images: [],
    });

    setLoading(false);

    if (result.success) {
      router.push("/mis-productos");
    } else {
      setError(result.error);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <main style={{ maxWidth: 500, margin: "2rem auto", padding: "0 2rem" }}>
      <h1>Publicar Producto</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
        <label>
          Titulo
          <input name="title" required minLength={3} style={{ display: "block", width: "100%", padding: "0.4rem" }} />
          {fieldErrors.title && <small style={{ color: "red" }}>{fieldErrors.title[0]}</small>}
        </label>

        <label>
          Descripcion
          <textarea name="description" required rows={4} style={{ display: "block", width: "100%", padding: "0.4rem" }} />
        </label>

        <label>
          Precio (CLP)
          <input name="price" type="number" min={0} step="1" required style={{ display: "block", width: "100%", padding: "0.4rem" }} />
          {fieldErrors.price && <small style={{ color: "red" }}>{fieldErrors.price[0]}</small>}
        </label>

        <label>
          Categoria
          <select name="category" required style={{ display: "block", width: "100%", padding: "0.4rem" }}>
            <option value="">Seleccionar...</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
            ))}
          </select>
        </label>

        <label>
          Tu WhatsApp
          <input name="whatsapp_number" required placeholder="+56 9 1234 5678" style={{ display: "block", width: "100%", padding: "0.4rem" }} />
          {fieldErrors.whatsapp_number && <small style={{ color: "red" }}>{fieldErrors.whatsapp_number[0]}</small>}
        </label>

        <button type="submit" disabled={loading} style={{
          marginTop: "0.5rem", padding: "0.6rem",
          background: loading ? "#ccc" : "#0070f3", color: "white",
          border: "none", borderRadius: 6, cursor: loading ? "default" : "pointer",
        }}>
          {loading ? "Publicando..." : "Publicar Producto"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </main>
  );
}
