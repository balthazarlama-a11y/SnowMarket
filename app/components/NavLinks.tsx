"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingBag, Building2, LayoutGrid } from "lucide-react";

const NAV_ITEMS = [
  { href: "/productos", label: "Productos", icon: ShoppingBag },
  { href: "/categorias", label: "Categorías", icon: LayoutGrid },
  { href: "/departamentos", label: "Departamentos", icon: Building2 },
] as const;

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden items-center gap-0.5 md:flex">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm transition-colors lg:px-3.5",
              isActive
                ? "bg-slate-100 font-semibold text-foreground"
                : "font-medium text-muted-foreground hover:bg-slate-50 hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            <span className="hidden lg:inline">{label}</span>
            <span className="sr-only lg:hidden">{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
