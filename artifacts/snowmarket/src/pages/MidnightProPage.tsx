import React, { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users, ArrowRight, ShieldCheck, Tag, BedDouble, Star, Package, Zap } from "lucide-react";
import { useListApartments, useListEquipment } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";

export function MidnightProPage() {
  const [searchTab, setSearchTab] = useState<"apartments" | "equipment">("apartments");
  const [isScrolled, setIsScrolled] = useState(false);

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
    <div className="min-h-screen bg-[#0a0a0f] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#0a0a0f]/90 backdrop-blur-md border-[#1e293b] py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-8 h-8 rounded-md bg-[#12121a] border border-[#1e293b] flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] transition-all duration-300">
                <Zap className="w-4 h-4 text-[#00d4ff]" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                SNOWMARKET<span className="text-[#00d4ff]">.PRO</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <span className="text-sm font-semibold text-[#00d4ff] cursor-pointer tracking-wide">ALOJAMIENTOS</span>
              <span className="text-sm font-semibold text-[#64748b] hover:text-white transition-colors cursor-pointer tracking-wide">EQUIPAMIENTO</span>
              <span className="text-sm font-semibold text-[#64748b] hover:text-white transition-colors cursor-pointer tracking-wide">CÓMO FUNCIONA</span>
            </nav>

            <div className="hidden md:flex items-center gap-6">
              <button className="text-sm font-semibold text-[#64748b] hover:text-white transition-colors tracking-wide">
                INGRESAR
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-[#00d4ff] to-[#38bdf8] text-[#0a0a0f] rounded text-sm font-bold shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition-all duration-300 tracking-wide uppercase">
                Publicar
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden border-b border-[#1e293b]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1600"
            alt="Mountain peaks at sunrise"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/90 to-[#0a0a0f]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#1e293b] bg-[#12121a]/80 backdrop-blur mb-8">
            <ShieldCheck className="w-4 h-4 text-[#00d4ff]" />
            <span className="text-xs font-bold tracking-widest text-[#64748b] uppercase">Plataforma Verificada</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-[-0.03em] text-center leading-[0.9]">
            DOMINA LA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#38bdf8]">MONTAÑA</span>
          </h1>
          <p className="text-lg md:text-xl text-[#64748b] max-w-2xl text-center mb-12 tracking-wide font-medium">
            Alojamientos premium verificados y el marketplace definitivo de equipamiento técnico. Para quienes toman la nieve en serio.
          </p>

          <div className="w-full max-w-4xl bg-[#12121a]/80 rounded-lg border border-[#1e293b] p-3 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.8)]">
            <div className="flex gap-2 mb-4 px-2 pt-2 border-b border-[#1e293b] pb-3">
              <button
                onClick={() => setSearchTab("apartments")}
                className={`px-4 py-2 rounded text-xs font-bold tracking-widest uppercase transition-colors ${
                  searchTab === "apartments" ? "bg-[#1e293b] text-[#00d4ff]" : "text-[#64748b] hover:text-white"
                }`}
              >
                Alojamientos
              </button>
              <button
                onClick={() => setSearchTab("equipment")}
                className={`px-4 py-2 rounded text-xs font-bold tracking-widest uppercase transition-colors ${
                  searchTab === "equipment" ? "bg-[#1e293b] text-[#00d4ff]" : "text-[#64748b] hover:text-white"
                }`}
              >
                Equipamiento
              </button>
            </div>

            {searchTab === "apartments" ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="flex items-center bg-[#0a0a0f] rounded p-4 border border-[#1e293b] focus-within:border-[#00d4ff] transition-colors">
                  <MapPin className="w-5 h-5 text-[#64748b] mr-3" />
                  <div className="text-left w-full">
                    <div className="text-[10px] text-[#64748b] font-bold tracking-widest uppercase mb-1">Destino</div>
                    <input type="text" placeholder="Ej. Valle Nevado" className="bg-transparent border-none outline-none text-sm font-semibold w-full text-white placeholder:text-[#64748b]" />
                  </div>
                </div>
                <div className="flex items-center bg-[#0a0a0f] rounded p-4 border border-[#1e293b] md:col-span-2">
                  <Calendar className="w-5 h-5 text-[#64748b] mr-3" />
                  <div className="text-left w-full flex gap-4">
                    <div className="flex-1">
                      <div className="text-[10px] text-[#64748b] font-bold tracking-widest uppercase mb-1">Check-in</div>
                      <div className="text-sm font-semibold text-[#64748b]">Seleccionar</div>
                    </div>
                    <div className="w-px h-8 bg-[#1e293b]"></div>
                    <div className="flex-1">
                      <div className="text-[10px] text-[#64748b] font-bold tracking-widest uppercase mb-1">Check-out</div>
                      <div className="text-sm font-semibold text-[#64748b]">Seleccionar</div>
                    </div>
                  </div>
                </div>
                <button className="bg-[#00d4ff] hover:bg-[#38bdf8] text-[#0a0a0f] rounded p-4 flex items-center justify-center font-bold tracking-widest uppercase text-xs transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)]">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center bg-[#0a0a0f] rounded p-4 border border-[#1e293b] focus-within:border-[#00d4ff] transition-colors">
                  <Search className="w-5 h-5 text-[#64748b] mr-3" />
                  <input type="text" placeholder="Busca material técnico..." className="bg-transparent border-none outline-none text-sm font-semibold w-full text-white placeholder:text-[#64748b]" />
                </div>
                <button className="bg-[#00d4ff] hover:bg-[#38bdf8] text-[#0a0a0f] rounded px-8 py-4 flex items-center justify-center font-bold tracking-widest uppercase text-xs transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)]">
                  Buscar
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0f] border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#00d4ff] rounded-full shadow-[0_0_10px_rgba(0,212,255,0.8)]"></div>
                <h2 className="text-xs font-bold tracking-[0.2em] text-[#64748b] uppercase">Alojamientos Premium</h2>
              </div>
              <h3 className="text-3xl font-black text-white tracking-[-0.02em]">DEPARTAMENTOS VERIFICADOS</h3>
            </div>
            <button className="hidden md:flex items-center gap-2 text-xs font-bold tracking-widest text-[#00d4ff] hover:text-white transition-colors uppercase">
              Ver Catálogo <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayApartments.slice(0, 3).map((apt) => (
              <div
                key={apt.id}
                className="group bg-[#12121a] rounded-lg overflow-hidden border border-[#1e293b] hover:border-[#00d4ff]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)] cursor-pointer flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#0a0a0f]">
                  <img
                    src={apt.imageUrl ?? "https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=800"}
                    alt={apt.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out grayscale-[0.2]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] to-transparent opacity-80"></div>

                  {apt.verified && (
                    <div className="absolute top-4 left-4 bg-[#0a0a0f]/80 backdrop-blur-md border border-[#00d4ff]/30 px-3 py-1.5 rounded flex items-center gap-2 shadow-[0_0_15px_rgba(0,212,255,0.15)]">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00d4ff]" />
                      <span className="text-[10px] font-bold tracking-widest text-[#00d4ff] uppercase">Verificado</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-[#0a0a0f]/80 backdrop-blur-md border border-[#1e293b] px-2.5 py-1.5 rounded flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#00d4ff] text-[#00d4ff]" />
                    <span className="text-xs font-bold text-white">{Number(apt.rating).toFixed(1)}</span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#64748b] uppercase mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#00d4ff]" />
                    {apt.resort}
                  </div>

                  <h3 className="font-bold text-lg text-white mb-4 line-clamp-2 leading-tight tracking-tight">
                    {apt.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-[#64748b] font-semibold mb-6 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4" />
                      {apt.bedrooms} HAB
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      MAX {apt.maxGuests}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]">
                    <div>
                      <span className="font-black text-xl text-white tracking-tight">
                        {formatCurrency(apt.pricePerNight)}
                      </span>
                      <span className="text-[10px] text-[#64748b] font-bold tracking-widest uppercase ml-1">/ NOCHE</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#1e293b] group-hover:text-[#00d4ff] transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0f0f1a] border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-[#38bdf8] rounded-full shadow-[0_0_10px_rgba(56,189,248,0.8)]"></div>
                <h2 className="text-xs font-bold tracking-[0.2em] text-[#64748b] uppercase">Marketplace Técnico</h2>
              </div>
              <h3 className="text-3xl font-black text-white tracking-[-0.02em]">EQUIPAMIENTO DESTACADO</h3>
            </div>
            <button className="hidden md:flex items-center gap-2 text-xs font-bold tracking-widest text-[#00d4ff] hover:text-white transition-colors uppercase">
              Ver Market <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayEquipment.slice(0, 4).map((eq) => (
              <div
                key={eq.id}
                className="group bg-[#141420] rounded-lg overflow-hidden border border-[#1e293b] hover:border-[#38bdf8]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)] cursor-pointer flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-[#0a0a0f] p-4">
                  <img
                    src={eq.imageUrl ?? "https://images.unsplash.com/photo-1563299796-1759b81f13f1?w=600"}
                    alt={eq.title}
                    className="w-full h-full object-cover rounded opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale-[0.3]"
                  />
                  {eq.purchaseType === "verified_warehouse" && (
                    <div className="absolute top-6 left-6 bg-[#0a0a0f]/90 border border-[#00d4ff]/30 px-2 py-1 rounded flex items-center gap-1.5 backdrop-blur-sm">
                      <ShieldCheck className="w-3 h-3 text-[#00d4ff]" />
                      <span className="text-[9px] font-bold tracking-widest text-[#00d4ff] uppercase">Bodega</span>
                    </div>
                  )}
                  <div className="absolute bottom-6 right-6 bg-[#1e293b]/90 backdrop-blur-sm px-2 py-1 rounded">
                    <span className="text-[10px] font-bold text-white tracking-wider">{eq.condition}</span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow border-t border-[#1e293b]/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-bold tracking-widest text-[#64748b] uppercase px-1.5 py-0.5 border border-[#1e293b] rounded">
                      {eq.category}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-4 line-clamp-2 leading-snug tracking-tight group-hover:text-[#38bdf8] transition-colors">
                    {eq.title}
                  </h3>

                  <div className="mt-auto flex items-end justify-between">
                    <span className="font-black text-lg text-white tracking-tight">
                      {formatCurrency(eq.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1e1b4b]/20 via-[#0a0a0f] to-[#0a0a0f]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-[-0.02em] text-white">
            POR QUÉ <span className="text-[#00d4ff]">ELEGIRNOS</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: <ShieldCheck className="w-8 h-8 text-[#00d4ff]" />, title: "Verificación Técnica", desc: "Inspeccionamos propiedades y triangulamos las compras en nuestra bodega física. Cero riesgo." },
              { icon: <Package className="w-8 h-8 text-[#00d4ff]" />, title: "Red Privada", desc: "Acceso exclusivo a inventario de alta gama. Solo usuarios verificados y reseñas de esquiadores reales." },
              { icon: <Tag className="w-8 h-8 text-[#00d4ff]" />, title: "Eficiencia Directa", desc: "Comisión plana y trato directo para asegurar las mejores tarifas del mercado premium." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded bg-[#12121a] border border-[#1e293b] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,212,255,0.1)]">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase mb-4 text-white">{item.title}</h3>
                <p className="text-[#64748b] text-sm leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1e293b] bg-[#0a0a0f] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <Zap className="w-5 h-5 text-[#64748b]" />
            <span className="font-bold text-lg tracking-tight text-[#64748b]">
              SNOWMARKET<span className="text-[#1e293b]">.PRO</span>
            </span>
          </div>
          <div className="flex gap-8 text-[10px] font-bold tracking-widest text-[#64748b] uppercase">
            <span className="hover:text-white cursor-pointer transition-colors">Soporte</span>
            <span className="hover:text-white cursor-pointer transition-colors">Términos</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacidad</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const DUMMY_APARTMENTS = [
  { id: 1, title: "Penthouse Ski-in/Ski-out con vista panorámica", resort: "Valle Nevado", pricePerNight: 250000, bedrooms: 3, maxGuests: 6, verified: true, rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=800" },
  { id: 2, title: "Depto Familiar a 5 min del andarivel", resort: "El Colorado", pricePerNight: 180000, bedrooms: 2, maxGuests: 4, verified: true, rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800" },
  { id: 3, title: "Estudio moderno ideal para parejas", resort: "La Parva", pricePerNight: 120000, bedrooms: 1, maxGuests: 2, verified: false, rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800" },
];

const DUMMY_EQUIPMENT = [
  { id: 1, title: "Tabla Snowboard Burton Custom 158", category: "Tablas", condition: "Usado - Como Nuevo", price: 350000, purchaseType: "verified_warehouse", imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600" },
  { id: 2, title: "Botas Ski Salomon Shift Pro", category: "Botas", condition: "Nuevo", price: 420000, purchaseType: "normal", imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600" },
  { id: 3, title: "Antiparras Oakley Flight Deck", category: "Accesorios", condition: "Usado - Buen Estado", price: 850000, purchaseType: "normal", imageUrl: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=600" },
  { id: 4, title: "Chaqueta Gore-Tex North Face", category: "Ropa", condition: "Nuevo", price: 290000, purchaseType: "verified_warehouse", imageUrl: "https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?w=600" },
];
