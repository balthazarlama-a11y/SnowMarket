"use client";

import { useMemo, useState } from "react";
import {
  addAvailabilityRange,
  deleteAvailabilityRange,
  type AvailabilityRange,
  type AvailabilityStatus,
} from "@/actions/availability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarDays,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { es } from "react-day-picker/locale";
import { eachDayOfInterval, parseISO } from "date-fns";

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

const STATUS_LABELS: Record<AvailabilityStatus, string> = {
  available: "Disponible",
  blocked: "Bloqueado",
};

export function AvailabilityEditor({
  propertyId,
  initialRanges,
}: AvailabilityEditorProps) {
  const [ranges, setRanges] = useState<AvailabilityRange[]>(initialRanges);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState<AvailabilityStatus>("available");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Build day sets for calendar modifiers
  const { availableDays, blockedDays } = useMemo(() => {
    const avail: Date[] = [];
    const block: Date[] = [];
    for (const r of ranges) {
      const start = parseISO(r.available_from);
      const end = parseISO(r.available_to);
      if (start >= end) continue;
      // end date is exclusive — subtract one day for the interval
      const adjustedEnd = new Date(end);
      adjustedEnd.setDate(adjustedEnd.getDate() - 1);
      if (adjustedEnd < start) continue;
      const days = eachDayOfInterval({ start, end: adjustedEnd });
      if ((r.status ?? "available") === "available") {
        avail.push(...days);
      } else {
        block.push(...days);
      }
    }
    return { availableDays: avail, blockedDays: block };
  }, [ranges]);

  async function handleAdd() {
    if (!from || !to) {
      toast.error("Selecciona ambas fechas");
      return;
    }
    if (to <= from) {
      toast.error("La fecha de fin debe ser posterior a la de inicio");
      return;
    }

    // Client-side overlap check
    const overlap = ranges.find(
      (r) => r.available_from < to && r.available_to > from
    );
    if (overlap) {
      toast.error(
        `Este rango se superpone con ${formatDate(overlap.available_from)} — ${formatDate(overlap.available_to)}`
      );
      return;
    }

    setAdding(true);
    const result = await addAvailabilityRange({
      property_id: propertyId,
      available_from: from,
      available_to: to,
      status,
    });
    setAdding(false);
    if (result.success) {
      setRanges((prev) =>
        [
          ...prev,
          {
            id: result.data.id,
            property_id: propertyId,
            available_from: from,
            available_to: to,
            status,
          },
        ].sort((a, b) => a.available_from.localeCompare(b.available_from))
      );
      setFrom("");
      setTo("");
      toast.success("Rango agregado");
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Disponibilidad para arriendo</h3>
      </div>

      {/* Calendar visualization */}
      <div className="flex justify-center rounded-lg border bg-card p-3">
        <Calendar
          mode="multiple"
          selected={[...availableDays, ...blockedDays]}
          locale={es}
          numberOfMonths={2}
          disabled={{ before: new Date() }}
          modifiers={{
            available: availableDays,
            blocked: blockedDays,
          }}
          modifiersClassNames={{
            available:
              "[&>button]:bg-green-100 [&>button]:text-green-800 [&>button]:hover:bg-green-200",
            blocked:
              "[&>button]:bg-red-100 [&>button]:text-red-800 [&>button]:line-through [&>button]:hover:bg-red-200",
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded bg-green-100 ring-1 ring-green-300" />
          Disponible
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block size-3 rounded bg-red-100 ring-1 ring-red-300" />
          Bloqueado
        </span>
      </div>

      {/* Ranges table */}
      {ranges.length > 0 && (
        <div className="space-y-1.5">
          {ranges.map((r) => (
            <div
              key={r.id}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                (r.status ?? "available") === "blocked"
                  ? "bg-red-50 text-red-800"
                  : "bg-green-50 text-green-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {(r.status ?? "available") === "blocked" ? (
                  <Ban className="size-3.5" />
                ) : (
                  <CheckCircle2 className="size-3.5" />
                )}
                <span>
                  {formatDate(r.available_from)} — {formatDate(r.available_to)}
                </span>
                <span className="rounded bg-white/60 px-1.5 py-0.5 text-xs font-medium">
                  {STATUS_LABELS[r.status ?? "available"]}
                </span>
              </div>
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

      {/* Add range form */}
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
        <div className="flex-1 space-y-1">
          <Label className="text-xs">Estado</Label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AvailabilityStatus)}
            className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
          >
            <option value="available">Disponible</option>
            <option value="blocked">Bloqueado</option>
          </select>
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
