import Image from "next/image";

interface MiniProductCardProps {
  name: string;
  price: string;
  image: string;
}

export function MiniProductCard({ name, price, image }: MiniProductCardProps) {
  return (
    <div className="flex flex-col rounded-lg bg-white p-1.5 shadow-xl shadow-black/8 ring-1 ring-black/5 min-w-[100px] flex-1 transition-transform hover:-translate-y-0.5">
      <div className="relative aspect-square w-full rounded-md overflow-hidden bg-slate-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="140px"
        />
      </div>
      <div className="pt-1.5 px-0.5 pb-0.5">
        <p className="text-[10px] font-semibold text-slate-800 truncate leading-tight">{name}</p>
        <p className="text-[11px] font-bold text-slate-900 mt-0.5">{price}</p>
      </div>
    </div>
  );
}
