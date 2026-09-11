import axios from "axios";

/**
 * Message d'erreur le plus utile à afficher pour une erreur 4xx : celui
 * renvoyé par le Backend (`http.filter.ts` le normalise toujours en string,
 * y compris pour les tableaux de messages de validation du `ValidationPipe`
 * global) — sinon `fallback`.
 */
export function getBackendErrorMessage(error: unknown, fallback: string): string {
  if (
    axios.isAxiosError(error) &&
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500
  ) {
    const message = (error.response.data as { message?: string } | undefined)
      ?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return fallback;
}
