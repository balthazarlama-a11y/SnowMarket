"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, MapPin, CalendarDays } from "lucide-react";

const DESTINATIONS = [
  { value: "", label: "Valle Nevado, La Parva, El Colorado..." },
  { value: "Valle Nevado", label: "Valle Nevado" },
  { value: "La Parva", label: "La Parva" },
  { value: "El Colorado", label: "El Colorado" },
  { value: "Farellones", label: "Farellones" },
];

export function HeroSearchForm() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("location", destination);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    const qs = params.toString();
    router.push(`/departamentos${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex w-full max-w-3xl flex-col gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-md sm:flex-row sm:items-end sm:gap-2 sm:rounded-full sm:p-2"
    >
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="h-10 w-full rounded-lg bg-white/10 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/40 sm:rounded-full"
        >
          {DESTINATIONS.map((d) => (
            <option key={d.value} value={d.value} className="text-slate-900">
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div className="relative flex-1">
        <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          aria-label="Check-in"
          className="h-10 w-full rounded-lg bg-white/10 pl-9 pr-3 text-sm text-white outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-90 sm:rounded-full"
        />
        {!dateFrom && (
          <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-sm text-white/65">
            Check-in
          </span>
        )}
      </div>

      <div className="relative flex-1">
        <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          aria-label="Check-out"
          min={dateFrom || undefined}
          className="h-10 w-full rounded-lg bg-white/10 pl-9 pr-3 text-sm text-white outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-90 sm:rounded-full"
        />
        {!dateTo && (
          <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-sm text-white/65">
            Check-out
          </span>
        )}
      </div>

      <Button
        type="submit"
        size="default"
        className="h-10 gap-1.5 rounded-lg bg-white text-slate-900 hover:bg-white/90 sm:rounded-full sm:px-6"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Buscar departamento</span>
        <span className="sm:hidden">Buscar departamento</span>
      </Button>
    </form>
  );
}
