import { MiniProductCard } from "./MiniProductCard";

export function HeroRight() {
  return (
    <div className="relative flex items-end justify-center h-full min-h-[400px]">
      {/* 3 floating product cards aligned to bottom, same level as stats */}
      <div className="flex gap-2.5 w-full max-w-[400px]">
        <MiniProductCard
          name="Casco Oakley MOD"
          price="$21.000"
          image="/images/casco.png"
        />
        <MiniProductCard
          name="Botas Salomon QPro"
          price="$30.000"
          image="/images/botas.png"
        />
        <MiniProductCard
          name="Esquís Rossignol"
          price="$300.000"
          image="/images/esquis.png"
        />
      </div>
    </div>
  );
}
