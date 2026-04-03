export const PASSWORD_RECOVERY_PATH = "/auth/update-password";

// Temporary cookies used only during password recovery flow.
export const RECOVERY_ACCESS_TOKEN_COOKIE = "am-recovery-at";
export const RECOVERY_REFRESH_TOKEN_COOKIE = "am-recovery-rt";

export const RECOVERY_ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;
export const RECOVERY_REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60;

export function isPasswordRecoveryPath(path: string): boolean {
  return (
    path === PASSWORD_RECOVERY_PATH ||
    path.startsWith(`${PASSWORD_RECOVERY_PATH}?`)
  );
}
