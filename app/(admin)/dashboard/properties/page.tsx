"use client";

import { useState, type FormEvent } from "react";
import { createProperty } from "@/actions/properties";
import { uploadImages } from "@/actions/upload";

export default function AdminPropertiesPage() {
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
      const uploadResult = await uploadImages(uploadData, "properties");
      if (uploadResult.success) {
        imageUrls = uploadResult.data.urls;
      } else {
        setStatus(`Error subiendo imagenes: ${uploadResult.error}`);
        setLoading(false);
        return;
      }
    }

    const result = await createProperty({
      title: form.get("title") as string,
      description: form.get("description") as string,
      price: Number(form.get("price")),
      location: form.get("location") as string,
      whatsapp_contact: form.get("whatsapp_contact") as string,
      images: imageUrls,
    });

    setLoading(false);

    if (result.success) {
      setStatus(`Propiedad creada (ID: ${result.data.id})`);
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus(`Error: ${result.error}`);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 600 }}>
      <h1>Crear Propiedad (Departamento)</h1>
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
          Precio arriendo (CLP/noche)
          <input name="price" type="number" min={0} step="1" required style={{ display: "block", width: "100%", padding: "0.4rem" }} />
        </label>

        <label>
          Ubicacion
          <input name="location" required placeholder="Valle Nevado, Chile" style={{ display: "block", width: "100%", padding: "0.4rem" }} />
        </label>

        <label>
          WhatsApp contacto (admin)
          <input name="whatsapp_contact" required placeholder="+56 9 1234 5678" style={{ display: "block", width: "100%", padding: "0.4rem" }} />
          {fieldErrors.whatsapp_contact && <small style={{ color: "red" }}>{fieldErrors.whatsapp_contact[0]}</small>}
        </label>

        <label>
          Imagenes
          <input name="images" type="file" multiple accept="image/*" style={{ display: "block", marginTop: "0.25rem" }} />
        </label>

        <button type="submit" disabled={loading} style={{
          marginTop: "0.5rem", padding: "0.6rem",
          background: loading ? "#ccc" : "#333", color: "white",
          border: "none", borderRadius: 6, cursor: loading ? "default" : "pointer",
        }}>
          {loading ? "Creando..." : "Crear Propiedad"}
        </button>
      </form>
      {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
    </main>
  );
}
