import { Link } from "wouter";
import { Star, MapPin, Users, BedDouble, ShieldCheck, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Apartment } from "@workspace/api-client-react";

interface ApartmentCardProps {
  apartment: Apartment;
}

export function ApartmentCard({ apartment }: ApartmentCardProps) {
  return (
    <Link
      href={`/apartments/${apartment.id}`}
      className="group block cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6 shadow-md shadow-[#1a3d2b]/5">
        <img
          src={apartment.imageUrl || "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&h=1000&fit=crop"}
          alt={apartment.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          style={{ filter: "contrast(0.95) saturate(0.85)" }}
        />
        {apartment.verified && (
          <div className="absolute top-4 left-4 bg-[#1a3d2b] text-[#f8f5ef] px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-semibold">Verificado</span>
          </div>
        )}
      </div>

      <div className="px-2">
        <div className="flex items-center gap-2 text-[#c9882a] text-xs uppercase tracking-widest mb-3">
          <MapPin className="w-3.5 h-3.5" />
          {apartment.resort}
          {apartment.location ? `, ${apartment.location}` : ""}
        </div>

        <h3 className="font-display text-2xl text-[#1a3d2b] mb-3 leading-snug group-hover:text-[#c9882a] transition-colors">
          {apartment.title}
        </h3>

        <div className="flex items-center gap-4 text-sm text-[#8a8a8a] mb-5 font-light">
          <div className="flex items-center gap-1.5">
            <BedDouble className="w-4 h-4" />
            {apartment.bedrooms} Hab.
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Hasta {apartment.maxGuests} pers.
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-[#e8dfce]">
          <div className="font-display text-xl text-[#1a3d2b]">
            {formatCurrency(apartment.pricePerNight)}{" "}
            <span className="text-sm font-sans text-[#8a8a8a] italic">/ noche</span>
          </div>
          <div className="flex items-center gap-1 text-[#c9882a]">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm">{Number(apartment.rating).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
