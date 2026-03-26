"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminDeleteProduct } from "@/actions/admin-products";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AdminDeleteButtonProps {
  productId: string;
  productTitle: string;
}

export function AdminDeleteButton({
  productId,
  productTitle,
}: AdminDeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await adminDeleteProduct(productId);
    setLoading(false);

    if (result.success) {
      toast.success("Producto eliminado correctamente");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" size="sm">
            <Trash2 className="size-3.5" data-icon="inline-start" />
            Eliminar
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar publicación</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar <strong>&ldquo;{productTitle}&rdquo;</strong>. Esta
            acción es irreversible: se borrarán el producto y sus imágenes del
            sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" data-icon="inline-start" />
            )}
            {loading ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
