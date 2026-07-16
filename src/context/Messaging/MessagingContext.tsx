import { useState, type ReactNode } from "react";
import { MessagingContext } from "./messagingContextInstance";

interface MessagingProviderProps {
  children: ReactNode;
}

export function MessagingProvider({ children }: MessagingProviderProps) {
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const openMessaging = () => setIsMessagingOpen(true);
  const closeMessaging = () => setIsMessagingOpen(false);
  const toggleMessaging = () => setIsMessagingOpen((prev) => !prev);

  return (
    <MessagingContext.Provider
      value={{
        isMessagingOpen,
        openMessaging,
        closeMessaging,
        toggleMessaging,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}
