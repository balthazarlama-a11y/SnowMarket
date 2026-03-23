import { useState } from "react";
import { Search, MapPin, Calendar, ShieldCheck, Users, Tag, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApartmentCard } from "@/components/ApartmentCard";
import { EquipmentCard } from "@/components/EquipmentCard";
import { useListApartments, useListEquipment } from "@workspace/api-client-react";

export function Home() {
  const [searchTab, setSearchTab] = useState<"apartments" | "equipment">("apartments");

  const { data: apartments } = useListApartments();
  const { data: equipment } = useListEquipment();

  const displayApartments = apartments?.length ? apartments : DUMMY_APARTMENTS as any[];
  const displayEquipment = equipment?.length ? equipment : DUMMY_EQUIPMENT as any[];

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#2c2c2c]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-40 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Montaña nevada"
            className="w-full h-full object-cover"
            style={{ filter: "sepia(30%) saturate(70%) brightness(0.9)" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1600";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d2b]/80 via-[#2c2a20]/60 to-[#f8f5ef]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center w-full mt-10">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-[#f8f5ef] mb-6 leading-[1.1] drop-shadow-lg">
            La montaña,{" "}
            <br className="hidden md:block" />
            <span className="italic text-[#c9882a]">reinventada.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#e8dfce] max-w-2xl mx-auto mb-16 font-light tracking-wide drop-shadow-md">
            Una colección curada de refugios alpinos y el equipamiento esencial para tu próxima expedición.
          </p>

          {/* Search Widget */}
          <div className="max-w-4xl mx-auto bg-[#f8f5ef] rounded-xl shadow-[0_20px_40px_rgba(26,61,43,0.15)] p-3 md:p-4 border border-[#e8dfce]">
            <div className="flex gap-4 mb-4 px-4 pt-2 justify-center md:justify-start">
              <button
                onClick={() => setSearchTab("apartments")}
                className={`px-2 py-1 text-sm tracking-widest uppercase transition-all duration-300 border-b-2 ${
                  searchTab === "apartments"
                    ? "border-[#c9882a] text-[#1a3d2b] font-bold"
                    : "border-transparent text-[#8a8a8a] hover:text-[#1a3d2b]"
                }`}
              >
                Refugios
              </button>
              <button
                onClick={() => setSearchTab("equipment")}
                className={`px-2 py-1 text-sm tracking-widest uppercase transition-all duration-300 border-b-2 ${
                  searchTab === "equipment"
                    ? "border-[#c9882a] text-[#1a3d2b] font-bold"
                    : "border-transparent text-[#8a8a8a] hover:text-[#1a3d2b]"
                }`}
              >
                Equipamiento
              </button>
            </div>

            {searchTab === "apartments" ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="flex items-center bg-white rounded p-4 border border-[#e8dfce]">
                  <MapPin className="w-5 h-5 text-[#c9882a] mr-3 shrink-0" />
                  <div className="text-left w-full">
                    <div className="text-xs text-[#8a8a8a] uppercase tracking-wider mb-1">Destino</div>
                    <input
                      type="text"
                      placeholder="Ej. Valle Nevado"
                      className="bg-transparent border-none outline-none text-sm text-[#1a3d2b] placeholder:text-[#a0a0a0] w-full"
                    />
                  </div>
                </div>
                <div className="flex items-center bg-white rounded p-4 border border-[#e8dfce] md:col-span-2">
                  <Calendar className="w-5 h-5 text-[#c9882a] mr-3 shrink-0" />
                  <div className="text-left w-full flex gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-[#8a8a8a] uppercase tracking-wider mb-1">Llegada</div>
                      <div className="text-sm text-[#1a3d2b] opacity-60">Seleccionar</div>
                    </div>
                    <div className="w-px h-8 bg-[#e8dfce]" />
                    <div className="flex-1">
                      <div className="text-xs text-[#8a8a8a] uppercase tracking-wider mb-1">Salida</div>
                      <div className="text-sm text-[#1a3d2b] opacity-60">Seleccionar</div>
                    </div>
                  </div>
                </div>
                <button className="bg-[#1a3d2b] hover:bg-[#132c1f] text-[#f8f5ef] rounded p-4 flex items-center justify-center gap-2 transition-colors">
                  <Search className="w-4 h-4" />
                  <span className="tracking-wide text-sm">Explorar</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center bg-white rounded p-4 border border-[#e8dfce]">
                  <Search className="w-5 h-5 text-[#c9882a] mr-3 shrink-0" />
                  <input
                    type="text"
                    placeholder="Busca tablas, botas, antiparras..."
                    className="bg-transparent border-none outline-none text-sm text-[#1a3d2b] placeholder:text-[#a0a0a0] w-full"
                  />
                </div>
                <button className="bg-[#1a3d2b] hover:bg-[#132c1f] text-[#f8f5ef] rounded px-10 py-4 flex items-center justify-center gap-2 transition-colors">
                  <span className="tracking-wide text-sm">Buscar Equipo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Apartments */}
      <section className="py-24 bg-[#f8f5ef]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#e8dfce] pb-8">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl text-[#1a3d2b] mb-4">La Colección</h2>
              <p className="text-[#5a5a5a] text-lg leading-relaxed">
                Refugios inspeccionados rigurosamente por nuestro equipo. Espacios que invitan al descanso después de la tormenta.
              </p>
            </div>
            <a
              href="/apartments"
              className="hidden md:flex items-center gap-2 text-[#c9882a] hover:text-[#a66e1d] transition-colors uppercase tracking-widest text-xs font-bold mt-6 md:mt-0"
            >
              Ver el catálogo <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayApartments.slice(0, 3).map((apt: any) => (
              <ApartmentCard key={apt.id} apartment={apt} />
            ))}
          </div>

          <a
            href="/apartments"
            className="mt-12 flex md:hidden items-center justify-center w-full py-4 border border-[#1a3d2b] text-[#1a3d2b] uppercase tracking-widest text-sm"
          >
            Ver el catálogo
          </a>
        </div>
      </section>

      {/* Equipment */}
      <section className="py-24 bg-white border-y border-[#e8dfce]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl text-[#1a3d2b] mb-4">Equipamiento Esencial</h2>
            <p className="text-[#5a5a5a] text-lg leading-relaxed">
              Herramientas probadas para la montaña. Compra y venta entre entusiastas con nuestra garantía de autenticidad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayEquipment.slice(0, 4).map((eq: any) => (
              <EquipmentCard key={eq.id} equipment={eq} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href="/equipment"
              className="inline-flex items-center gap-3 text-[#1a3d2b] border-b border-[#1a3d2b] pb-1 uppercase tracking-widest text-xs font-bold hover:text-[#c9882a] hover:border-[#c9882a] transition-all"
            >
              Explorar el bazar <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Trust / Philosophy */}
      <section className="py-32 bg-[#1a3d2b] text-[#f8f5ef] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#132c1f] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-6xl mb-8 leading-[1.1]">
                Nuestra <br />
                <i className="text-[#c9882a]">filosofía.</i>
              </h2>
              <p className="text-lg text-[#e8dfce] mb-8 font-light leading-relaxed max-w-md">
                Creemos en la elegancia de lo simple y en el valor de la confianza. Snowmarket no es solo una plataforma, es un refugio para los puristas de la montaña.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="border-l border-[#c9882a]/30 pl-6">
                <ShieldCheck className="w-8 h-8 text-[#c9882a] mb-4" />
                <h3 className="font-display text-xl mb-3">Rigurosa Selección</h3>
                <p className="text-[#a0a0a0] font-light leading-relaxed text-sm">
                  Inspeccionamos físicamente las propiedades y curamos el inventario. La calidad precede a la cantidad.
                </p>
              </div>

              <div className="border-l border-[#c9882a]/30 pl-6">
                <Users className="w-8 h-8 text-[#c9882a] mb-4" />
                <h3 className="font-display text-xl mb-3">Círculo Íntimo</h3>
                <p className="text-[#a0a0a0] font-light leading-relaxed text-sm">
                  Una comunidad de entusiastas que comparten el respeto por el entorno alpino y el equipo bien cuidado.
                </p>
              </div>

              <div className="border-l border-[#c9882a]/30 pl-6 md:col-span-2">
                <Tag className="w-8 h-8 text-[#c9882a] mb-4" />
                <h3 className="font-display text-xl mb-3">Trato Justo</h3>
                <p className="text-[#a0a0a0] font-light leading-relaxed text-sm max-w-md">
                  Transparencia absoluta. Facilitamos la conexión directa, protegiendo ambas partes sin intermediarios innecesarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const DUMMY_APARTMENTS = [
  { id: 1, title: "Chalet de Madera con Vista Panorámica", resort: "Valle Nevado", location: "Sector Alto", pricePerNight: 350000, bedrooms: 4, maxGuests: 8, verified: true, rating: 4.9, reviewCount: 12, imageUrl: "https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=800" },
  { id: 2, title: "Refugio Íntimo entre los Bosques", resort: "Chillán", location: "Villa Nevados", pricePerNight: 190000, bedrooms: 2, maxGuests: 4, verified: true, rating: 4.8, reviewCount: 28, imageUrl: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800" },
  { id: 3, title: "Loft Minimalista Frente a las Pistas", resort: "La Parva", location: "Centro", pricePerNight: 210000, bedrooms: 1, maxGuests: 2, verified: false, rating: 4.6, reviewCount: 15, imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800" },
];

const DUMMY_EQUIPMENT = [
  { id: 1, title: "Burton Family Tree Hometown Hero", category: "Tablas", brand: "Burton", condition: "Como Nuevo", price: 450000, purchaseType: "verified_warehouse", imageUrl: "https://images.unsplash.com/photo-1563299796-1759b81f13f1?w=600" },
  { id: 2, title: "Casco POC Auric Cut Backcountry SPIN", category: "Protección", brand: "POC", condition: "Nuevo con etiquetas", price: 180000, purchaseType: "normal", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600" },
  { id: 3, title: "Botas Ski Salomon Shift Pro", category: "Botas", brand: "Salomon", condition: "Usado - Buen Estado", price: 320000, purchaseType: "verified_warehouse", imageUrl: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=600" },
  { id: 4, title: "Chaqueta Gore-Tex Arc'teryx Rush", category: "Ropa", brand: "Arc'teryx", condition: "Nuevo", price: 580000, purchaseType: "normal", imageUrl: "https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?w=600" },
];
