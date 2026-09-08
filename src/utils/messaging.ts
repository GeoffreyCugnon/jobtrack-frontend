// src/utils/messaging.ts

/**
 * Formate un horodatage de message/conversation pour l'affichage dans la
 * messagerie : heure si aujourd'hui, "Hier", jour de la semaine si < 7 jours,
 * date courte sinon. Volontairement simple (pas de dépendance i18n dédiée).
 */
export function formatConversationTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Hier";
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays >= 0 && diffDays < 7) {
    const label = date.toLocaleDateString("fr-FR", { weekday: "long" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}
