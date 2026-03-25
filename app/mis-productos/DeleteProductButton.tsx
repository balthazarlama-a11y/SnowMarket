"use client";

import { deleteProduct } from "@/actions/products";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    setLoading(true);
    const result = await deleteProduct(productId);
    setLoading(false);
    if (result.success) {
      toast.success("Producto eliminado");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" data-icon="inline-start" />
      )}
      Eliminar
    </Button>
  );
}
