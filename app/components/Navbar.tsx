import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mountain, LayoutDashboard, Package, PlusCircle, Heart, UserPlus } from "lucide-react";
import { SignOutButton } from "./SignOutButton";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export async function Navbar() {
  const user = await getCurrentUser();
  const isAdmin = user?.app_metadata?.role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Orange accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600" />

      {/* Main nav */}
      <div className="border-b border-slate-200 bg-white">
        <nav className="mx-auto grid h-14 max-w-7xl grid-cols-3 items-center px-4 sm:px-6 lg:px-8">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Mountain className="size-5 text-primary" />
            <span className="font-heading text-lg font-bold tracking-tight text-primary">
              AndesMarket
            </span>
          </Link>

          {/* Center: Nav links (client component for active state) */}
          <div className="flex justify-center">
            <NavLinks />
          </div>

          {/* Right: Auth actions + Mobile trigger */}
          <div className="flex items-center justify-end gap-2">
            {/* Desktop auth */}
            <div className="hidden items-center gap-2 md:flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                render={<Link href="/favoritos" />}
              >
                <Heart className="size-4" />
              </Button>

              {user ? (
                <>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-[#e8622c] text-white hover:bg-[#d4561f]"
                    render={<Link href="/mis-productos/nuevo" />}
                  >
                    <PlusCircle className="size-3.5" data-icon="inline-start" />
                    Publicar
                  </Button>
                  <Button variant="ghost" size="sm" render={<Link href="/mis-productos" />}>
                    <Package className="size-3.5" data-icon="inline-start" />
                    Mis Productos
                  </Button>
                  {isAdmin && (
                    <Button variant="secondary" size="sm" render={<Link href="/dashboard" />}>
                      <LayoutDashboard className="size-3.5" data-icon="inline-start" />
                      Admin
                    </Button>
                  )}
                  <Separator orientation="vertical" className="mx-1 h-5" />
                  <span className="max-w-[140px] truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    render={<Link href="/auth/sign-in" />}
                  >
                    Iniciar sesión
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 rounded-lg bg-[#e8622c] text-white hover:bg-[#d4561f]"
                    render={<Link href="/auth/sign-up" />}
                  >
                    <UserPlus className="size-3.5" data-icon="inline-start" />
                    Registrarse
                  </Button>
                </>
              )}
            </div>

            {/* Mobile nav trigger (MobileNav has md:hidden internally) */}
            <MobileNav user={user} isAdmin={isAdmin} />
          </div>
        </nav>
      </div>
    </header>
  );
}
