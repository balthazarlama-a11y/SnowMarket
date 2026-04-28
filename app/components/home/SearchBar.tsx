"use client";

import { Search, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/productos${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center rounded-2xl bg-white shadow-xl shadow-black/5 border border-slate-200/80 overflow-hidden"
    >
      <div className="flex flex-1 items-center gap-2 px-4 py-3">
        <Search className="size-5 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="¿Qué necesitas?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          aria-label="Buscar equipos"
        />
      </div>

      <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 px-4 py-3">
        <Calendar className="size-4 text-slate-400" />
        <span className="text-sm text-slate-400">Fechas</span>
      </div>

      <button
        type="submit"
        className="shrink-0 bg-[#e8622c] hover:bg-[#d4561f] text-white font-semibold px-6 py-3 min-h-[44px] min-w-[44px] text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8622c]"
      >
        Buscar
      </button>
    </form>
  );
}
