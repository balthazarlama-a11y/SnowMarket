import { useParams, Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useListEquipment } from "@workspace/api-client-react";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, ShieldCheck, Tag, CheckCircle2 } from "lucide-react";

export function EquipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: equipment, isLoading } = useListEquipment();

  const item = equipment?.find((e) => String(e.id) === String(id));
  const isVerified = item?.purchaseType === "verified_warehouse" || item?.purchaseType === "verified";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f5ef]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-40 pb-24 animate-pulse">
          <div className="h-4 bg-[#e8dfce] w-24 rounded mb-8" />
          <div className="grid grid-cols-2 gap-12">
            <div className="aspect-square bg-[#e8dfce] rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-[#e8dfce] w-1/3 rounded" />
              <div className="h-8 bg-[#e8dfce] w-3/4 rounded" />
              <div className="h-6 bg-[#e8dfce] w-1/4 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#f8f5ef]">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-40 pb-24 text-center">
          <h1 className="font-display text-4xl text-[#1a3d2b] mb-4">Equipo no encontrado</h1>
          <p className="text-[#5a5a5a] mb-8">Este artículo ya no está disponible.</p>
          <Link href="/equipment" className="inline-flex items-center gap-2 text-[#c9882a] uppercase tracking-widest text-xs font-bold">
            <ArrowLeft className="w-4 h-4" /> Volver al bazar
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef]">
      <Navbar />

      <main className="pt-36 pb-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <Link href="/equipment" className="inline-flex items-center gap-2 text-[#8a8a8a] hover:text-[#c9882a] transition-colors text-sm uppercase tracking-widest mb-10">
            <ArrowLeft className="w-4 h-4" /> Equipamiento
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Image */}
            <div className="relative aspect-square bg-white border border-[#e8dfce] rounded-xl overflow-hidden flex items-center justify-center p-10">
              <img
                src={item.imageUrl || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600"}
                alt={item.title}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              {isVerified && (
                <div className="absolute top-4 left-4 bg-[#c9882a] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wide font-semibold">Bodega Verificada</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div className="text-xs uppercase tracking-widest text-[#8a8a8a] mb-3">
                {item.brand ? `${item.brand} · ` : ""}{item.category}
              </div>

              <h1 className="font-display text-3xl md:text-4xl text-[#1a3d2b] mb-6 leading-tight">
                {item.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="font-display text-3xl text-[#1a3d2b]">{formatCurrency(item.price)}</span>
              </div>

              <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-[#e8dfce]">
                <span className="px-3 py-1 border border-[#e8dfce] text-[#5a5a5a] text-xs uppercase tracking-wider">
                  {item.condition}
                </span>
                {item.size && (
                  <span className="px-3 py-1 border border-[#e8dfce] text-[#5a5a5a] text-xs uppercase tracking-wider">
                    Talla: {item.size}
                  </span>
                )}
                <span className="px-3 py-1 border border-[#e8dfce] text-[#5a5a5a] text-xs uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {item.category}
                </span>
              </div>

              {isVerified && (
                <div className="bg-[#f8f5ef] border border-[#e8dfce] rounded-lg p-5 mb-8">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#c9882a] shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display text-base text-[#1a3d2b] mb-1">Compra Verificada en Bodega</h3>
                      <p className="text-xs text-[#5a5a5a] font-light leading-relaxed">
                        Este artículo ha sido inspeccionado físicamente en nuestra bodega. Garantizamos su estado y autenticidad antes de cada transacción.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-8">
                {["Pago seguro", "Entrega coordinada", "Garantía de 7 días"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-[#5a5a5a]">
                    <CheckCircle2 className="w-4 h-4 text-[#c9882a] shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full py-4 bg-[#1a3d2b] text-[#f8f5ef] uppercase tracking-widest text-sm hover:bg-[#132c1f] transition-colors">
                  Contactar al Vendedor
                </button>
                <button className="w-full py-4 border border-[#1a3d2b] text-[#1a3d2b] uppercase tracking-widest text-sm hover:bg-[#1a3d2b] hover:text-[#f8f5ef] transition-colors">
                  Guardar artículo
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
