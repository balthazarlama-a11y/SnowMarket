"use client";

import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <Button variant="ghost" size="sm" onClick={() => signOut()}>
      <LogOut className="size-4" data-icon="inline-start" />
      Salir
    </Button>
  );
}
