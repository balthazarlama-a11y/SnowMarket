import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, ShieldCheck, Users, BedDouble, Calendar, Tag, ArrowRight, Package, Menu, X } from "lucide-react";
import { useListApartments, useListEquipment } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";

export function AlpineLodgePage() {
  const [searchTab, setSearchTab] = useState<"apartments" | "equipment">("apartments");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: apartments } = useListApartments();
  const { data: equipment } = useListEquipment();

  const displayApartments = apartments?.length ? apartments : DUMMY_APARTMENTS;
  const displayEquipment = equipment?.length ? equipment : DUMMY_EQUIPMENT;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#2c2c2c] selection:bg-[#c9882a] selection:text-white pb-20" style={{ fontFamily: "Georgia, serif" }}>
      <style>{`
        .font-playfair { font-family: 'Playfair Display', serif; }
      `}</style>

      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "bg-[#f8f5ef]/95 backdrop-blur-md border-[#e8dfce] shadow-[0_4px_20px_rgba(26,61,43,0.05)] py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 rounded bg-[#1a3d2b] flex items-center justify-center shadow-md shadow-[#1a3d2b]/20">
                <Package className="w-5 h-5 text-[#f8f5ef]" />
              </div>
              <span className={`font-playfair font-bold text-2xl tracking-tight transition-colors duration-300 ${isScrolled ? "text-[#1a3d2b]" : "text-[#f8f5ef]"}`}>
                Snowmarket
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              {["Alojamientos", "Equipamiento", "Experiencias"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`text-sm tracking-wide transition-colors duration-300 ${
                    isScrolled ? "text-[#5a5a5a] hover:text-[#c9882a]" : "text-[#f8f5ef]/80 hover:text-white"
                  }`}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-6">
              <button className={`text-sm transition-colors duration-300 ${isScrolled ? "text-[#1a3d2b]" : "text-white"} hover:text-[#c9882a]`}>
                Ingresar
              </button>
              <button className="px-6 py-2.5 bg-[#1a3d2b] text-[#f8f5ef] text-sm tracking-wide shadow-lg shadow-[#1a3d2b]/20 hover:bg-[#132c1f] transition-all duration-300 border border-[#1a3d2b]">
                Publicar
              </button>
            </div>

            <button
              className={`md:hidden p-2 ${isScrolled ? "text-[#1a3d2b]" : "text-white"}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#f8f5ef] border-b border-[#e8dfce] p-6 flex flex-col gap-6 shadow-2xl">
            {["Alojamientos", "Equipamiento", "Experiencias"].map((item) => (
              <a
                key={item}
                href="#"
                className="font-playfair text-xl text-[#1a3d2b] py-2 border-b border-[#e8dfce]/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-4 mt-4">
              <button className="px-6 py-3 w-full border border-[#1a3d2b] text-[#1a3d2b] font-playfair text-lg">
                Ingresar
              </button>
              <button className="px-6 py-3 w-full bg-[#1a3d2b] text-[#f8f5ef] font-playfair text-lg">
                Publicar
              </button>
            </div>
          </div>
        )}
      </header>

      <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-40 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1600"
            alt="Mountain Lodge"
            className="w-full h-full object-cover"
            style={{ filter: "sepia(30%) saturate(70%) brightness(0.9)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d2b]/80 via-[#2c2a20]/60 to-[#f8f5ef]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center w-full mt-10">
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl text-[#f8f5ef] mb-6 leading-[1.1] drop-shadow-lg">
            La montaña, <br className="hidden md:block" />
            <span className="italic text-[#c9882a]">reinventada.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#e8dfce] max-w-2xl mx-auto mb-16 font-light tracking-wide drop-shadow-md">
            Una colección curada de refugios alpinos y el equipamiento esencial para tu próxima expedición.
          </p>

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
                  <MapPin className="w-5 h-5 text-[#c9882a] mr-3" />
                  <div className="text-left w-full">
                    <div className="text-xs text-[#8a8a8a] uppercase tracking-wider mb-1">Destino</div>
                    <input type="text" placeholder="Ej. Valle Nevado" className="bg-transparent border-none outline-none text-sm text-[#1a3d2b] placeholder:text-[#a0a0a0] w-full" />
                  </div>
                </div>
                <div className="flex items-center bg-white rounded p-4 border border-[#e8dfce] md:col-span-2">
                  <Calendar className="w-5 h-5 text-[#c9882a] mr-3" />
                  <div className="text-left w-full flex gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-[#8a8a8a] uppercase tracking-wider mb-1">Llegada</div>
                      <div className="text-sm text-[#1a3d2b] opacity-60">Seleccionar</div>
                    </div>
                    <div className="w-px h-8 bg-[#e8dfce]"></div>
                    <div className="flex-1">
                      <div className="text-xs text-[#8a8a8a] uppercase tracking-wider mb-1">Salida</div>
                      <div className="text-sm text-[#1a3d2b] opacity-60">Seleccionar</div>
                    </div>
                  </div>
                </div>
                <button className="bg-[#1a3d2b] hover:bg-[#132c1f] text-[#f8f5ef] rounded p-4 flex items-center justify-center gap-2 transition-colors border border-[#1a3d2b]">
                  <Search className="w-4 h-4" />
                  <span className="tracking-wide text-sm">Explorar</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center bg-white rounded p-4 border border-[#e8dfce]">
                  <Search className="w-5 h-5 text-[#c9882a] mr-3" />
                  <input type="text" placeholder="Busca tablas, botas, antiparras..." className="bg-transparent border-none outline-none text-sm text-[#1a3d2b] placeholder:text-[#a0a0a0] w-full" />
                </div>
                <button className="bg-[#1a3d2b] hover:bg-[#132c1f] text-[#f8f5ef] rounded px-10 py-4 flex items-center justify-center gap-2 transition-colors border border-[#1a3d2b]">
                  <span className="tracking-wide text-sm">Buscar Equipo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#f8f5ef]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#e8dfce] pb-8">
            <div className="max-w-2xl">
              <h2 className="font-playfair text-4xl text-[#1a3d2b] mb-4">La Colección</h2>
              <p className="text-[#5a5a5a] text-lg leading-relaxed">
                Refugios inspeccionados rigurosamente por nuestro equipo. Espacios que invitan al descanso después de la tormenta.
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-[#c9882a] hover:text-[#a66e1d] transition-colors uppercase tracking-widest text-xs font-bold mt-6 md:mt-0">
              Ver el catálogo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayApartments.slice(0, 3).map((apt) => (
              <div key={apt.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6 shadow-md shadow-[#1a3d2b]/5">
                  <img
                    src={apt.imageUrl ?? "https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=800"}
                    alt={apt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    style={{ filter: "contrast(0.95) saturate(0.85)" }}
                  />
                  {apt.verified && (
                    <div className="absolute top-4 left-4 bg-[#1a3d2b] text-[#f8f5ef] px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider font-semibold">Selección</span>
                    </div>
                  )}
                </div>

                <div className="px-2">
                  <div className="flex items-center gap-2 text-[#c9882a] text-xs uppercase tracking-widest mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {apt.resort}
                  </div>

                  <h3 className="font-playfair text-2xl text-[#1a3d2b] mb-3 leading-snug group-hover:text-[#c9882a] transition-colors">
                    {apt.title}
                  </h3>

                  <div className="flex items-center gap-4 text-sm text-[#8a8a8a] mb-5 font-light">
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4" />
                      {apt.bedrooms} Hab.
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      Hasta {apt.maxGuests} pers.
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-[#e8dfce]">
                    <div className="font-playfair text-xl text-[#1a3d2b]">
                      {formatCurrency(apt.pricePerNight)} <span className="text-sm font-sans text-[#8a8a8a] italic">/ noche</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#c9882a]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{Number(apt.rating).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-12 flex md:hidden items-center justify-center w-full py-4 border border-[#1a3d2b] text-[#1a3d2b] uppercase tracking-widest text-sm">
            Ver el catálogo
          </button>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-[#e8dfce]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-playfair text-4xl text-[#1a3d2b] mb-4">Equipamiento Esencial</h2>
            <p className="text-[#5a5a5a] text-lg leading-relaxed">
              Herramientas probadas para la montaña. Compra y venta entre entusiastas con nuestra garantía de autenticidad.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayEquipment.slice(0, 4).map((eq) => (
              <div key={eq.id} className="group border border-[#e8dfce] bg-[#f8f5ef]/50 rounded-xl overflow-hidden hover:shadow-[0_10px_30px_rgba(26,61,43,0.08)] transition-all duration-500">
                <div className="relative aspect-square overflow-hidden bg-white p-6 border-b border-[#e8dfce]">
                  <img
                    src={eq.imageUrl ?? "https://images.unsplash.com/photo-1563299796-1759b81f13f1?w=600"}
                    alt={eq.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
                  />
                  {eq.purchaseType === "verified_warehouse" && (
                    <div className="absolute top-3 left-3 bg-[#c9882a] text-white p-1.5 rounded-full shadow-md" title="Compra protegida">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-[10px] uppercase tracking-widest text-[#8a8a8a] mb-2">{eq.category}</div>
                  <h3 className="font-playfair text-lg text-[#1a3d2b] mb-4 line-clamp-2 leading-snug">
                    {eq.title}
                  </h3>
                  <div className="text-sm text-[#5a5a5a] mb-4 pb-4 border-b border-[#e8dfce]/60">
                    <span className="italic">{eq.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-playfair text-lg text-[#1a3d2b]">
                      {formatCurrency(eq.price)}
                    </div>
                    <button className="text-[#c9882a] hover:text-[#1a3d2b] transition-colors">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="inline-flex items-center gap-3 text-[#1a3d2b] border-b border-[#1a3d2b] pb-1 uppercase tracking-widest text-xs font-bold hover:text-[#c9882a] hover:border-[#c9882a] transition-all">
              Explorar el bazar <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#1a3d2b] text-[#f8f5ef] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#132c1f] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-playfair text-4xl md:text-6xl mb-8 leading-[1.1]">
                Nuestra <br /><i className="text-[#c9882a]">filosofía.</i>
              </h2>
              <p className="text-lg text-[#e8dfce] mb-8 font-light leading-relaxed max-w-md">
                Creemos en la elegancia de lo simple y en el valor de la confianza. Snowmarket no es solo una plataforma, es un refugio para los puristas de la montaña.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="border-l border-[#c9882a]/30 pl-6">
                <ShieldCheck className="w-8 h-8 text-[#c9882a] mb-4" />
                <h3 className="font-playfair text-xl mb-3">Rigurosa Selección</h3>
                <p className="text-[#a0a0a0] font-light leading-relaxed text-sm">
                  Inspeccionamos físicamente las propiedades y curamos el inventario. La calidad precede a la cantidad.
                </p>
              </div>

              <div className="border-l border-[#c9882a]/30 pl-6">
                <Users className="w-8 h-8 text-[#c9882a] mb-4" />
                <h3 className="font-playfair text-xl mb-3">Círculo Íntimo</h3>
                <p className="text-[#a0a0a0] font-light leading-relaxed text-sm">
                  Una comunidad de entusiastas que comparten el respeto por el entorno alpino y el equipo bien cuidado.
                </p>
              </div>

              <div className="border-l border-[#c9882a]/30 pl-6 md:col-span-2">
                <Tag className="w-8 h-8 text-[#c9882a] mb-4" />
                <h3 className="font-playfair text-xl mb-3">Trato Justo</h3>
                <p className="text-[#a0a0a0] font-light leading-relaxed text-sm max-w-md">
                  Transparencia absoluta. Facilitamos la conexión directa, protegiendo ambas partes sin intermediarios innecesarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#11261b] text-[#e8dfce] py-16 border-t border-[#1a3d2b]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6 opacity-80">
                <div className="w-8 h-8 rounded bg-[#f8f5ef] flex items-center justify-center">
                  <Package className="w-4 h-4 text-[#11261b]" />
                </div>
                <span className="font-playfair font-bold text-xl tracking-tight text-[#f8f5ef]">
                  Snowmarket
                </span>
              </div>
              <p className="text-[#8a8a8a] max-w-sm font-light">
                Elevando la experiencia en la montaña. El primer refugio digital para la compra y arriendo alpino.
              </p>
            </div>

            <div>
              <h4 className="font-playfair text-[#f8f5ef] mb-6 uppercase tracking-widest text-xs">Descubrir</h4>
              <ul className="space-y-4 font-light text-sm text-[#8a8a8a]">
                <li><a href="#" className="hover:text-[#c9882a] transition-colors">La Colección</a></li>
                <li><a href="#" className="hover:text-[#c9882a] transition-colors">Equipamiento</a></li>
                <li><a href="#" className="hover:text-[#c9882a] transition-colors">Diario Alpino</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-playfair text-[#f8f5ef] mb-6 uppercase tracking-widest text-xs">Soporte</h4>
              <ul className="space-y-4 font-light text-sm text-[#8a8a8a]">
                <li><a href="#" className="hover:text-[#c9882a] transition-colors">Asistencia</a></li>
                <li><a href="#" className="hover:text-[#c9882a] transition-colors">Garantía de calidad</a></li>
                <li><a href="#" className="hover:text-[#c9882a] transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#1a3d2b] text-xs text-[#5a5a5a] uppercase tracking-widest">
            <p>&copy; {new Date().getFullYear()} Snowmarket.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#e8dfce] transition-colors">Privacidad</a>
              <a href="#" className="hover:text-[#e8dfce] transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const DUMMY_APARTMENTS = [
  { id: 1, title: "Chalet de Madera con Vista Panorámica", resort: "Valle Nevado", pricePerNight: 350000, bedrooms: 4, maxGuests: 8, verified: true, rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=800" },
  { id: 2, title: "Refugio Íntimo entre los Bosques", resort: "Chillán", pricePerNight: 190000, bedrooms: 2, maxGuests: 4, verified: true, rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800" },
  { id: 3, title: "Loft Minimalista Frente a las Pistas", resort: "La Parva", pricePerNight: 210000, bedrooms: 1, maxGuests: 2, verified: false, rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800" },
];

const DUMMY_EQUIPMENT = [
  { id: 1, title: "Burton Family Tree Hometown Hero", category: "Tablas", condition: "Como Nuevo", price: 450000, purchaseType: "verified_warehouse", imageUrl: "https://images.unsplash.com/photo-1563299796-1759b81f13f1?w=600" },
  { id: 2, title: "Casco POC Auric Cut Backcountry", category: "Protección", condition: "Nuevo con etiquetas", price: 180000, purchaseType: "normal", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600" },
  { id: 3, title: "Botas Ski Salomon Shift Pro", category: "Botas", condition: "Usado - Buen Estado", price: 320000, purchaseType: "verified_warehouse", imageUrl: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=600" },
  { id: 4, title: "Chaqueta Gore-Tex Arc'teryx", category: "Ropa", condition: "Nuevo", price: 580000, purchaseType: "normal", imageUrl: "https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?w=600" },
];
