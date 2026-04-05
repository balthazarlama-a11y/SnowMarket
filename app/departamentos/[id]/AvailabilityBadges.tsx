"use client";

import { CalendarDays, CheckCircle2, Ban } from "lucide-react";

interface AvailabilityRange {
  id: string;
  available_from: string;
  available_to: string;
  status?: "available" | "blocked";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AvailabilityBadges({
  ranges,
}: {
  ranges: AvailabilityRange[];
}) {
  const today = new Date().toISOString().split("T")[0];
  const active = ranges.filter((r) => r.available_to >= today);

  if (active.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Disponibilidad</h3>
      </div>
      <div className="space-y-1.5">
        {active.map((r) => {
          const isBlocked = r.status === "blocked";
          return (
            <div
              key={r.id}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                isBlocked ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
              }`}
            >
              {isBlocked ? (
                <Ban className="size-3.5 shrink-0" />
              ) : (
                <CheckCircle2 className="size-3.5 shrink-0" />
              )}
              {formatDate(r.available_from)} — {formatDate(r.available_to)}
              <span className="ml-auto text-xs font-medium">
                {isBlocked ? "Bloqueado" : "Disponible"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
