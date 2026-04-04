"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  clearPasswordRecoverySession,
  preparePasswordRecoveryFromLink,
  setPasswordRecoverySessionFromTokens,
} from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { UpdatePasswordForm } from "./UpdatePasswordForm";
import { Loader2, TriangleAlert, ShieldCheck } from "lucide-react";

type RecoveryFlowProps = {
  hasServerSession: boolean;
  initialErrorCode?: string;
  initialError?: string;
  initialErrorDescription?: string;
  initialCode?: string;
  initialTokenHash?: string;
  initialType?: string;
};

type RecoveryUiState = "loading" | "ready" | "expired" | "invalid" | "error";

function normalizeParam(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function RecoveryFlow({
  hasServerSession,
  initialErrorCode,
  initialError,
  initialErrorDescription,
  initialCode,
  initialTokenHash,
  initialType,
}: RecoveryFlowProps) {
  const router = useRouter();
  const [status, setStatus] = useState<RecoveryUiState>(
    hasServerSession ? "ready" : "loading"
  );
  const [message, setMessage] = useState<string>("");

  const initialState = useMemo(
    () => ({
      errorCode: normalizeParam(initialErrorCode),
      error: normalizeParam(initialError),
      errorDescription: normalizeParam(initialErrorDescription),
      code: normalizeParam(initialCode),
      tokenHash: normalizeParam(initialTokenHash),
      type: normalizeParam(initialType),
    }),
    [
      initialCode,
      initialError,
      initialErrorCode,
      initialErrorDescription,
      initialTokenHash,
      initialType,
    ]
  );

  // Guard: ensure the exchange logic runs at most once (React Strict Mode
  // mounts effects twice in dev — a second exchangeCodeForSession with the
  // same single-use code would always fail).
  const bootstrapRan = useRef(false);

  useEffect(() => {
    let disposed = false;

    async function bootstrapRecovery() {
      if (hasServerSession) {
        if (!disposed) setStatus("ready");
        return;
      }

      const url = new URL(window.location.href);
      const query = url.searchParams;
      const hash = new URLSearchParams(url.hash.startsWith("#") ? url.hash.slice(1) : "");

      const initialFromUrlKey: Record<string, keyof typeof initialState> = {
        error_code: "errorCode",
        error_description: "errorDescription",
        error: "error",
        code: "code",
        token_hash: "tokenHash",
        type: "type",
      };

      const read = (key: string) => {
        const fromHash = normalizeParam(hash.get(key));
        const fromQuery = normalizeParam(query.get(key));
        const ik = initialFromUrlKey[key];
        const fromInitial = ik ? initialState[ik] : undefined;
        return fromHash ?? fromQuery ?? fromInitial;
      };

      const errorCode = read("error_code") ?? initialState.errorCode;
      const error = read("error") ?? initialState.error;
      const errorDescription = read("error_description") ?? initialState.errorDescription;
      const accessToken = read("access_token");
      const refreshToken = read("refresh_token");
      const type = read("type") ?? initialState.type;
      const code = read("code") ?? initialState.code;
      const tokenHash = read("token_hash") ?? initialState.tokenHash;

      const cleanUrl = () => {
        window.history.replaceState({}, "", "/auth/update-password");
      };

      if (errorCode === "otp_expired") {
        await clearPasswordRecoverySession();
        cleanUrl();
        if (!disposed) {
          setStatus("expired");
          setMessage(
            "El enlace de recuperacion vencio o ya fue utilizado. Solicita uno nuevo para continuar."
          );
        }
        return;
      }

      if (error) {
        await clearPasswordRecoverySession();
        cleanUrl();
        if (!disposed) {
          setStatus("invalid");
          setMessage(
            errorDescription ||
              "No se pudo validar el enlace de recuperacion. Solicita uno nuevo e intenta otra vez."
          );
        }
        return;
      }

      // ── PKCE code: delegate to /auth/callback (single exchange point) ──
      // The code is single-use; exchanging it here risks double-consumption
      // (Strict Mode, bridge re-navigation, prefetch bots).  Hard-navigate
      // to the callback Route Handler which exchanges server-side and sets
      // recovery cookies before redirecting back here.
      if (code) {
        const callbackUrl =
          `/auth/callback?code=${encodeURIComponent(code)}` +
          `&next=${encodeURIComponent("/auth/update-password")}`;
        window.location.replace(callbackUrl);
        return; // navigation in progress — stop processing
      }

      if (accessToken && refreshToken) {
        const result = await setPasswordRecoverySessionFromTokens({
          accessToken,
          refreshToken,
          type,
        });

        if (!result.success) {
          await clearPasswordRecoverySession();
          cleanUrl();
          if (!disposed) {
            if (result.reason === "otp_expired") {
              setStatus("expired");
            } else if (result.reason === "invalid_link") {
              setStatus("invalid");
            } else {
              setStatus("error");
            }
            setMessage(result.error);
          }
          return;
        }

        cleanUrl();
        router.refresh();
        if (!disposed) setStatus("ready");
        return;
      }

      if (tokenHash) {
        const result = await preparePasswordRecoveryFromLink({
          tokenHash,
          type,
        });

        if (!result.success) {
          await clearPasswordRecoverySession();
          cleanUrl();
          if (!disposed) {
            if (result.reason === "otp_expired") {
              setStatus("expired");
            } else if (result.reason === "invalid_link") {
              setStatus("invalid");
            } else {
              setStatus("error");
            }
            setMessage(result.error);
          }
          return;
        }

        cleanUrl();
        router.refresh();
        if (!disposed) setStatus("ready");
        return;
      }

      await clearPasswordRecoverySession();
      if (!disposed) {
        setStatus("invalid");
        setMessage(
          "Este enlace no es valido o ya no tiene una sesion de recuperacion activa."
        );
      }
    }

    // Prevent double execution in React Strict Mode for paths that do
    // irreversible work (token exchange, cookie writes).
    if (bootstrapRan.current) return;
    bootstrapRan.current = true;

    setStatus(hasServerSession ? "ready" : "loading");
    setMessage("");
    void bootstrapRecovery();

    return () => {
      disposed = true;
    };
  }, [hasServerSession, initialState, router]);

  if (status === "ready") {
    return <UpdatePasswordForm />;
  }

  if (status === "loading") {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          Validando enlace de recuperacion...
        </p>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
        <p className="flex items-center gap-2 font-medium">
          <TriangleAlert className="size-4" />
          Enlace vencido o ya usado
        </p>
        <p>{message}</p>
        <Button className="w-full" render={<Link href="/auth/forgot-password" />}>
          Solicitar nuevo enlace
        </Button>
        <Button variant="outline" className="w-full" render={<Link href="/auth/sign-in" />}>
          Ir a iniciar sesion
        </Button>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
        <p className="flex items-center gap-2 font-medium">
          <TriangleAlert className="size-4" />
          Enlace invalido
        </p>
        <p>{message}</p>
        <Button className="w-full" render={<Link href="/auth/forgot-password" />}>
          Solicitar nuevo enlace
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
      <p className="flex items-center gap-2 font-medium">
        <ShieldCheck className="size-4" />
        Error tecnico de recuperacion
      </p>
      <p className="mt-2">
        {message ||
          "No se pudo preparar la recuperacion. Revisa la configuracion de Site URL y Redirect URLs en Supabase y solicita un nuevo enlace."}
      </p>
      <Button className="w-full" render={<Link href="/auth/forgot-password" />}>
        Solicitar nuevo enlace
      </Button>
    </div>
  );
}
