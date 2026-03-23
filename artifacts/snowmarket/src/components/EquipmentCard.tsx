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
      className="group border border-[#e8dfce] bg-[#f8f5ef]/50 rounded-xl overflow-hidden hover:shadow-[0_10px_30px_rgba(26,61,43,0.08)] transition-all duration-500 flex flex-col"
    >
      <div className="relative aspect-square overflow-hidden bg-white p-6 border-b border-[#e8dfce]">
        <img
          src={equipment.imageUrl || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop"}
          alt={equipment.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
        />
        {isVerified && (
          <div
            className="absolute top-3 left-3 bg-[#c9882a] text-white p-1.5 rounded-full shadow-md"
            title="Compra Verificada en Bodega"
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="text-[10px] uppercase tracking-widest text-[#8a8a8a] mb-2">
          {equipment.brand ? `${equipment.brand} · ` : ""}{equipment.category}
        </div>

        <h3 className="font-display text-lg text-[#1a3d2b] mb-4 line-clamp-2 leading-snug group-hover:text-[#c9882a] transition-colors">
          {equipment.title}
        </h3>

        <div className="text-sm text-[#5a5a5a] mb-4 pb-4 border-b border-[#e8dfce]/60">
          <span className="italic">{equipment.condition}</span>
          {equipment.size && (
            <span className="ml-2 not-italic text-[#8a8a8a]">· Talla {equipment.size}</span>
          )}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="font-display text-lg text-[#1a3d2b]">
            {formatCurrency(equipment.price)}
          </div>
          <span className="text-[#c9882a] group-hover:text-[#1a3d2b] transition-colors">
            <ArrowRight className="w-5 h-5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
