import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApartmentCard } from "@/components/ApartmentCard";
import { useListApartments } from "@workspace/api-client-react";
import { Search, X } from "lucide-react";

const RESORTS = ["Todos", "Valle Nevado", "La Parva", "El Colorado", "Chillán", "Portillo"];

export function Apartments() {
  const { data: apartments, isLoading } = useListApartments();
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialQ = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [selectedResort, setSelectedResort] = useState("Todos");

  useEffect(() => {
    setQuery(initialQ);
  }, [initialQ]);

  const all = apartments?.length ? apartments : [];

  const filtered = all.filter((apt) => {
    const matchesQuery =
      !query ||
      apt.title.toLowerCase().includes(query.toLowerCase()) ||
      apt.resort.toLowerCase().includes(query.toLowerCase()) ||
      (apt.location ?? "").toLowerCase().includes(query.toLowerCase());
    const matchesResort =
      selectedResort === "Todos" || apt.resort === selectedResort;
    return matchesQuery && matchesResort;
  });

  return (
    <div className="min-h-screen bg-[#f4f8fc] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-36 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="mb-12 border-b border-[#d8e8f4] pb-8">
            <h1 className="font-display text-5xl text-[#0d2137] mb-3">La Colección</h1>
            <p className="text-[#3f5d75] text-lg font-light">
              Refugios alpinos inspeccionados. Calidad antes que cantidad.
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6e8fa6]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o centro de ski..."
                className="w-full pl-10 pr-10 py-3 border border-[#d8e8f4] bg-white focus:outline-none focus:border-[#3b9fd6] transition-colors text-sm text-[#0d2137] placeholder:text-[#89a8bc]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e8fa6] hover:text-[#0d2137] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Resort chips */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-10">
            {RESORTS.map((resort) => (
              <button
                key={resort}
                onClick={() => setSelectedResort(resort)}
                className={`shrink-0 px-5 py-2 text-sm tracking-wide uppercase transition-colors border ${
                  selectedResort === resort
                    ? "bg-[#0d2137] text-[#f4f8fc] border-[#0d2137]"
                    : "bg-white text-[#3f5d75] border-[#d8e8f4] hover:border-[#0d2137] hover:text-[#0d2137]"
                }`}
              >
                {resort}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!isLoading && all.length > 0 && (
            <p className="text-sm text-[#6e8fa6] mb-8 uppercase tracking-widest">
              {filtered.length} {filtered.length === 1 ? "refugio" : "refugios"} encontrados
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] bg-[#d8e8f4] rounded-xl mb-6" />
                  <div className="h-3 bg-[#d8e8f4] rounded w-1/3 mb-3" />
                  <div className="h-5 bg-[#d8e8f4] rounded w-3/4 mb-3" />
                  <div className="h-3 bg-[#d8e8f4] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 border border-[#d8e8f4] bg-white rounded-xl">
              <h3 className="font-display text-2xl text-[#0d2137] mb-2">Sin resultados</h3>
              <p className="text-[#3f5d75] font-light mb-6">
                No encontramos refugios que coincidan con tu búsqueda.
              </p>
              <button
                onClick={() => { setQuery(""); setSelectedResort("Todos"); }}
                className="px-8 py-3 border border-[#0d2137] text-[#0d2137] uppercase tracking-widest text-sm hover:bg-[#0d2137] hover:text-[#f4f8fc] transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((apt) => (
                <ApartmentCard key={apt.id} apartment={apt} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
