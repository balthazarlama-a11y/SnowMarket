import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Upload, Snowflake, ArrowRight } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { Stats } from "./Stats";

interface HeroLeftProps {
  isLoggedIn: boolean;
}

export function HeroLeft({ isLoggedIn }: HeroLeftProps) {
  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      {/* Badge */}
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/70 px-3.5 py-1.5">
        <Snowflake className="size-3.5 text-blue-500" />
        <span className="text-xs font-medium text-blue-700 tracking-wide">
          Marketplace Premium de Nieve — Región Metropolitana
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-[3.4rem] font-bold tracking-tight leading-[1.12] text-slate-900">
        Todo el equipamiento
        <br className="hidden sm:block" />
        {" "}que necesitas,
        <br />
        <span className="text-blue-600">en un solo lugar.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-lg">
        Compra, arrienda o vende equipo de nieve con confianza. Verificados, seguros y listos para tu próxima aventura.
      </p>

      {/* Search bar */}
      <SearchBar />

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="bg-[#e8622c] text-white hover:bg-[#d4561f] h-11 min-h-[44px] px-6 text-sm font-semibold gap-2 shadow-lg shadow-orange-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
          render={<Link href="/productos" />}
        >
          <ShoppingBag className="size-4" data-icon="inline-start" />
          Explorar equipos
          <ArrowRight className="size-3.5" data-icon="inline-end" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-11 min-h-[44px] px-6 text-sm font-semibold gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-all hover:-translate-y-0.5"
          render={<Link href={isLoggedIn ? "/mis-productos/nuevo" : "/auth/sign-up"} />}
        >
          <Upload className="size-4" data-icon="inline-start" />
          Vender mi equipo
        </Button>
      </div>

      {/* Stats */}
      <Stats />
    </div>
  );
}
