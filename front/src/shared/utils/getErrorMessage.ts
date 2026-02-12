export function getErrorMessage(error: unknown): string | undefined {
  return typeof error === "string" ? error : undefined;
}