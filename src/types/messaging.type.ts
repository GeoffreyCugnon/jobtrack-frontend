// src/types/messaging.type.ts

/**
 * Conversation one-to-one telle que renvoyée par le micro-service de
 * messagerie (MS-Messagerie, `GET/POST /conversations`).
 */
export interface MessagingConversationDto {
  id: string;
  userAId: string;
  userBId: string;
  lastMessageAt: string | null;
  createdAt: string;
  /** Messages reçus (pas envoyés par l'appelant) encore non lus. */
  unreadCount: number;
  metadata?: Record<string, unknown> | null;
}

/** Message tel que renvoyé par MS-Messagerie. */
export interface MessagingMessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
}

/** Page de messages paginée par curseur (`GET /conversations/:id/messages`). */
export interface MessagingMessagePageDto {
  items: MessagingMessageDto[];
  nextCursor: string | null;
}

/** Message affiché dans le fil d'une conversation (composants Messaging). */
export interface ConversationMessage {
  id: string;
  from: "me" | "them";
  text: string;
  /** Heure formatée (`formatConversationTime`) affichée dans l'en-tête d'auteur. */
  time: string;
}

/**
 * Conversation telle que consommée par les composants Messaging (liste +
 * fil). Construite par `MessagingProvider` à partir de `MessagingConversationDto`
 * (MS-Messagerie) enrichi du profil du participant (Backend JobTrack, via
 * `UserApi.getById`).
 */
export interface Conversation {
  id: string;
  /** Id (Backend JobTrack) de l'autre participant — sert à envoyer/relire. */
  participantId: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  /** Décompte exact des messages reçus non lus (fourni par MS-Messagerie). */
  unreadCount?: number;
  // Logo d'entreprise ou photo réelle, quand disponible ; sinon fallback
  // dégradé + initiale (cf. composant Avatar).
  avatarUrl?: string;
  /**
   * L'autre participant est connecté (présence temps réel de MS-Messagerie,
   * événements WebSocket `presence` / `presence:snapshot`). `undefined` tant
   * qu'aucun snapshot n'a été reçu.
   */
  online?: boolean;
  messages: ConversationMessage[];
}

/**
 * Nombre de messages reçus non lus dans une conversation. Source de vérité :
 * `conversation.unreadCount` renvoyé par MS-Messagerie (`GET /conversations`).
 * Repli (si le champ manque, ex. objet construit autrement) : la série
 * ininterrompue de messages entrants (`from: "them"`) en fin de fil.
 */
export function unreadMessageCount(conversation: Conversation): number {
  if (typeof conversation.unreadCount === "number") {
    return conversation.unreadCount;
  }
  let count = 0;
  for (let i = conversation.messages.length - 1; i >= 0; i--) {
    if (conversation.messages[i].from !== "them") break;
    count++;
  }
  return count;
}
