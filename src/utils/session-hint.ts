// Indice non sensible (le vrai refresh token est un cookie httpOnly, illisible
// ici) : sert uniquement à savoir s'il vaut la peine de tenter un
// `AuthApi.refresh()` au démarrage. Évite un appel + un 401 pour tout visiteur
// qui ne s'est jamais connecté (ou qui s'est déconnecté).
const KEY = "jt_session";

export function markSessionHint(): void {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // localStorage indisponible (mode privé strict, quota...) : tant pis,
    // on retombera sur une tentative de refresh à chaque boot.
  }
}

export function clearSessionHint(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function hasSessionHint(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return true; // en cas de doute, on tente le refresh
  }
}
