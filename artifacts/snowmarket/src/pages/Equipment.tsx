import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EquipmentCard } from "@/components/EquipmentCard";
import { useListEquipment } from "@workspace/api-client-react";
import { Filter, Search } from "lucide-react";

export function Equipment() {
  const { data: equipment, isLoading } = useListEquipment();
  
  const list = equipment?.length ? equipment : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">Marketplace de Equipos</h1>
              <p className="text-muted-foreground text-lg">Compra y vende de forma segura con nuestra Bodega Verificada.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-xl font-semibold text-foreground hover:bg-secondary transition-colors">
                <Filter className="w-4 h-4" /> Filtros
              </button>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar marcas, modelos..." 
                  className="pl-9 pr-4 py-2 border-2 border-border rounded-xl bg-card focus:outline-none focus:border-primary transition-colors w-full md:w-64"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 snap-x hide-scrollbar">
            {["Todos", "Tablas", "Esquís", "Botas", "Ropa", "Accesorios"].map(cat => (
              <button key={cat} className="snap-start whitespace-nowrap px-4 py-2 rounded-full border border-border bg-card hover:border-primary hover:text-primary transition-colors font-medium text-sm">
                {cat}
              </button>
            ))}
          </div>
          
          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                 <div key={i} className="animate-pulse bg-secondary rounded-2xl h-80"></div>
               ))}
             </div>
          ) : list.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-2">No hay equipos disponibles</h3>
              <p className="text-muted-foreground">Sé el primero en publicar un artículo.</p>
              <button className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors">
                Publicar Equipo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
