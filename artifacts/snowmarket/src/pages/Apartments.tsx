import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApartmentCard } from "@/components/ApartmentCard";
import { useListApartments } from "@workspace/api-client-react";
import { Filter, Search } from "lucide-react";

export function Apartments() {
  const { data: apartments, isLoading } = useListApartments();
  
  // Using dummy data if endpoint is not wired or empty yet
  const list = apartments?.length ? apartments : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">Alojamientos</h1>
              <p className="text-muted-foreground text-lg">Encuentra el lugar perfecto para tu estadía en la nieve.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-xl font-semibold text-foreground hover:bg-secondary transition-colors">
                <Filter className="w-4 h-4" /> Filtros
              </button>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Buscar centro..." 
                  className="pl-9 pr-4 py-2 border-2 border-border rounded-xl bg-card focus:outline-none focus:border-primary transition-colors w-full md:w-64"
                />
              </div>
            </div>
          </div>
          
          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="animate-pulse bg-secondary rounded-3xl h-96"></div>
               ))}
             </div>
          ) : list.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border border-border">
              <h3 className="text-xl font-bold text-foreground mb-2">No hay alojamientos disponibles</h3>
              <p className="text-muted-foreground">Intenta ajustando tus filtros o vuelve más tarde.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {list.map((apt) => (
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
