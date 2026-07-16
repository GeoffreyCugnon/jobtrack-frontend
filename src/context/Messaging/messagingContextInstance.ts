import { createContext } from "react";

export interface MessagingContextType {
  isMessagingOpen: boolean;
  openMessaging: () => void;
  closeMessaging: () => void;
  toggleMessaging: () => void;
}

export const MessagingContext = createContext<MessagingContextType | undefined>(
  undefined,
);
