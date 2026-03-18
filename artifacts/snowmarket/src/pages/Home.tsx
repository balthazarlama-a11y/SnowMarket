import { useState } from "react";
import { Search, MapPin, Calendar, Users, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApartmentCard } from "@/components/ApartmentCard";
import { EquipmentCard } from "@/components/EquipmentCard";
import { useListApartments, useListEquipment } from "@workspace/api-client-react";

export function Home() {
  const [searchTab, setSearchTab] = useState<"apartments" | "equipment">("apartments");

  const { data: apartments, isLoading: isLoadingApts } = useListApartments();
  const { data: equipment, isLoading: isLoadingEq } = useListEquipment();

  // Fallback dummy data in case API returns empty arrays initially
  const displayApartments = apartments?.length ? apartments : DUMMY_APARTMENTS;
  const displayEquipment = equipment?.length ? equipment : DUMMY_EQUIPMENT;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Mountain peaks at sunrise" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 drop-shadow-lg tracking-tight">
            La montaña te espera.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Nosotros te acercamos.</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto mb-12 drop-shadow">
            Alojamientos verificados a pasos de las pistas y el mejor marketplace de equipamiento de nieve.
          </p>

          {/* Search Box Widget */}
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-2 md:p-3 backdrop-blur-xl bg-white/95">
            <div className="flex gap-2 mb-3 px-3 pt-2">
              <button 
                onClick={() => setSearchTab("apartments")}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  searchTab === "apartments" 
                    ? "bg-foreground text-background" 
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                Alojamientos
              </button>
              <button 
                onClick={() => setSearchTab("equipment")}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  searchTab === "equipment" 
                    ? "bg-foreground text-background" 
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                Equipamiento
              </button>
            </div>

            {searchTab === "apartments" ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="flex items-center bg-secondary/50 rounded-2xl p-4 border border-transparent hover:border-border transition-colors">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  <div className="text-left w-full">
                    <div className="text-xs text-muted-foreground font-semibold">Destino</div>
                    <input type="text" placeholder="Ej. Valle Nevado" className="bg-transparent border-none outline-none text-sm font-bold w-full text-foreground placeholder:text-muted-foreground/70" />
                  </div>
                </div>
                <div className="flex items-center bg-secondary/50 rounded-2xl p-4 border border-transparent hover:border-border transition-colors md:col-span-2">
                  <Calendar className="w-5 h-5 text-primary mr-3" />
                  <div className="text-left w-full flex gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground font-semibold">Llegada</div>
                      <div className="text-sm font-bold">Agregar fecha</div>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground font-semibold">Salida</div>
                      <div className="text-sm font-bold">Agregar fecha</div>
                    </div>
                  </div>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl p-4 flex items-center justify-center font-bold gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-95">
                  <Search className="w-5 h-5" />
                  <span>Buscar</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center bg-secondary/50 rounded-2xl p-4 border border-transparent hover:border-border transition-colors">
                  <Search className="w-5 h-5 text-primary mr-3" />
                  <div className="text-left w-full">
                    <input type="text" placeholder="Busca tablas, botas, antiparras..." className="bg-transparent border-none outline-none text-sm font-bold w-full text-foreground placeholder:text-muted-foreground/70" />
                  </div>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-8 py-4 flex items-center justify-center font-bold gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-95">
                  Buscar
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Verified Apartments Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">Departamentos Verificados</h2>
              <p className="text-muted-foreground text-lg">Alojamientos inspeccionados por nuestro equipo. 100% seguros.</p>
            </div>
            <Link href="/apartments" className="hidden md:flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-colors">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingApts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-secondary rounded-3xl h-96"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayApartments.slice(0, 3).map(apt => (
                <ApartmentCard key={apt.id} apartment={apt} />
              ))}
            </div>
          )}
          
          <Link href="/apartments" className="mt-8 flex md:hidden items-center justify-center w-full py-4 rounded-2xl border-2 border-border font-bold text-foreground">
            Ver todos los alojamientos
          </Link>
        </div>
      </section>

      {/* Equipment Marketplace Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-2">Últimos Equipos a la Venta</h2>
              <p className="text-muted-foreground text-lg">Encuentra o vende tu equipo. Aprovecha nuestra compra protegida en Bodega.</p>
            </div>
            <Link href="/equipment" className="hidden md:flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-colors">
              Explorar Market <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingEq ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-secondary rounded-2xl h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayEquipment.slice(0, 4).map(eq => (
                <EquipmentCard key={eq.id} equipment={eq} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-16">¿Por qué elegir Snowmarket?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Verificado</h3>
              <p className="text-muted/80">Revisamos físicamente las propiedades y triangulamos las compras de equipos en nuestra bodega.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Comunidad Confiable</h3>
              <p className="text-muted/80">Solo usuarios verificados. Reseñas reales de esquiadores como tú.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                <Tag className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Las Mejores Tarifas</h3>
              <p className="text-muted/80">Comisión transparente del 5% y trato directo con los dueños para mejores precios.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Dummy data for visual completeness if backend is empty
const DUMMY_APARTMENTS = [
  {
    id: 1,
    title: "Penthouse Ski-in/Ski-out con vista panorámica",
    location: "Edificio Valle de Condores",
    resort: "Valle Nevado",
    pricePerNight: 250000,
    bedrooms: 3,
    maxGuests: 6,
    verified: true,
    rating: 4.9,
    reviewCount: 24,
    imageUrl: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&h=600&fit=crop",
    amenities: ["Ski-in/Ski-out", "Wifi", "Calefacción Central"]
  },
  {
    id: 2,
    title: "Depto Familiar a 5 min del andarivel",
    location: "Sector Base",
    resort: "El Colorado",
    pricePerNight: 180000,
    bedrooms: 2,
    maxGuests: 4,
    verified: true,
    rating: 4.7,
    reviewCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
    amenities: ["Estacionamiento", "Cocina Equipada"]
  },
  {
    id: 3,
    title: "Estudio moderno ideal para parejas",
    location: "Centro La Parva",
    resort: "La Parva",
    pricePerNight: 120000,
    bedrooms: 1,
    maxGuests: 2,
    verified: false,
    rating: 4.5,
    reviewCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    amenities: ["Wifi", "Smart TV"]
  }
] as any;

const DUMMY_EQUIPMENT = [
  {
    id: 1,
    title: "Tabla Snowboard Burton Custom 158",
    category: "Tablas",
    condition: "Usado - Como Nuevo",
    price: 350000,
    seller: "Juan P.",
    verified: true,
    purchaseType: "verified",
    imageUrl: "https://images.unsplash.com/photo-1563299796-1759b81f13f1?w=600&h=600&fit=crop",
    size: "158cm",
    brand: "Burton"
  },
  {
    id: 2,
    title: "Botas Ski Salomon Shift Pro",
    category: "Botas",
    condition: "Nuevo",
    price: 420000,
    seller: "Tienda Andes",
    verified: true,
    purchaseType: "normal",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop",
    size: "27.5",
    brand: "Salomon"
  },
  {
    id: 3,
    title: "Antiparras Oakley Flight Deck",
    category: "Accesorios",
    condition: "Usado - Buen Estado",
    price: 850000,
    seller: "Maria S.",
    verified: false,
    purchaseType: "normal",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop",
    brand: "Oakley"
  },
  {
    id: 4,
    title: "Chaqueta Gore-Tex North Face",
    category: "Ropa",
    condition: "Nuevo",
    price: 290000,
    seller: "Pedro C.",
    verified: true,
    purchaseType: "verified",
    imageUrl: "https://images.unsplash.com/photo-1563299796-1759b81f13f1?w=600&h=600&fit=crop",
    size: "L",
    brand: "The North Face"
  }
] as any;
