"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteReservation } from "@/actions/reservations";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DeleteReservationButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteReservation(id);
    setLoading(false);

    if (result.success) {
      toast.success("Reserva eliminada");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleDelete} disabled={loading}>
      {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5 text-destructive" />}
    </Button>
  );
}
