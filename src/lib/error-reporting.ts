/**
 * Relato de erros de runtime no cliente. Encaminha para o console; ponto único
 * caso queira plugar um serviço de observabilidade (Sentry, etc.) no futuro.
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[app] runtime error", error, context);
}
