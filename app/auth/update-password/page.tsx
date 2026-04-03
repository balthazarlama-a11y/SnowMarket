import Link from "next/link";
import { getCurrentUser } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mountain } from "lucide-react";
import { UpdatePasswordForm } from "./UpdatePasswordForm";

export default async function UpdatePasswordPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Mountain className="size-6 text-primary" />
          </div>
          <CardTitle className="font-heading text-2xl">
            Nueva contraseña
          </CardTitle>
          <CardDescription>
            {user
              ? "Elige una contraseña segura para tu cuenta."
              : "Necesitas abrir el enlace que enviamos a tu correo."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <UpdatePasswordForm />
          ) : (
            <div className="space-y-4 text-center text-sm text-muted-foreground">
              <p>
                Este enlace puede haber expirado o ya fue usado. Solicita uno
                nuevo desde la pantalla de inicio de sesión.
              </p>
              <Button className="w-full" render={<Link href="/auth/forgot-password" />}>
                Solicitar nuevo enlace
              </Button>
              <Button
                variant="outline"
                className="w-full"
                render={<Link href="/auth/sign-in" />}
              >
                Ir a iniciar sesión
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
