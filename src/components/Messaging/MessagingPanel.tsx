import { useState } from "react";
import { MessageCircle } from "@/lib/icons";
import { useMessaging } from "../../context/Messaging/useMessaging";
import {
  CONVERSATIONS,
  type Conversation,
  type ConversationMessage,
} from "../../constants/conversations";
import { MessagingOverlay } from "./MessagingOverlay";
import { MessagingHeader } from "./MessagingHeader";
import { ConversationItem } from "./ConversationItem";
import { ConversationThread } from "./ConversationThread";
import { EmptyState } from "../Layout/EmptyState";

function nowLabel(): string {
  return new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessagingPanel() {
  const {
    isMessagingOpen,
    activeConversationId,
    unreadConversationIds,
    openConversation,
    goToConversationList,
    closeMessaging,
    setConversationUnread,
  } = useMessaging();

  // Suppression/archivage : purement local à la liste affichée (pas besoin
  // de le partager ailleurs dans l'app, contrairement à l'état lu/non-lu qui
  // alimente aussi le badge du FAB). "Gérer les conversations"/"Messages
  // archivés" (menu du header) restent des pages à construire séparément —
  // ici on masque juste l'item de cette liste.
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  // Messages envoyés pendant la session : la messagerie n'a pas encore de
  // backend, on les garde en mémoire et on les fusionne au fil mock.
  const [sentByConv, setSentByConv] = useState<
    Record<string, ConversationMessage[]>
  >({});

  const withSent = (conv: Conversation): Conversation => {
    const sent = sentByConv[conv.id];
    if (!sent?.length) return conv;
    const last = sent[sent.length - 1];
    return {
      ...conv,
      messages: [...conv.messages, ...sent],
      lastMessage: last.text,
      time: last.time,
    };
  };

  const visibleConversations = CONVERSATIONS.filter(
    (conv) => !archivedIds.includes(conv.id) && !deletedIds.includes(conv.id),
  ).map(withSent);

  const baseActive = CONVERSATIONS.find(
    (conv) => conv.id === activeConversationId,
  );
  const activeConversation = baseActive ? withSent(baseActive) : undefined;

  const handleArchive = (id: string) => {
    setArchivedIds((prev) => [...prev, id]);
    setConversationUnread(id, false);
  };

  const handleDelete = (id: string) => {
    setDeletedIds((prev) => [...prev, id]);
    setConversationUnread(id, false);
  };

  const handleSend = (text: string) => {
    if (!activeConversationId) return;
    setSentByConv((prev) => {
      const current = prev[activeConversationId] ?? [];
      const lastId =
        current.at(-1)?.id ?? baseActive?.messages.at(-1)?.id ?? 0;
      return {
        ...prev,
        [activeConversationId]: [
          ...current,
          { id: lastId + 1, from: "me", text, time: nowLabel() },
        ],
      };
    });
    setConversationUnread(activeConversationId, false);
  };

  // TODO: ouvrir le flow de composition d'une nouvelle conversation
  // (sélection d'un contact + premier message) — ticket séparé, le flow
  // complet (recherche de contact, etc.) n'existe pas encore.
  const handleNewConversation = () => {};

  return (
    <>
      <MessagingOverlay open={isMessagingOpen} onClose={closeMessaging} />

      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-base-100 border-l border-base-content/10 shadow-xl transition-transform duration-300 flex flex-col ${
          isMessagingOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {activeConversation ? (
          <ConversationThread
            conversation={activeConversation}
            onBack={goToConversationList}
            onClose={closeMessaging}
            onSend={handleSend}
          />
        ) : (
          <>
            <MessagingHeader
              onClose={closeMessaging}
              onNewConversation={handleNewConversation}
            />
            {/* flex-1 (plutôt qu'une hauteur calculée à la main) : le vide
                résiduel quand la liste est courte reste en bas, jamais
                étiré entre les conversations. */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              {visibleConversations.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    icon={MessageCircle}
                    message="Aucune conversation pour l'instant."
                  />
                </div>
              ) : (
                visibleConversations.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    name={conv.name}
                    lastMessage={conv.lastMessage}
                    time={conv.time}
                    avatarUrl={conv.avatarUrl}
                    unread={unreadConversationIds.includes(conv.id)}
                    onClick={() => openConversation(conv.id)}
                    onToggleUnread={() =>
                      setConversationUnread(
                        conv.id,
                        !unreadConversationIds.includes(conv.id),
                      )
                    }
                    onArchive={() => handleArchive(conv.id)}
                    onDelete={() => handleDelete(conv.id)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}
