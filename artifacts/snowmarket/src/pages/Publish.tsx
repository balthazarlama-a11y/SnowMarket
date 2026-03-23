import { useState } from "react";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Home, Package, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

type PublishType = "apartment" | "equipment" | null;

export function Publish() {
  const [type, setType] = useState<PublishType>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f4f8fc]">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-48 pb-24 text-center">
          <CheckCircle2 className="w-16 h-16 text-[#3b9fd6] mx-auto mb-6" />
          <h1 className="font-display text-4xl text-[#0d2137] mb-4">¡Solicitud recibida!</h1>
          <p className="text-[#3f5d75] font-light leading-relaxed mb-8">
            Nuestro equipo revisará tu publicación y se pondrá en contacto contigo dentro de las próximas 24–48 horas para coordinar la visita de inspección.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-[#3b9fd6] uppercase tracking-widest text-xs font-bold">
            Volver al inicio
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
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h1 className="font-display text-5xl text-[#0d2137] mb-4">Publicar en Snowmarket</h1>
            <p className="text-[#3f5d75] text-lg font-light max-w-xl mx-auto">
              Une tu propiedad o equipo a la colección más curada de la montaña chilena.
            </p>
          </div>

          {/* Type selector */}
          {!type && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <button
                onClick={() => setType("apartment")}
                className="group border border-[#d8e8f4] bg-white rounded-xl p-10 text-left hover:border-[#0d2137] hover:shadow-[0_10px_30px_rgba(26,61,43,0.08)] transition-all duration-300"
              >
                <Home className="w-10 h-10 text-[#3b9fd6] mb-6" />
                <h2 className="font-display text-2xl text-[#0d2137] mb-3">Alojamiento</h2>
                <p className="text-[#3f5d75] font-light text-sm leading-relaxed mb-6">
                  Arrienda tu propiedad a esquiadores verificados. Comisión del 5% solo cuando concretamos la reserva.
                </p>
                <div className="flex items-center gap-2 text-[#3b9fd6] text-xs uppercase tracking-widest font-bold">
                  Comenzar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => setType("equipment")}
                className="group border border-[#d8e8f4] bg-white rounded-xl p-10 text-left hover:border-[#0d2137] hover:shadow-[0_10px_30px_rgba(26,61,43,0.08)] transition-all duration-300"
              >
                <Package className="w-10 h-10 text-[#3b9fd6] mb-6" />
                <h2 className="font-display text-2xl text-[#0d2137] mb-3">Equipamiento</h2>
                <p className="text-[#3f5d75] font-light text-sm leading-relaxed mb-6">
                  Vende tu equipo con respaldo de nuestra Bodega Verificada. Seguridad total para ambas partes.
                </p>
                <div className="flex items-center gap-2 text-[#3b9fd6] text-xs uppercase tracking-widest font-bold">
                  Comenzar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          )}

          {/* Form */}
          {type && (
            <div className="bg-white border border-[#d8e8f4] rounded-xl p-10">
              <button
                onClick={() => setType(null)}
                className="text-xs uppercase tracking-widest text-[#6e8fa6] hover:text-[#0d2137] transition-colors mb-8 flex items-center gap-2"
              >
                ← Cambiar tipo
              </button>

              <h2 className="font-display text-3xl text-[#0d2137] mb-8">
                {type === "apartment" ? "Publicar Alojamiento" : "Publicar Equipamiento"}
              </h2>

              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#6e8fa6] mb-2">
                    {type === "apartment" ? "Nombre de la propiedad" : "Título del artículo"}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={type === "apartment" ? "Ej. Chalet con vista a las pistas" : "Ej. Tabla Burton Custom 155cm"}
                    className="w-full px-4 py-3 border border-[#d8e8f4] bg-[#f4f8fc] focus:outline-none focus:border-[#3b9fd6] transition-colors text-[#0d2137] text-sm"
                  />
                </div>

                {type === "apartment" && (
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#6e8fa6] mb-2">Centro de ski</label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-[#d8e8f4] bg-[#f4f8fc] focus:outline-none focus:border-[#3b9fd6] transition-colors text-[#0d2137] text-sm appearance-none"
                    >
                      <option value="">Seleccionar centro</option>
                      {["Valle Nevado", "La Parva", "El Colorado", "Chillán", "Portillo"].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                )}

                {type === "equipment" && (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#6e8fa6] mb-2">Categoría</label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-[#d8e8f4] bg-[#f4f8fc] focus:outline-none focus:border-[#3b9fd6] transition-colors text-[#0d2137] text-sm appearance-none"
                      >
                        <option value="">Seleccionar</option>
                        {["Tablas", "Esquís", "Botas", "Ropa", "Accesorios", "Protección"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-[#6e8fa6] mb-2">Precio (CLP)</label>
                      <input
                        required
                        type="number"
                        min="0"
                        placeholder="Ej. 250000"
                        className="w-full px-4 py-3 border border-[#d8e8f4] bg-[#f4f8fc] focus:outline-none focus:border-[#3b9fd6] transition-colors text-[#0d2137] text-sm"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#6e8fa6] mb-2">Tu nombre completo</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 border border-[#d8e8f4] bg-[#f4f8fc] focus:outline-none focus:border-[#3b9fd6] transition-colors text-[#0d2137] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#6e8fa6] mb-2">Correo electrónico</label>
                  <input
                    required
                    type="email"
                    className="w-full px-4 py-3 border border-[#d8e8f4] bg-[#f4f8fc] focus:outline-none focus:border-[#3b9fd6] transition-colors text-[#0d2137] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-[#6e8fa6] mb-2">Teléfono de contacto</label>
                  <input
                    type="tel"
                    placeholder="+56 9 XXXX XXXX"
                    className="w-full px-4 py-3 border border-[#d8e8f4] bg-[#f4f8fc] focus:outline-none focus:border-[#3b9fd6] transition-colors text-[#0d2137] text-sm"
                  />
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-[#d8e8f4]">
                  <ShieldCheck className="w-5 h-5 text-[#3b9fd6] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#6e8fa6] font-light leading-relaxed">
                    Nuestro equipo se comunicará para coordinar la inspección en terreno. Solo publicamos {type === "apartment" ? "propiedades" : "equipos"} que pasan nuestra revisión de calidad.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#0d2137] text-[#f4f8fc] uppercase tracking-widest text-sm hover:bg-[#081828] transition-colors"
                >
                  Enviar Solicitud
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
