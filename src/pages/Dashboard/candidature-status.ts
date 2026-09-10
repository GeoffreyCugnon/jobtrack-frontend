// Classe de badge daisyUI par libellé de statut de candidature (renvoyé par
// l'API dans `statusLabel`). « Entretien prévu » / « Acceptée » sont positifs,
// « En attente » neutre, « Refusée » / « Retirée » atténués.
export const CANDIDATURE_STATUS_BADGE_CLASS: Record<string, string> = {
  "Entretien prévu": "badge-success",
  "En attente": "badge-soft",
  Acceptée: "badge-success",
  Refusée: "badge-error",
  Retirée: "badge-ghost",
};
