"use client";

import { useState, type FormEvent } from "react";
import { createVerifiedProduct } from "@/actions/admin-products";
import { uploadImages } from "@/actions/upload";
import type { ProductCategory } from "@/lib/validations/product";
import { PRODUCT_CATEGORIES } from "@/lib/validations/product";
import { CATEGORY_LABELS } from "@/lib/constants";

export default function AdminProductsPage() {
  const [status, setStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");
    setFieldErrors({});
    setLoading(true);

    const form = new FormData(e.currentTarget);

    let imageUrls: string[] = [];
    const files = form.getAll("images") as File[];
    const hasFiles = files.some((f) => f.size > 0);

    if (hasFiles) {
      const uploadData = new FormData();
      files.forEach((f) => { if (f.size > 0) uploadData.append("files", f); });
      const uploadResult = await uploadImages(uploadData, "products");
      if (uploadResult.success) {
        imageUrls = uploadResult.data.urls;
      } else {
        setStatus(`Error subiendo imagenes: ${uploadResult.error}`);
        setLoading(false);
        return;
      }
    }

    const result = await createVerifiedProduct({
      title: form.get("title") as string,
      description: form.get("description") as string,
      price: Number(form.get("price")),
      category: form.get("category") as ProductCategory,
      whatsapp_number: form.get("whatsapp_number") as string,
      images: imageUrls,
    });

    setLoading(false);

    if (result.success) {
      setStatus(`Producto verificado creado (ID: ${result.data.id})`);
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus(`Error: ${result.error}`);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 600 }}>
      <h1>Crear Producto Verificado</h1>
      <p style={{ color: "#888", fontSize: "0.9rem" }}>Este producto se marcara como verificado por SnowMarket.</p>
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
          WhatsApp (admin)
          <input name="whatsapp_number" required placeholder="+56 9 1234 5678" style={{ display: "block", width: "100%", padding: "0.4rem" }} />
          {fieldErrors.whatsapp_number && <small style={{ color: "red" }}>{fieldErrors.whatsapp_number[0]}</small>}
        </label>

        <label>
          Imagenes
          <input name="images" type="file" multiple accept="image/*" style={{ display: "block", marginTop: "0.25rem" }} />
        </label>

        <button type="submit" disabled={loading} style={{
          marginTop: "0.5rem", padding: "0.6rem",
          background: loading ? "#ccc" : "#0070f3", color: "white",
          border: "none", borderRadius: 6, cursor: loading ? "default" : "pointer",
        }}>
          {loading ? "Creando..." : "Crear Producto Verificado"}
        </button>
      </form>
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </main>
  );
}
