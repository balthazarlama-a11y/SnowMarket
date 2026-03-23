import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useListApartments } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, ShieldCheck, Star, MapPin, BedDouble, Users, Calendar, CheckCircle2 } from "lucide-react";

export function ApartmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: apartments, isLoading } = useListApartments();

  const apartment = apartments?.find((a) => String(a.id) === String(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f8fc]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-40 pb-24 animate-pulse">
          <div className="h-4 bg-[#d8e8f4] w-24 rounded mb-8" />
          <div className="aspect-[16/7] bg-[#d8e8f4] rounded-xl mb-12" />
          <div className="h-8 bg-[#d8e8f4] w-2/3 rounded mb-4" />
          <div className="h-4 bg-[#d8e8f4] w-1/3 rounded" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="min-h-screen bg-[#f4f8fc]">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-40 pb-24 text-center">
          <h1 className="font-display text-4xl text-[#0d2137] mb-4">Alojamiento no encontrado</h1>
          <p className="text-[#3f5d75] mb-8">Este refugio ya no está disponible.</p>
          <Link href="/apartments" className="inline-flex items-center gap-2 text-[#3b9fd6] uppercase tracking-widest text-xs font-bold">
            <ArrowLeft className="w-4 h-4" /> Volver a la colección
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8fc]">
      <Navbar />

      <main className="pt-36 pb-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <Link href="/apartments" className="inline-flex items-center gap-2 text-[#6e8fa6] hover:text-[#3b9fd6] transition-colors text-sm uppercase tracking-widest mb-10">
            <ArrowLeft className="w-4 h-4" /> La Colección
          </Link>

          {/* Hero image */}
          <div className="relative aspect-[16/7] overflow-hidden rounded-xl mb-12 shadow-lg shadow-[#0d2137]/10">
            <img
              src={apartment.imageUrl || "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=1600"}
              alt={apartment.title}
              className="w-full h-full object-cover"
              style={{ filter: "contrast(0.95) saturate(0.85)" }}
            />
            {apartment.verified && (
              <div className="absolute top-6 left-6 bg-[#0d2137] text-[#f4f8fc] px-4 py-2 rounded flex items-center gap-2 shadow-lg">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider font-semibold">Inspeccionado y Verificado</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left: Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-[#3b9fd6] text-xs uppercase tracking-widest mb-4">
                <MapPin className="w-4 h-4" />
                {apartment.resort}{apartment.location ? `, ${apartment.location}` : ""}
              </div>

              <h1 className="font-display text-4xl md:text-5xl text-[#0d2137] mb-6 leading-tight">
                {apartment.title}
              </h1>

              <div className="flex items-center gap-6 text-sm text-[#3f5d75] mb-8 pb-8 border-b border-[#d8e8f4]">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-[#3b9fd6] text-[#3b9fd6]" />
                  <span className="font-semibold">{Number(apartment.rating).toFixed(1)}</span>
                  <span className="text-[#6e8fa6]">({apartment.reviewCount} reseñas)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4" />
                  {apartment.bedrooms} Habitaciones
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Hasta {apartment.maxGuests} personas
                </div>
              </div>

              <div className="mb-8">
                <h2 className="font-display text-2xl text-[#0d2137] mb-4">Sobre el refugio</h2>
                <p className="text-[#3f5d75] font-light leading-relaxed">
                  Un espacio diseñado para quienes entienden que descansar bien es parte del viaje. Ubicado a pasos de las pistas, este refugio combina el calor de la madera chilena con comodidades modernas, creando el ambiente perfecto para recargar energías entre jornadas de nieve.
                </p>
              </div>

              <div>
                <h2 className="font-display text-2xl text-[#0d2137] mb-6">Lo que incluye</h2>
                <div className="grid grid-cols-2 gap-3">
                  {["Calefacción central", "Wifi de alta velocidad", "Cocina equipada", "Ropa de cama", "Estacionamiento", "Chimenea"].map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-[#3f5d75] text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#3b9fd6] shrink-0" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Booking card */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-white border border-[#d8e8f4] rounded-xl p-8 shadow-[0_10px_30px_rgba(26,61,43,0.05)]">
                <div className="mb-6">
                  <span className="font-display text-3xl text-[#0d2137]">{formatCurrency(apartment.pricePerNight)}</span>
                  <span className="text-[#6e8fa6] text-sm"> / noche</span>
                </div>

                <div className="border border-[#d8e8f4] rounded mb-4 overflow-hidden">
                  <div className="grid grid-cols-2">
                    <div className="p-4 border-r border-[#d8e8f4]">
                      <div className="text-xs uppercase tracking-widest text-[#6e8fa6] mb-1">Llegada</div>
                      <div className="text-sm text-[#0d2137]">Seleccionar</div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs uppercase tracking-widest text-[#6e8fa6] mb-1">Salida</div>
                      <div className="text-sm text-[#0d2137]">Seleccionar</div>
                    </div>
                  </div>
                  <div className="border-t border-[#d8e8f4] p-4">
                    <div className="text-xs uppercase tracking-widest text-[#6e8fa6] mb-1">Huéspedes</div>
                    <div className="text-sm text-[#0d2137]">1 persona</div>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#0d2137] text-[#f4f8fc] uppercase tracking-widest text-sm hover:bg-[#081828] transition-colors mb-4">
                  Reservar este refugio
                </button>

                <div className="flex items-center gap-3 pt-4 border-t border-[#d8e8f4]">
                  <ShieldCheck className="w-5 h-5 text-[#3b9fd6] shrink-0" />
                  <p className="text-xs text-[#6e8fa6] leading-relaxed">
                    Propiedad inspeccionada por nuestro equipo. Garantía de calidad Snowmarket.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
