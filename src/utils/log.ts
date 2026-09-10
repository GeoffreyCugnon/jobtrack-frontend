/**
 * Journalisation d'erreur centralisée. Aujourd'hui : `console.error` en dev
 * uniquement (silencieux en build de prod). Point d'accroche unique si on
 * branche un jour un service type Sentry — ne pas remettre de `console.*`
 * dispersés dans les `catch`.
 */
export function logError(context: string, error: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}
