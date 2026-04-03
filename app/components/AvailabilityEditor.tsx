"use client";

import { useState } from "react";
import {
  addAvailabilityRange,
  deleteAvailabilityRange,
  type AvailabilityRange,
} from "@/actions/availability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AvailabilityEditorProps {
  propertyId: string;
  initialRanges: AvailabilityRange[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AvailabilityEditor({
  propertyId,
  initialRanges,
}: AvailabilityEditorProps) {
  const [ranges, setRanges] = useState<AvailabilityRange[]>(initialRanges);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd() {
    if (!from || !to) {
      toast.error("Selecciona ambas fechas");
      return;
    }
    if (to <= from) {
      toast.error("La fecha de fin debe ser posterior a la de inicio");
      return;
    }
    setAdding(true);
    const result = await addAvailabilityRange({
      property_id: propertyId,
      available_from: from,
      available_to: to,
    });
    setAdding(false);
    if (result.success) {
      setRanges((prev) => [
        ...prev,
        {
          id: result.data.id,
          property_id: propertyId,
          available_from: from,
          available_to: to,
        },
      ]);
      setFrom("");
      setTo("");
      toast.success("Rango de disponibilidad agregado");
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteAvailabilityRange(id);
    setDeletingId(null);
    if (result.success) {
      setRanges((prev) => prev.filter((r) => r.id !== id));
      toast.success("Rango eliminado");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Disponibilidad para arriendo</h3>
      </div>

      {ranges.length > 0 && (
        <div className="space-y-1.5">
          {ranges.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-lg border bg-green-50 px-3 py-2 text-sm"
            >
              <span className="text-green-800">
                {formatDate(r.available_from)} — {formatDate(r.available_to)}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                disabled={deletingId === r.id}
                className="text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
              >
                {deletingId === r.id ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Trash2 className="size-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {ranges.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Sin rangos de disponibilidad definidos.
        </p>
      )}

      <div className="flex flex-col gap-2 rounded-lg border border-dashed p-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Desde</Label>
          <Input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Hasta</Label>
          <Input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            min={from || undefined}
            className="h-8 text-xs"
          />
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleAdd}
          disabled={adding || !from || !to}
          className="gap-1"
        >
          {adding ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Plus className="size-3.5" />
          )}
          Agregar
        </Button>
      </div>
    </div>
  );
}
