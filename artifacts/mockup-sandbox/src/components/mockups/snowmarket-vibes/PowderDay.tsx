import React, { useState, useEffect } from "react";
import { Search, MapPin, Star, ShieldCheck, Users, BedDouble, Calendar, Tag, ArrowRight, Zap, Package, ChevronRight } from "lucide-react";

export function PowderDay() {
  const [searchTab, setSearchTab] = useState<"apartments" | "equipment">("apartments");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      imageUrl: "https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=800"
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
      imageUrl: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800"
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
      imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
    }
  ];

  const DUMMY_EQUIPMENT = [
    {
      id: 1,
      title: "Tabla Snowboard Burton Custom 158",
      category: "Tablas",
      condition: "Usado - Como Nuevo",
      price: 350000,
      seller: "Juan P.",
      verified: true,
      imageUrl: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600",
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
      imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600",
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
      imageUrl: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=600",
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
      imageUrl: "https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5?w=600",
      brand: "The North Face"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Barlow:wght@400;500;600;700&display=swap");
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-barlow { font-family: 'Barlow', sans-serif; }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-white/50 backdrop-blur-sm py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-[#FF5C2B] rounded-none transform -skew-x-12 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-syne font-bold text-xl skew-x-12">S</span>
            </div>
            <span className="font-syne font-bold text-2xl tracking-tighter text-[#111827] uppercase">Snowmarket<span className="text-[#FF5C2B]">.</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="font-barlow font-bold text-sm tracking-wide text-[#111827] hover:text-[#FF5C2B] uppercase transition-colors">Alojamientos</a>
            <a href="#" className="font-barlow font-bold text-sm tracking-wide text-[#111827] hover:text-[#FF5C2B] uppercase transition-colors">Equipamiento</a>
            <a href="#" className="font-barlow font-bold text-sm tracking-wide text-[#111827] hover:text-[#FF5C2B] uppercase transition-colors">Cómo Funciona</a>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-[#111827] hover:text-[#FF5C2B] transition-colors">
              <Search className="w-6 h-6" />
            </button>
            <button className="hidden md:block font-barlow font-bold text-sm text-[#111827] hover:text-[#FF5C2B] uppercase transition-colors">Ingresar</button>
            <button className="px-6 py-3 bg-[#FF5C2B] text-white font-barlow font-bold text-sm uppercase tracking-wider hover:bg-[#E0481D] transition-colors transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-[#FF5C2B]/30">
              Publicar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1600"
            alt="Mountain" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF5C2B]/90 via-[#FF5C2B]/20 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="font-syne font-extrabold text-6xl md:text-8xl lg:text-9xl text-white mb-6 uppercase leading-none tracking-[-0.03em] drop-shadow-2xl">
            La montaña<br />
            <span className="text-[#111827] bg-[#FF5C2B] px-4 py-2 inline-block transform -skew-x-6 mt-2">te llama.</span>
          </h1>
          <p className="font-barlow text-xl md:text-2xl text-white font-medium max-w-2xl mx-auto mb-16 drop-shadow-md">
            Alojamientos top y el mejor marketplace de equipamiento. Sin rodeos, directo a la nieve.
          </p>

          {/* Search Widget */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-4 md:p-6 border-t-8 border-[#FF5C2B]">
            <div className="flex gap-4 mb-6 px-2">
              <button 
                onClick={() => setSearchTab("apartments")}
                className={`pb-2 text-lg font-syne font-bold uppercase transition-all ${
                  searchTab === "apartments" 
                    ? "text-[#FF5C2B] border-b-4 border-[#FF5C2B]" 
                    : "text-gray-400 hover:text-[#111827]"
                }`}
              >
                Alojamientos
              </button>
              <button 
                onClick={() => setSearchTab("equipment")}
                className={`pb-2 text-lg font-syne font-bold uppercase transition-all ${
                  searchTab === "equipment" 
                    ? "text-[#FF5C2B] border-b-4 border-[#FF5C2B]" 
                    : "text-gray-400 hover:text-[#111827]"
                }`}
              >
                Equipamiento
              </button>
            </div>

            {searchTab === "apartments" ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-200 focus-within:border-[#FF5C2B] focus-within:ring-1 focus-within:ring-[#FF5C2B] transition-all">
                  <MapPin className="w-6 h-6 text-[#FF5C2B] mr-3" />
                  <div className="text-left w-full">
                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Destino</div>
                    <input type="text" placeholder="Ej. Valle Nevado" className="bg-transparent border-none outline-none text-base font-bold w-full text-[#111827] placeholder:text-gray-400" />
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 rounded-lg p-4 border border-gray-200 md:col-span-2 hover:border-[#FF5C2B] transition-all cursor-pointer">
                  <Calendar className="w-6 h-6 text-[#FF5C2B] mr-3" />
                  <div className="text-left w-full flex gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Llegada</div>
                      <div className="text-base font-bold text-gray-400">Seleccionar</div>
                    </div>
                    <div className="w-px h-8 bg-gray-300"></div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Salida</div>
                      <div className="text-base font-bold text-gray-400">Seleccionar</div>
                    </div>
                  </div>
                </div>
                <button className="bg-[#FF5C2B] hover:bg-[#E0481D] text-white rounded-lg p-4 flex items-center justify-center font-syne font-bold uppercase tracking-widest text-lg gap-2 shadow-lg shadow-[#FF5C2B]/30 hover:shadow-xl hover:shadow-[#FF5C2B]/40 transition-all active:scale-95">
                  <Search className="w-5 h-5" />
                  Buscar
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center bg-gray-50 rounded-lg p-4 border border-gray-200 focus-within:border-[#FF5C2B] focus-within:ring-1 focus-within:ring-[#FF5C2B] transition-all">
                  <Search className="w-6 h-6 text-[#FF5C2B] mr-3" />
                  <div className="text-left w-full">
                    <input type="text" placeholder="Busca tablas, botas, antiparras..." className="bg-transparent border-none outline-none text-lg font-bold w-full text-[#111827] placeholder:text-gray-400" />
                  </div>
                </div>
                <button className="bg-[#FF5C2B] hover:bg-[#E0481D] text-white rounded-lg px-8 py-4 flex items-center justify-center font-syne font-bold uppercase tracking-widest text-lg gap-2 shadow-lg shadow-[#FF5C2B]/30 hover:shadow-xl hover:shadow-[#FF5C2B]/40 transition-all active:scale-95">
                  Buscar Equipo
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Apartments */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b-4 border-[#111827] pb-4">
            <div>
              <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-[#111827] uppercase tracking-tight">Departamentos <span className="text-[#FF5C2B]">Verificados</span></h2>
              <p className="font-barlow text-gray-500 text-xl font-medium mt-2">Seguridad total. Aprobados por nuestro equipo.</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 font-syne font-bold uppercase tracking-wider text-[#0EA5E9] hover:text-[#111827] transition-colors group">
              Ver todos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DUMMY_APARTMENTS.map((apt) => (
              <div key={apt.id} className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#FF5C2B] z-20 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={apt.imageUrl} alt={apt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    {apt.verified && (
                      <div className="bg-[#FF5C2B] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Verificado</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-[#111827] text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                    <Star className="w-4 h-4 text-[#FF5C2B] fill-[#FF5C2B]" />
                    <span className="text-sm font-bold">{apt.rating}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[#0EA5E9] font-bold text-sm mb-3 uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    {apt.resort}
                  </div>
                  
                  <h3 className="font-syne font-bold text-2xl text-[#111827] mb-4 line-clamp-2 leading-tight group-hover:text-[#FF5C2B] transition-colors">
                    {apt.title}
                  </h3>
                  
                  <div className="flex items-center gap-6 text-gray-500 font-semibold mb-6">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-gray-400" />
                      {apt.bedrooms} hab.
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      Max {apt.maxGuests}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <span className="font-syne font-extrabold text-3xl text-[#111827]">
                        {formatCurrency(apt.pricePerNight)}
                      </span>
                      <span className="text-gray-500 font-bold ml-1">/noche</span>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#FF5C2B] group-hover:text-white transition-colors">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="md:hidden w-full mt-10 py-4 bg-[#111827] text-white font-syne font-bold uppercase tracking-widest text-lg rounded-xl">
            Ver todos los alojamientos
          </button>
        </div>
      </section>

      {/* Equipment */}
      <section className="py-24 bg-[#F0F9FF]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b-4 border-[#0EA5E9] pb-4">
            <div>
              <h2 className="font-syne text-4xl md:text-5xl font-extrabold text-[#111827] uppercase tracking-tight">Marketplace de <span className="text-[#0EA5E9]">Equipos</span></h2>
              <p className="font-barlow text-gray-500 text-xl font-medium mt-2">Compra y vende. Calidad comprobada en Bodega.</p>
            </div>
            <a href="#" className="hidden md:flex items-center gap-2 font-syne font-bold uppercase tracking-wider text-[#FF5C2B] hover:text-[#111827] transition-colors group">
              Explorar Market <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DUMMY_EQUIPMENT.map((eq) => (
              <div key={eq.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#0EA5E9]">
                <div className="relative aspect-square overflow-hidden bg-gray-100 p-4">
                  <img src={eq.imageUrl} alt={eq.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#111827] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      {eq.category}
                    </span>
                  </div>
                  {eq.verified && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-[#FF5C2B] w-8 h-8 rounded-full flex items-center justify-center shadow-lg" title="Verificado en Bodega">
                        <ShieldCheck className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-1">{eq.brand}</div>
                  <h3 className="font-syne font-bold text-lg text-[#111827] mb-2 line-clamp-2 leading-tight">
                    {eq.title}
                  </h3>
                  <div className="text-sm font-semibold text-[#0EA5E9] mb-4">{eq.condition}</div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-syne font-extrabold text-2xl text-[#111827]">
                      {formatCurrency(eq.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="md:hidden w-full mt-10 py-4 border-2 border-[#0EA5E9] text-[#0EA5E9] font-syne font-bold uppercase tracking-widest text-lg rounded-xl">
            Ver todo el equipamiento
          </button>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-[#FF5C2B] text-white relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-syne text-5xl md:text-6xl font-extrabold uppercase tracking-tight mb-4 drop-shadow-sm">¿Por qué Snowmarket?</h2>
            <div className="w-24 h-2 bg-white mx-auto transform -skew-x-12"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-2xl bg-[#111827] flex items-center justify-center mb-8 transform -skew-x-6 group-hover:scale-110 transition-transform shadow-xl">
                <Zap className="w-12 h-12 text-[#FF5C2B]" />
              </div>
              <h3 className="font-syne text-3xl font-bold mb-4 uppercase">Rápido y Directo</h3>
              <p className="font-barlow text-xl font-medium text-white/90">Sin intermediarios innecesarios. Conecta directamente con dueños y vendedores al instante.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center mb-8 transform skew-x-6 group-hover:scale-110 transition-transform shadow-xl">
                <ShieldCheck className="w-12 h-12 text-[#FF5C2B]" />
              </div>
              <h3 className="font-syne text-3xl font-bold mb-4 uppercase text-[#111827]">100% Seguro</h3>
              <p className="font-barlow text-xl font-medium text-white/90">Propiedades verificadas en terreno y equipos revisados en nuestra bodega antes de la entrega.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-2xl bg-[#0EA5E9] flex items-center justify-center mb-8 transform -skew-x-6 group-hover:scale-110 transition-transform shadow-xl">
                <Tag className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-syne text-3xl font-bold mb-4 uppercase">Mejores Precios</h3>
              <p className="font-barlow text-xl font-medium text-white/90">Comisión transparente y justa. Paga menos que en otras plataformas y disfruta más la montaña.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-[#FF5C2B] rounded-none transform -skew-x-12 flex items-center justify-center">
                  <span className="text-white font-syne font-bold text-xl skew-x-12">S</span>
                </div>
                <span className="font-syne font-bold text-3xl tracking-tighter uppercase">Snowmarket<span className="text-[#FF5C2B]">.</span></span>
              </div>
              <p className="font-barlow text-gray-400 text-lg max-w-sm mb-8">
                El marketplace definitivo para amantes de la nieve. Compra, arrienda y vende con seguridad.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF5C2B] transition-colors cursor-pointer"></div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF5C2B] transition-colors cursor-pointer"></div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF5C2B] transition-colors cursor-pointer"></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-syne font-bold text-xl mb-6 uppercase tracking-wider text-gray-500">Explorar</h4>
              <ul className="space-y-4 font-barlow text-lg font-medium">
                <li><a href="#" className="hover:text-[#FF5C2B] transition-colors">Alojamientos</a></li>
                <li><a href="#" className="hover:text-[#FF5C2B] transition-colors">Equipamiento</a></li>
                <li><a href="#" className="hover:text-[#FF5C2B] transition-colors">Bodega Oficial</a></li>
                <li><a href="#" className="hover:text-[#FF5C2B] transition-colors">Centros de Ski</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-syne font-bold text-xl mb-6 uppercase tracking-wider text-gray-500">Soporte</h4>
              <ul className="space-y-4 font-barlow text-lg font-medium">
                <li><a href="#" className="hover:text-[#FF5C2B] transition-colors">Cómo Funciona</a></li>
                <li><a href="#" className="hover:text-[#FF5C2B] transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="#" className="hover:text-[#FF5C2B] transition-colors">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:text-[#FF5C2B] transition-colors">Contacto</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 font-barlow text-gray-500 font-medium">
            <p>© {new Date().getFullYear()} Snowmarket. Todos los derechos reservados.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white">Privacidad</a>
              <a href="#" className="hover:text-white">Términos</a>
              <a href="#" className="hover:text-white">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
