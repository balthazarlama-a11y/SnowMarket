import { CheckCircle2, Truck, Building2, Headphones } from "lucide-react";

export function Stats() {
  const stats = [
    {
      icon: CheckCircle2,
      title: "Equipos verificados",
      desc: "Revisados por nuestro equipo",
    },
    {
      icon: Truck,
      title: "Entrega rápida",
      desc: "En RM y zonas de montaña",
    },
    {
      icon: Building2,
      title: "Gestión inmobiliaria",
      desc: "Arrienda deptos en la nieve",
    },
    {
      icon: Headphones,
      title: "Soporte experto",
      desc: "Te acompañamos en cada paso",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
      {stats.map((stat) => (
        <div key={stat.title} className="flex items-start gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100">
            <stat.icon className="size-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 leading-tight">{stat.title}</p>
            <p className="text-xs text-slate-500 leading-tight mt-0.5">{stat.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
