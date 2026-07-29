import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { MessagingContext } from "./messagingContextInstance";
import { CONVERSATIONS } from "../../constants/conversations";

interface MessagingProviderProps {
  children: ReactNode;
}

// Sur mobile, le clic de compatibilité que certains navigateurs
// synthétisent juste après un tap tactile peut atterrir sur l'overlay qui
// vient de s'afficher et refermer la messagerie aussitôt ouverte. On ignore
// les demandes de fermeture survenant dans cette fenêtre après l'ouverture.
const GHOST_CLICK_GUARD_MS = 500;

export function MessagingProvider({ children }: MessagingProviderProps) {
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [unreadConversationIds, setUnreadConversationIds] = useState<
    string[]
  >(() => CONVERSATIONS.filter((c) => c.unread).map((c) => c.id));
  const openedAtRef = useRef(0);

  const openMessaging = useCallback(() => {
    openedAtRef.current = Date.now();
    setActiveConversationId(null);
    setIsMessagingOpen(true);
  }, []);

  const openConversation = useCallback((conversationId: string) => {
    openedAtRef.current = Date.now();
    setActiveConversationId(conversationId);
    setIsMessagingOpen(true);
    setUnreadConversationIds((prev) =>
      prev.filter((id) => id !== conversationId)
    );
  }, []);

  const goToConversationList = useCallback(
    () => setActiveConversationId(null),
    []
  );

  const closeMessaging = useCallback(() => {
    if (Date.now() - openedAtRef.current < GHOST_CLICK_GUARD_MS) return;
    setIsMessagingOpen(false);
  }, []);

  const toggleMessaging = useCallback(
    () => setIsMessagingOpen((prev) => !prev),
    []
  );

  const setConversationUnread = useCallback(
    (conversationId: string, unread: boolean) => {
      setUnreadConversationIds((prev) => {
        const withoutId = prev.filter((id) => id !== conversationId);
        return unread ? [...withoutId, conversationId] : withoutId;
      });
    },
    []
  );

  // Sans ce useMemo, chaque render de MessagingProvider (donc de tout /app,
  // vu sa position dans l'arbre) recréerait cet objet et re-render tous les
  // consommateurs de useMessaging(), même ceux dont l'état suivi n'a pas changé.
  const value = useMemo(
    () => ({
      isMessagingOpen,
      activeConversationId,
      unreadConversationIds,
      openMessaging,
      openConversation,
      goToConversationList,
      closeMessaging,
      toggleMessaging,
      setConversationUnread,
    }),
    [
      isMessagingOpen,
      activeConversationId,
      unreadConversationIds,
      openMessaging,
      openConversation,
      goToConversationList,
      closeMessaging,
      toggleMessaging,
      setConversationUnread,
    ]
  );

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}
