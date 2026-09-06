import type { MouseEvent as ReactMouseEvent } from "react";
import { MessageCircle } from "lucide-react";
import { useMessaging } from "../../context/Messaging/useMessaging";
import { useDraggableFab } from "../../hooks/useDraggableFab";
import { useToastStore } from "../../store/toast.store";
import {
  STACK_BOTTOM_OFFSET,
  STACK_ITEM_GAP,
} from "../../constants/layout";
import { CONVERSATIONS, unreadMessageCount } from "../../constants/conversations";

export function MessagingFab() {
  const { isMessagingOpen, unreadConversationIds, openMessaging, openConversation } =
    useMessaging();
  // Si un ou plusieurs toasts occupent déjà le coin, on empile le bouton
  // juste au-dessus d'eux plutôt que par-dessus.
  const toastStackHeight = useToastStore((state) => state.stackHeight);
  const defaultBottom =
    STACK_BOTTOM_OFFSET +
    (toastStackHeight > 0 ? toastStackHeight + STACK_ITEM_GAP : 0);
  // Nb de conversations avec des non-lus (comme le bouton Messages du header).
  const unreadConvCount = unreadConversationIds.length;
  const unreadConvDisplay = unreadConvCount > 9 ? "9+" : unreadConvCount;

  // Le fab mobile pointe vers UNE conversation (la plus récente non lue) :
  // son badge compte les nouveaux messages DANS cette conversation.
  const targetConversation = CONVERSATIONS.find(
    (c) => c.id === unreadConversationIds[0],
  );
  const fabMessageCount = targetConversation
    ? unreadMessageCount(targetConversation) || 1
    : 0;
  const fabMessageDisplay = fabMessageCount > 9 ? "9+" : fabMessageCount;
  const fabLabel = targetConversation
    ? `${fabMessageCount} nouveau message${fabMessageCount > 1 ? "s" : ""} de ${targetConversation.name}`
    : "Nouveau message";

  // Le bouton flottant mobile ne sert qu'à signaler un message non lu et
  // ouvrir directement la conversation concernée : pas d'accès permanent,
  // contrairement à la barre desktop et à l'entrée "Messages" de la bottom
  // nav qui restent, elles, toujours disponibles.
  const showMobileFab = unreadConvCount > 0 && !isMessagingOpen;

  const openMostRecentUnread = () => {
    if (unreadConversationIds[0]) openConversation(unreadConversationIds[0]);
  };

  const {
    wrapperRef: mobileWrapperRef,
    position: mobilePosition,
    isSnapping,
    snapDurationMs,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useDraggableFab({ onTap: openMostRecentUnread });

  // Filet pour l'activation clavier (Entrée/Espace sur le bouton focus) :
  // ce cas ne déclenche aucun événement pointeur, seulement un "click" avec
  // detail === 0 (à l'inverse d'un vrai clic souris/tap, où detail >= 1).
  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0) {
      openMostRecentUnread();
    }
  };

  return (
    <>
      {/* Mobile : n'apparaît que lorsqu'un message n'est pas encore lu, et
          ouvre directement la conversation concernée. Ancré au-dessus de la
          barre de navigation par défaut, déplaçable librement à l'appui. */}
      {showMobileFab && (
        <div
          ref={mobileWrapperRef}
          className={`fixed z-41 lg:hidden pointer-events-none ${
            mobilePosition ? "" : "right-4"
          }`}
          style={{
            ...(mobilePosition
              ? { top: mobilePosition.y, left: mobilePosition.x }
              : { bottom: defaultBottom }),
            transition: mobilePosition
              ? isSnapping
                ? `left ${snapDurationMs}ms ease-out`
                : undefined
              : "bottom 200ms ease-out",
          }}
        >
          <button
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            aria-label={fabLabel}
            className="relative w-11 h-11 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg hover:bg-primary/90 active:scale-95 active:bg-primary/80 transition touch-none pointer-events-auto"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-error text-error-content text-[10px] font-medium flex items-center justify-center">
              {fabMessageDisplay}
            </span>
          </button>
        </div>
      )}

      {/* Desktop : barre rectangulaire ancrée dans le coin inférieur droit de
          la fenêtre, toujours disponible (ouvre la liste des conversations). */}
      <div
        className={`hidden lg:block fixed bottom-0 right-6 z-41 pointer-events-none transition-opacity duration-200 ${
          isMessagingOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <button
          onClick={openMessaging}
          disabled={isMessagingOpen}
          aria-label="Messagerie"
          className="relative flex items-center gap-2 h-11 pl-2.5 pr-4 rounded-t-field bg-base-100 border border-b-0 border-base-content/10 shadow-lg hover:bg-base-200 transition-colors pointer-events-auto"
        >
          <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-content shrink-0">
            <MessageCircle className="w-4 h-4" />
            {unreadConvCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-error text-error-content text-[10px] font-medium flex items-center justify-center">
                {unreadConvDisplay}
              </span>
            )}
          </span>
          <span className="text-sm font-medium text-base-content">
            Messagerie
          </span>
        </button>
      </div>
    </>
  );
}
