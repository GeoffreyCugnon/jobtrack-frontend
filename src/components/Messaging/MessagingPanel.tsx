import { useState } from "react";
import { MessageCircle } from "@/lib/icons";
import { useMessaging } from "../../context/Messaging/useMessaging";
import { MessagingOverlay } from "./MessagingOverlay";
import { MessagingHeader } from "./MessagingHeader";
import { ConversationItem } from "./ConversationItem";
import { ConversationThread } from "./ConversationThread";
import { EmptyState } from "../Layout/EmptyState";

export function MessagingPanel() {
  const {
    isMessagingOpen,
    activeConversationId,
    unreadConversationIds,
    conversations,
    isLoadingConversations,
    openConversation,
    goToConversationList,
    closeMessaging,
    setConversationUnread,
    sendMessage,
  } = useMessaging();

  // Archivage/suppression : MS-Messagerie ne les supporte pas (cf. « Hors
  // périmètre » de son README) — purement local à cette liste affichée,
  // comme avant l'intégration réelle. "Gérer les conversations"/"Messages
  // archivés" (menu du header) restent des pages à construire séparément.
  const [archivedIds, setArchivedIds] = useState<string[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);

  const visibleConversations = conversations.filter(
    (conv) => !archivedIds.includes(conv.id) && !deletedIds.includes(conv.id),
  );

  const activeConversation = conversations.find(
    (conv) => conv.id === activeConversationId,
  );

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
    sendMessage(activeConversationId, text);
  };

  // TODO: ouvrir le flow de composition d'une nouvelle conversation
  // (sélection d'un contact + premier message) — ticket séparé, le flow
  // complet (recherche de contact, etc.) n'existe pas encore. En attendant,
  // une conversation s'ouvre depuis le profil d'un membre (bouton "Message").
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
              {isLoadingConversations ? (
                <p className="p-4 text-center text-sm text-base-content/50">
                  Chargement…
                </p>
              ) : visibleConversations.length === 0 ? (
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
                    online={conv.online}
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
