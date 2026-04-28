"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-secondary/50">
        <Image
          key={activeIndex}
          src={images[activeIndex]}
          alt={title}
          fill
          className="object-cover animate-in fade-in duration-150"
          sizes="(max-width: 1024px) 100vw, 60vw"
          quality={80}
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg transition-all sm:size-24",
                "cursor-pointer hover:opacity-80",
                i === activeIndex
                  ? "ring-2 ring-primary ring-offset-2"
                  : "opacity-70 hover:opacity-90"
              )}
            >
              <Image
                src={img}
                alt={`${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
