"use client";

import { deleteProduct } from "@/actions/products";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Eliminar este producto?")) return;
    const result = await deleteProduct(productId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error);
    }
  }

  return (
    <button
      onClick={handleDelete}
      style={{ background: "none", border: "1px solid #e55", color: "#e55", padding: "0.3rem 0.6rem", borderRadius: 4, cursor: "pointer", fontSize: "0.85rem" }}
    >
      Eliminar
    </button>
  );
}
