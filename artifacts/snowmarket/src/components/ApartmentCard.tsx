import { Link } from "wouter";
import { Star, MapPin, Users, BedDouble, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Apartment } from "@workspace/api-client-react";

interface ApartmentCardProps {
  apartment: Apartment;
}

export function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <Link 
      href={`/apartments/${apartment.id}`}
      className="group block bg-card rounded-3xl overflow-hidden border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* fallback to unsplash if no image url provided by API */}
        <img 
          src={apartment.imageUrl || "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&h=600&fit=crop"} 
          alt={apartment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {apartment.verified && (
            <div className="bg-white/95 backdrop-blur shadow-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-blue-100">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900">Verificado</span>
            </div>
          )}
        </div>
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold">{apartment.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({apartment.reviewCount})</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium mb-2">
          <MapPin className="w-4 h-4 text-primary" />
          {apartment.resort}, {apartment.location}
        </div>
        
        <h3 className="font-display font-bold text-xl text-foreground mb-4 line-clamp-1 group-hover:text-primary transition-colors">
          {apartment.title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4" />
            {apartment.bedrooms} hab.
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Max {apartment.maxGuests}
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="font-display font-bold text-2xl text-foreground">
              {formatCurrency(apartment.pricePerNight)}
            </span>
            <span className="text-sm text-muted-foreground"> /noche</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="sr-only">Ver detalle</span>
            &rarr;
          </div>
        </div>
      </div>
    </Link>
  );
}
