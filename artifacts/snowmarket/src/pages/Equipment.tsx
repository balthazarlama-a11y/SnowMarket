import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EquipmentCard } from "@/components/EquipmentCard";
import { useListEquipment } from "@workspace/api-client-react";
import { Filter, Search } from "lucide-react";

const CATEGORIES = ["Todos", "Tablas", "Esquís", "Botas", "Ropa", "Accesorios"];

export function Equipment() {
  const { data: equipment, isLoading } = useListEquipment();
  const list = equipment?.length ? equipment : [];

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-36 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-[#e8dfce] pb-8 gap-4">
            <div>
              <h1 className="font-display text-5xl text-[#1a3d2b] mb-3">Equipamiento Esencial</h1>
              <p className="text-[#5a5a5a] text-lg font-light">Compra y vende con nuestra Bodega Verificada.</p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-[#e8dfce] text-[#5a5a5a] hover:border-[#1a3d2b] hover:text-[#1a3d2b] transition-colors text-sm">
                <Filter className="w-4 h-4" /> Filtros
              </button>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
                <input
                  type="text"
                  placeholder="Buscar marcas, modelos..."
                  className="pl-9 pr-4 py-2 border border-[#e8dfce] bg-white focus:outline-none focus:border-[#c9882a] transition-colors w-full md:w-56 text-sm text-[#2c2c2c] placeholder:text-[#a0a0a0]"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="shrink-0 px-5 py-2 border border-[#e8dfce] bg-white text-[#5a5a5a] hover:border-[#1a3d2b] hover:text-[#1a3d2b] transition-colors text-sm tracking-wide uppercase first:border-[#1a3d2b] first:text-[#1a3d2b]"
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-[#e8dfce] rounded-xl mb-4" />
                  <div className="h-4 bg-[#e8dfce] rounded w-1/4 mb-3" />
                  <div className="h-5 bg-[#e8dfce] rounded w-3/4 mb-2" />
                  <div className="h-4 bg-[#e8dfce] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-24 border border-[#e8dfce] bg-white rounded-xl">
              <h3 className="font-display text-2xl text-[#1a3d2b] mb-2">No hay equipos disponibles</h3>
              <p className="text-[#5a5a5a] font-light mb-8">Sé el primero en publicar un artículo.</p>
              <button className="px-8 py-3 bg-[#1a3d2b] text-[#f8f5ef] uppercase tracking-widest text-sm hover:bg-[#132c1f] transition-colors">
                Publicar Equipo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {list.map((eq) => (
                <EquipmentCard key={eq.id} equipment={eq} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
