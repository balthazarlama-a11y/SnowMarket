import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mountain, ShoppingBag, Building2, LayoutDashboard, Package, PlusCircle, Heart, UserPlus, Snowflake } from "lucide-react";
import { SignOutButton } from "./SignOutButton";
import { MobileNav } from "./MobileNav";

export async function Navbar() {
  const user = await getCurrentUser();
  const isAdmin = user?.app_metadata?.role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80">
          <Mountain className="size-6 text-primary" />
          <span className="font-heading text-xl font-bold tracking-tight text-primary">
            AndesMarket
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" render={<Link href="/productos" />}>
            <ShoppingBag className="size-4" data-icon="inline-start" />
            Esquí
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/snowboard" />}>
            <Snowflake className="size-4" data-icon="inline-start" />
            Snowboard
          </Button>
          <Button variant="ghost" size="sm" render={<Link href="/departamentos" />}>
            <Building2 className="size-4" data-icon="inline-start" />
            Departamentos
          </Button>
        </div>

        <div className="hidden ml-auto shrink-0 items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors" render={<Link href="/favoritos" />}>
            <Heart className="size-5" />
          </Button>
          {user ? (
            <>
              <Button
                size="sm"
                className="gap-1.5 bg-orange-500 text-white hover:bg-orange-600"
                render={<Link href="/mis-productos/nuevo" />}
              >
                <PlusCircle className="size-4" data-icon="inline-start" />
                Publicar
              </Button>
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
            <div className="flex items-center gap-3">
              <Link
                href="/auth/sign-in"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Iniciar sesión
              </Link>
              <Button
                size="sm"
                className="gap-1.5 bg-orange-500 text-white hover:bg-orange-600"
                render={<Link href="/auth/sign-up" />}
              >
                <UserPlus className="size-4" data-icon="inline-start" />
                Registrarse
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-1 justify-end md:hidden">
          <MobileNav user={user} isAdmin={isAdmin} />
        </div>
      </nav>
    </header>
  );
}
