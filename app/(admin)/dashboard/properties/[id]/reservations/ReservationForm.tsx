"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReservation } from "@/actions/reservations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

interface ReservationFormProps {
  propertyId: string;
}

export function ReservationForm({ propertyId }: ReservationFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);

    const result = await createReservation({
      property_id: propertyId,
      start_date: form.get("start_date") as string,
      end_date: form.get("end_date") as string,
      guest_name: (form.get("guest_name") as string) || undefined,
      notes: (form.get("notes") as string) || undefined,
    });

    setLoading(false);

    if (result.success) {
      toast.success("Reserva creada");
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">Check-in</Label>
          <Input id="start_date" name="start_date" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">Check-out</Label>
          <Input id="end_date" name="end_date" type="date" required />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="guest_name">Nombre huésped (opcional)</Label>
          <Input id="guest_name" name="guest_name" placeholder="Juan Pérez" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Input id="notes" name="notes" placeholder="Bloqueo por mantención..." />
        </div>
      </div>
      <Button disabled={loading} type="submit" className="gap-1.5">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
        {loading ? "Creando..." : "Crear Reserva"}
      </Button>
    </form>
  );
}
