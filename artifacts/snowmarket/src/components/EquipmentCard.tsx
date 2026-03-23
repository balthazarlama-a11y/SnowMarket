import { Link } from "wouter";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Equipment } from "@workspace/api-client-react";

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const isVerified = equipment.purchaseType === "verified_warehouse" || equipment.purchaseType === "verified";

  return (
    <Link
      href={`/equipment/${equipment.id}`}
      className="group border border-[#d8e8f4] bg-[#f4f8fc]/50 rounded-xl overflow-hidden hover:shadow-[0_10px_30px_rgba(26,61,43,0.08)] transition-all duration-500 flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-white p-6 border-b border-[#d8e8f4]">
        <img
          src={equipment.imageUrl || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop"}
          alt={equipment.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
        />
        {isVerified && (
          <div
            className="absolute top-3 left-3 bg-[#3b9fd6] text-white p-1.5 rounded-full shadow-md"
            title="Compra Verificada en Bodega"
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="text-[10px] uppercase tracking-widest text-[#6e8fa6] mb-2">
          {equipment.brand ? `${equipment.brand} · ` : ""}{equipment.category}
        </div>

        <h3 className="font-display text-lg text-[#0d2137] mb-4 line-clamp-2 leading-snug group-hover:text-[#3b9fd6] transition-colors">
          {equipment.title}
        </h3>

        <div className="text-sm text-[#3f5d75] mb-4 pb-4 border-b border-[#d8e8f4]/60">
          <span className="italic">{equipment.condition}</span>
          {equipment.size && (
            <span className="ml-2 not-italic text-[#6e8fa6]">· Talla {equipment.size}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="font-display text-lg text-[#0d2137]">
            {formatCurrency(equipment.price)}
          </div>
          <span className="text-[#3b9fd6] group-hover:text-[#0d2137] transition-colors">
            <ArrowRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
