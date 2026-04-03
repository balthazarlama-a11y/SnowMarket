import { getCurrentUser } from "@/actions/auth";
import {
  RECOVERY_ACCESS_TOKEN_COOKIE,
  RECOVERY_REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/password-recovery";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mountain } from "lucide-react";
import { RecoveryFlow } from "./RecoveryFlow";
import { cookies } from "next/headers";

type UpdatePasswordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UpdatePasswordPage({
  searchParams,
}: UpdatePasswordPageProps) {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const hasRecoverySession = Boolean(
    cookieStore.get(RECOVERY_ACCESS_TOKEN_COOKIE)?.value &&
      cookieStore.get(RECOVERY_REFRESH_TOKEN_COOKIE)?.value
  );
  const canUpdatePassword = Boolean(user || hasRecoverySession);

  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  function readParam(key: string): string | undefined {
    const value = resolvedSearchParams?.[key];
    if (typeof value === "string") return value;
    if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    return undefined;
  }

  const initialErrorCode = readParam("error_code");
  const initialError = readParam("error");
  const initialErrorDescription = readParam("error_description");
  const initialCode = readParam("code");
  const initialTokenHash = readParam("token_hash");
  const initialType = readParam("type");

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
            {canUpdatePassword
              ? "Elige una contraseña segura para tu cuenta."
              : "Necesitas abrir el enlace que enviamos a tu correo."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecoveryFlow
            hasServerSession={canUpdatePassword}
            initialErrorCode={initialErrorCode}
            initialError={initialError}
            initialErrorDescription={initialErrorDescription}
            initialCode={initialCode}
            initialTokenHash={initialTokenHash}
            initialType={initialType}
          />
        </CardContent>
      </Card>
    </div>
  );
}
