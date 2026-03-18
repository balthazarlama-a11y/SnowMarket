import { Link } from "wouter";
import { PackageCheck, Tag } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import type { Equipment } from "@workspace/api-client-react";

interface EquipmentCardProps {
  equipment: Equipment;
}

export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const isBodega = equipment.purchaseType === 'verified';

  return (
    <Link 
      href={`/equipment/${equipment.id}`}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl hover:border-border transition-all duration-300"
    >
      <div className="relative aspect-square bg-secondary/50 p-4 flex items-center justify-center overflow-hidden">
        {/* Fallback to unsplash if missing image */}
        <img 
          src={equipment.imageUrl || "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop"} 
          alt={equipment.title}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out"
        />
        
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isBodega && (
            <div className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-emerald-200">
              <PackageCheck className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold tracking-wide uppercase">Bodega</span>
            </div>
          )}
          <div className={cn(
            "px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase shadow-sm border backdrop-blur-md",
            equipment.condition.toLowerCase() === 'nuevo' 
              ? "bg-blue-50/90 text-blue-700 border-blue-200" 
              : "bg-white/90 text-slate-700 border-slate-200"
          )}>
            {equipment.condition}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {equipment.brand}
          </span>
          {equipment.size && (
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              Talla: {equipment.size}
            </span>
          )}
        </div>
        
        <h3 className="font-display font-bold text-lg leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
          {equipment.title}
        </h3>
        
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div className="font-display font-bold text-xl">
            {formatCurrency(equipment.price)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Tag className="w-3 h-3" />
            {equipment.category}
          </div>
        </div>
      </div>
    </Link>
  );
}
