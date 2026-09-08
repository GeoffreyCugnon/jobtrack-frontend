import { createContext } from "react";
import type { Conversation } from "../../types/messaging.type";

export interface MessagingContextType {
  isMessagingOpen: boolean;
  activeConversationId: string | null;
  unreadConversationIds: string[];
  /** Conversations de l'utilisateur (aperçu), enrichies du profil du participant. */
  conversations: Conversation[];
  isLoadingConversations: boolean;
  openMessaging: () => void;
  openConversation: (conversationId: string) => void;
  goToConversationList: () => void;
  closeMessaging: () => void;
  toggleMessaging: () => void;
  /**
   * `unread: true` est une surcharge locale (MS-Messagerie ne supporte pas
   * "marquer non lu") ; `unread: false` marque réellement le dernier message
   * comme lu côté micro-service.
   */
  setConversationUnread: (conversationId: string, unread: boolean) => void;
  /** Envoie un message (WebSocket si connecté, sinon fallback REST). */
  sendMessage: (conversationId: string, text: string) => void;
  /** Ouvre (ou récupère) la conversation avec `participantId`. Renvoie son id. */
  startConversation: (participantId: string) => Promise<string>;
}

export const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined,
);
