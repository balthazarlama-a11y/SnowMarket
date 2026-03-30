"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/actions/favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  itemId: string;
  initialIsFavorite: boolean;
  itemType?: "product" | "property";
  className?: string; // Optional custom styling
}

export function FavoriteButton({ itemId, initialIsFavorite, itemType = "product", className }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  async function handleToggle(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation(); // Evitar que hagamos clic en el producto y naveguemos

    if (loading) return;
    setLoading(true);

    // Optimistic UI update
    const previousState = isFavorite;
    setIsFavorite(!previousState);

    const result = await toggleFavorite(itemId, itemType);

    if (!result.success) {
      // Revert if error
      setIsFavorite(previousState);
      toast.error(result.error);
    } else {
      if (!previousState) { // If it was false, it's now liked
        toast.success("Añadido a favoritos", { duration: 1500 });
      }
    }
    
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-full shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed",
        isFavorite
          ? "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
          : "bg-white/80 text-muted-foreground backdrop-blur-sm hover:bg-white hover:text-red-500 dark:bg-black/50 dark:hover:bg-black",
        className
      )}
      aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      <Heart
        className={cn(
          "size-4 transition-transform",
          isFavorite ? "fill-current scale-110" : "scale-100 hover:scale-110"
        )}
      />
    </button>
  );
}
