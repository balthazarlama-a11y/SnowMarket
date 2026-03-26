import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mountain, ShoppingBag, Building2, LayoutDashboard, Package, LogIn, PlusCircle } from "lucide-react";
import { SignOutButton } from "./SignOutButton";
import { MobileNav } from "./MobileNav";
import { SearchBar } from "./SearchBar";

export async function Navbar() {
  const user = await getCurrentUser();
  const isAdmin = user?.app_metadata?.role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80">
          <Mountain className="size-6 text-primary" />
          <span className="font-heading text-xl font-bold tracking-tight text-primary">
            SnowMarket
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" render={<Link href="/productos" />}>
            <ShoppingBag className="size-4" data-icon="inline-start" />
            Productos
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/departamentos" />}>
            <Building2 className="size-4" data-icon="inline-start" />
            Departamentos
          </Button>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBar />
        </div>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <Button
            size="sm"
            className="gap-1.5 bg-orange-500 text-white hover:bg-orange-600"
            render={<Link href={user ? "/mis-productos/nuevo" : "/auth/sign-in"} />}
          >
            <PlusCircle className="size-4" data-icon="inline-start" />
            Publicar Equipo
          </Button>
          {user ? (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/mis-productos" />}>
                <Package className="size-4" data-icon="inline-start" />
                Mis Productos
              </Button>
              {isAdmin && (
                <Button variant="secondary" size="sm" render={<Link href="/dashboard" />}>
                  <LayoutDashboard className="size-4" data-icon="inline-start" />
                  Admin
                </Button>
              )}
              <Separator orientation="vertical" className="mx-1 h-6" />
              <span className="max-w-[160px] truncate text-xs text-muted-foreground">
                {user.email}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Button size="sm" render={<Link href="/auth/sign-in" />}>
              <LogIn className="size-4" data-icon="inline-start" />
              Iniciar Sesión
            </Button>
          )}
        </div>

        <div className="flex flex-1 justify-end md:hidden">
          <MobileNav user={user} isAdmin={isAdmin} />
        </div>
      </nav>
    </header>
  );
}
