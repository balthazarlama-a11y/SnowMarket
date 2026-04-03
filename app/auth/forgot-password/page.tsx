"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mountain, Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await requestPasswordReset(formData);
    if (result.success) {
      setSent(true);
    } else {
      setError(result.error);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Mountain className="size-6 text-primary" />
          </div>
          <CardTitle className="font-heading text-2xl">
            Recuperar contraseña
          </CardTitle>
          <CardDescription>
            Te enviaremos un enlace para elegir una nueva contraseña.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-green-800">
                Revisa tu correo
              </h3>
              <p className="text-sm text-green-800/90">
                Si existe una cuenta asociada a ese email, recibirás un enlace
                para restablecer tu contraseña. El enlace caduca en poco tiempo
                por seguridad.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                render={<Link href="/auth/sign-in" />}
              >
                Volver al inicio de sesión
              </Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                  />
                  {fieldErrors.email?.[0] && (
                    <p id="email-error" className="text-sm text-destructive">
                      {fieldErrors.email[0]}
                    </p>
                  )}
                </div>

                {error && (
                  <div
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Mail className="size-4" data-icon="inline-start" />
                  )}
                  {loading ? "Enviando..." : "Enviar enlace"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center justify-center gap-1 font-medium text-primary hover:underline"
                >
                  <ArrowLeft className="size-3.5" />
                  Volver a iniciar sesión
                </Link>
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
