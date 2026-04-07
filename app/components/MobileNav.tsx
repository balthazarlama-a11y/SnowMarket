"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Menu,
  Mountain,
  ShoppingBag,
  Building2,
  LayoutGrid,
  LayoutDashboard,
  Package,
  LogIn,
  LogOut,
  PlusCircle,
  UserPlus,
} from "lucide-react";
import { signOut } from "@/actions/auth";
import type { User } from "@supabase/supabase-js";
import { useState } from "react";

interface MobileNavProps {
  user: User | null;
  isAdmin: boolean;
}

export function MobileNav({ user, isAdmin }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon-sm" className="md:hidden" />
          }
        >
          <Menu className="size-5" />
          <span className="sr-only">Menú</span>
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Mountain className="size-5 text-primary" />
              AndesMarket
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-1 px-4">
            <Button
              className="justify-start gap-1.5 bg-orange-500 text-white hover:bg-orange-600"
              render={<Link href={user ? "/mis-productos/nuevo" : "/auth/sign-up"} />}
              onClick={() => setOpen(false)}
            >
              {user ? (
                <PlusCircle className="size-4" data-icon="inline-start" />
              ) : (
                <UserPlus className="size-4" data-icon="inline-start" />
              )}
              {user ? "Publicar Equipo" : "Registrarse"}
            </Button>
            <Separator className="my-2" />
            <Button variant="ghost" className="justify-start" render={<Link href="/productos" />} onClick={() => setOpen(false)}>
              <ShoppingBag className="size-4" data-icon="inline-start" />
              Productos
            </Button>
            <Button variant="ghost" className="justify-start" render={<Link href="/categorias" />} onClick={() => setOpen(false)}>
              <LayoutGrid className="size-4" data-icon="inline-start" />
              Categorías
            </Button>
            <Button variant="ghost" className="justify-start" render={<Link href="/departamentos" />} onClick={() => setOpen(false)}>
              <Building2 className="size-4" data-icon="inline-start" />
              Departamentos
            </Button>

            {user && (
              <>
                <Separator className="my-2" />
                <Button variant="ghost" className="justify-start" render={<Link href="/mis-productos" />} onClick={() => setOpen(false)}>
                  <Package className="size-4" data-icon="inline-start" />
                  Mis Productos
                </Button>
                {isAdmin && (
                  <Button variant="secondary" className="justify-start" render={<Link href="/dashboard" />} onClick={() => setOpen(false)}>
                    <LayoutDashboard className="size-4" data-icon="inline-start" />
                    Panel Admin
                  </Button>
                )}
              </>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-2 border-t px-4 pt-4 pb-6">
            {user ? (
              <>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className="size-4" data-icon="inline-start" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button className="w-full" render={<Link href="/auth/sign-in" />} onClick={() => setOpen(false)}>
                <LogIn className="size-4" data-icon="inline-start" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
