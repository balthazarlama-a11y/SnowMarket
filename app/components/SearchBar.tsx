"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, Building2 } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigate(path: string) {
    setOpen(false);
    setQuery("");
    router.push(path);
  }

  const trimmed = query.trim();

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar productos o departamentos..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="pl-9 h-9"
        />
      </div>

      {open && trimmed.length > 0 && (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-full rounded-lg border bg-popover p-1.5 shadow-lg">
          <button
            type="button"
            onClick={() => navigate(`/productos?q=${encodeURIComponent(trimmed)}`)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent"
          >
            <ShoppingBag className="size-4 shrink-0 text-primary" />
            <span className="truncate">
              Buscar &ldquo;{trimmed}&rdquo; en <strong>Productos</strong>
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/departamentos?q=${encodeURIComponent(trimmed)}`)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent"
          >
            <Building2 className="size-4 shrink-0 text-primary" />
            <span className="truncate">
              Buscar &ldquo;{trimmed}&rdquo; en <strong>Departamentos</strong>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
