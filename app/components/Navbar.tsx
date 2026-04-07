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
        <nav className="mx-auto flex min-h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
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

          {/* Center: Nav links — fill available space */}
          <div className="hidden min-w-0 flex-1 justify-center md:flex">
            <NavLinks />
          </div>

          {/* Right: Auth actions + Mobile trigger */}
          <div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
            {/* Desktop auth */}
            <div className="hidden items-center gap-1.5 md:flex lg:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                render={<Link href="/favoritos" />}
              >
                <Heart className="size-4" />
                <span className="sr-only">Favoritos</span>
              </Button>

              {user ? (
                <>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-[#e8622c] text-white hover:bg-[#d4561f]"
                    render={<Link href="/mis-productos/nuevo" />}
                  >
                    <PlusCircle className="size-3.5" data-icon="inline-start" />
                    <span className="hidden lg:inline">Publicar</span>
                    <span className="sr-only lg:hidden">Publicar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden lg:inline-flex"
                    render={<Link href="/mis-productos" />}
                  >
                    <Package className="size-3.5" data-icon="inline-start" />
                    Mis Productos
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="hidden lg:inline-flex"
                      render={<Link href="/dashboard" />}
                    >
                      <LayoutDashboard className="size-3.5" data-icon="inline-start" />
                      Admin
                    </Button>
                  )}
                  <Separator orientation="vertical" className="mx-0.5 hidden h-5 xl:block" />
                  <span className="hidden max-w-[140px] truncate text-xs text-muted-foreground xl:inline">
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
                    <span className="hidden lg:inline">Registrarse</span>
                    <span className="sr-only lg:hidden">Registrarse</span>
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
