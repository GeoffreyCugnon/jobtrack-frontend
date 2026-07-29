import { createContext } from "react";

export interface MessagingContextType {
  isMessagingOpen: boolean;
  activeConversationId: string | null;
  unreadConversationIds: string[];
  openMessaging: () => void;
  openConversation: (conversationId: string) => void;
  goToConversationList: () => void;
  closeMessaging: () => void;
  toggleMessaging: () => void;
  setConversationUnread: (conversationId: string, unread: boolean) => void;
}

export const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined,
);
