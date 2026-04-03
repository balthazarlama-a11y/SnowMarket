"use client";

import { useState, type FormEvent } from "react";
import { updatePassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, KeyRound } from "lucide-react";

export function UpdatePasswordForm() {
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);
    if (!result.success) {
      setError(result.error);
      if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      setLoading(false);
    }
    /* redirect en éxito desde la server action */
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Minimo 8 caracteres"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? "password-error" : undefined
          }
        />
        {fieldErrors.password?.[0] && (
          <p id="password-error" className="text-sm text-destructive">
            {fieldErrors.password[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Repite la contraseña"
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
          aria-describedby={
            fieldErrors.confirmPassword ? "confirm-error" : undefined
          }
        />
        {fieldErrors.confirmPassword?.[0] && (
          <p id="confirm-error" className="text-sm text-destructive">
            {fieldErrors.confirmPassword[0]}
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

      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <KeyRound className="size-4" data-icon="inline-start" />
        )}
        {loading ? "Guardando..." : "Guardar nueva contraseña"}
      </Button>
    </form>
  );
}
