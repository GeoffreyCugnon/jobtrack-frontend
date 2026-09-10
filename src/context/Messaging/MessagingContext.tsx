import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MessagingContext } from "./messagingContextInstance";
import { useAuthStore } from "../../store/auth.store";
import { queryKeys } from "../../api/query-keys";
import { UserApi } from "../../api/user.api";
import {
  MessagingRestApi,
  connectMessagingSocket,
  disconnectMessagingSocket,
  getMessagingSocket,
  joinConversationRoom,
  leaveConversationRoom,
  sendMessageViaSocket,
  emitTyping,
  queryPresence,
  clearMessagingToken,
} from "../../services/messaging-client";
import { formatConversationTime } from "../../utils/messaging";
import type {
  Conversation,
  ConversationMessage,
  MessagingMessageDto,
} from "../../types/messaging.type";

interface MessagingProviderProps {
  children: ReactNode;
}

// Sur mobile, le clic de compatibilité que certains navigateurs synthétisent
// juste après un tap tactile peut atterrir sur l'overlay qui vient de
// s'afficher et refermer la messagerie aussitôt ouverte. On ignore les
// demandes de fermeture survenant dans cette fenêtre après l'ouverture.
const GHOST_CLICK_GUARD_MS = 500;

// Filet de sécurité si un `typing:stop` se perd (réseau, onglet fermé) :
// l'indicateur « écrit… » disparaît seul passé ce délai sans nouvel événement.
const TYPING_EXPIRY_MS = 6000;

function mapMessage(dto: MessagingMessageDto, myId: string): ConversationMessage {
  return {
    id: dto.id,
    from: dto.senderId === myId ? "me" : "them",
    text: dto.content,
    time: formatConversationTime(dto.createdAt),
  };
}

export function MessagingProvider({ children }: MessagingProviderProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUserId = useAuthStore((state) => String(state.user?.id ?? ""));
  const queryClient = useQueryClient();

  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  // "Marquer comme non lu" n'a pas d'équivalent côté MS-Messagerie (lecture
  // par message, jamais annulée) : surcharge locale, purement cosmétique.
  const [forcedUnreadIds, setForcedUnreadIds] = useState<string[]>([]);
  const openedAtRef = useRef(0);

  // Présence temps réel : ids des interlocuteurs actuellement connectés
  // (événements `presence` / `presence:snapshot` de MS-Messagerie).
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  // Ids des conversations où l'autre participant écrit, chacune avec un
  // minuteur d'expiration rafraîchi à chaque événement `typing`.
  const [typingConversationIds, setTypingConversationIds] = useState<string[]>(
    [],
  );
  const typingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  // --- Connexion WebSocket, tant que l'utilisateur est authentifié ---------
  useEffect(() => {
    if (!isAuthenticated) {
      disconnectMessagingSocket();
      clearMessagingToken();
      return;
    }

    let cancelled = false;
    const invalidateConversations = () =>
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messaging.conversations,
      });

    void connectMessagingSocket().then((socket) => {
      if (cancelled) return;

      socket.on("message:new", (message: MessagingMessageDto) => {
        // Fil déjà chargé (conversation ouverte) : on l'y ajoute directement.
        queryClient.setQueryData<MessagingMessageDto[] | undefined>(
          queryKeys.messaging.thread(message.conversationId),
          (prev) =>
            prev
              ? prev.some((m) => m.id === message.id)
                ? prev
                : [...prev, message]
              : prev,
        );
        invalidateConversations();
      });

      socket.on("message:read", invalidateConversations);
      // Toute la conversation vient d'être marquée lue (par l'un ou l'autre).
      socket.on("conversation:read", invalidateConversations);

      // Poussé dans la room `user:<id>` par MS-Messagerie : signal qu'une de mes
      // conversations a bougé alors que je ne suis dans aucune room
      // `conversation:*` (conversation neuve, ou message reçu panneau/fil
      // fermé). Sans lui, la liste — donc le badge et le MessagingFab — ne se
      // rafraîchit jamais tant que je n'ouvre pas la conversation.
      socket.on(
        "conversation:updated",
        (payload: { conversationId?: string }) => {
          invalidateConversations();
          if (payload?.conversationId) {
            void queryClient.invalidateQueries({
              queryKey: queryKeys.messaging.thread(payload.conversationId),
            });
          }
        },
      );

      // --- Présence -------------------------------------------------------
      // Snapshot complet (connexion / reconnexion) : remplace la liste.
      socket.on("presence:snapshot", (payload: { online?: string[] }) => {
        setOnlineUserIds(payload?.online ?? []);
      });
      // Changement unitaire d'un interlocuteur.
      socket.on(
        "presence",
        (payload: { userId?: string; online?: boolean }) => {
          if (!payload?.userId) return;
          const { userId, online } = payload;
          setOnlineUserIds((prev) => {
            const has = prev.includes(userId);
            if (online) return has ? prev : [...prev, userId];
            return has ? prev.filter((id) => id !== userId) : prev;
          });
        },
      );
      // Le serveur pousse déjà un snapshot à la connexion ; on le rejoue au
      // cas où ce listener n'était pas encore attaché à ce moment-là.
      queryPresence();

      // --- « En train d'écrire » ----------------------------------------
      // En one-to-one, tout `typing` reçu vient forcément de l'autre
      // participant (MS-Messagerie ne relaie pas à l'émetteur).
      socket.on(
        "typing",
        (payload: {
          conversationId?: string;
          userId?: string;
          typing?: boolean;
        }) => {
          const id = payload?.conversationId;
          if (!id) return;
          const timers = typingTimersRef.current;
          if (timers[id]) {
            clearTimeout(timers[id]);
            delete timers[id];
          }
          if (payload.typing) {
            setTypingConversationIds((prev) =>
              prev.includes(id) ? prev : [...prev, id],
            );
            timers[id] = setTimeout(() => {
              delete timers[id];
              setTypingConversationIds((prev) =>
                prev.filter((cid) => cid !== id),
              );
            }, TYPING_EXPIRY_MS);
          } else {
            setTypingConversationIds((prev) => prev.filter((cid) => cid !== id));
          }
        },
      );
    });

    return () => {
      cancelled = true;
      disconnectMessagingSocket();
      Object.values(typingTimersRef.current).forEach(clearTimeout);
      typingTimersRef.current = {};
      setOnlineUserIds([]);
      setTypingConversationIds([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // --- Aperçu des conversations ---------------------------------------------
  const conversationsQuery = useQuery({
    queryKey: queryKeys.messaging.conversations,
    queryFn: async (): Promise<Conversation[]> => {
      const raw = await MessagingRestApi.getConversations();
      return Promise.all(
        raw.map(async (conv): Promise<Conversation> => {
          const otherId =
            conv.userAId === currentUserId ? conv.userBId : conv.userAId;
          const [page, participant] = await Promise.all([
            MessagingRestApi.getMessages(conv.id, { limit: 1 }).catch(
              () => ({ items: [], nextCursor: null }),
            ),
            UserApi.getById(otherId).catch(() => null),
          ]);
          const last = page.items[0] as MessagingMessageDto | undefined;
          const name = participant
            ? `${participant.first_name} ${participant.last_name}`.trim() ||
              participant.email
            : "Utilisateur";

          return {
            id: conv.id,
            participantId: otherId,
            name,
            avatarUrl: participant?.avatar_url ?? undefined,
            lastMessage: last?.content ?? "",
            time: formatConversationTime(last?.createdAt ?? conv.createdAt),
            unread: conv.unreadCount > 0,
            unreadCount: conv.unreadCount,
            messages: last ? [mapMessage(last, currentUserId)] : [],
          };
        }),
      );
    },
    enabled: isAuthenticated && !!currentUserId,
    staleTime: 15_000,
    // Filet de sécurité si le socket est tombé (le chemin nominal reste
    // l'événement `conversation:updated`).
    refetchOnWindowFocus: true,
  });

  // --- Fil complet de la conversation active --------------------------------
  const threadQuery = useQuery({
    queryKey: queryKeys.messaging.thread(activeConversationId ?? ""),
    queryFn: async (): Promise<MessagingMessageDto[]> => {
      const page = await MessagingRestApi.getMessages(activeConversationId!, {
        limit: 100,
      });
      // La page arrive du plus récent au plus ancien ; le fil s'affiche dans
      // l'autre sens.
      return [...page.items].reverse();
    },
    enabled: isAuthenticated && !!activeConversationId,
  });

  const conversations: Conversation[] = useMemo(() => {
    const base = (conversationsQuery.data ?? []).map((conv) => ({
      ...conv,
      online: onlineUserIds.includes(conv.participantId),
    }));
    if (!activeConversationId || !threadQuery.data) return base;
    return base.map((conv) =>
      conv.id === activeConversationId
        ? {
            ...conv,
            messages: threadQuery.data.map((m) => mapMessage(m, currentUserId)),
          }
        : conv,
    );
  }, [
    conversationsQuery.data,
    activeConversationId,
    threadQuery.data,
    currentUserId,
    onlineUserIds,
  ]);

  const unreadConversationIds = useMemo(() => {
    const serverUnread = (conversationsQuery.data ?? [])
      .filter((c) => c.unread)
      .map((c) => c.id);
    return Array.from(new Set([...serverUnread, ...forcedUnreadIds]));
  }, [conversationsQuery.data, forcedUnreadIds]);

  /** Marque toute la conversation comme lue, si elle a des messages non lus. */
  const markConversationRead = useCallback(
    (conversationId: string) => {
      const conv = (conversationsQuery.data ?? []).find(
        (c) => c.id === conversationId,
      );
      if (!conv?.unread) return;
      void MessagingRestApi.markConversationRead(conversationId).then(() =>
        queryClient.invalidateQueries({
          queryKey: queryKeys.messaging.conversations,
        }),
      );
    },
    [conversationsQuery.data, queryClient],
  );

  // Tant qu'une conversation est ouverte à l'écran, ses messages entrants sont
  // considérés lus : on la re-marque lue chaque fois que le serveur la repasse
  // en non-lu (message reçu pendant qu'on la regarde). Sans ça, l'indicateur
  // « nouveau message » réapparaîtrait en quittant le fil alors qu'il a été vu.
  useEffect(() => {
    if (!isMessagingOpen || !activeConversationId) return;
    const conv = conversationsQuery.data?.find(
      (c) => c.id === activeConversationId,
    );
    if (conv?.unread) markConversationRead(activeConversationId);
  }, [
    isMessagingOpen,
    activeConversationId,
    conversationsQuery.data,
    markConversationRead,
  ]);

  // --- Actions ----------------------------------------------------------------

  const openMessaging = useCallback(() => {
    openedAtRef.current = Date.now();
    setActiveConversationId(null);
    setIsMessagingOpen(true);
  }, []);

  const openConversation = useCallback(
    (conversationId: string) => {
      openedAtRef.current = Date.now();
      setActiveConversationId(conversationId);
      setIsMessagingOpen(true);
      setForcedUnreadIds((prev) => prev.filter((id) => id !== conversationId));
      joinConversationRoom(conversationId);
      // La lecture est prise en charge par l'effet ci-dessus (conversation
      // ouverte + non lue -> markConversationRead), y compris ici à l'ouverture.
    },
    [],
  );

  const goToConversationList = useCallback(() => {
    if (activeConversationId) leaveConversationRoom(activeConversationId);
    setActiveConversationId(null);
  }, [activeConversationId]);

  const closeMessaging = useCallback(() => {
    if (Date.now() - openedAtRef.current < GHOST_CLICK_GUARD_MS) return;
    setIsMessagingOpen(false);
  }, []);

  const toggleMessaging = useCallback(
    () => setIsMessagingOpen((prev) => !prev),
    [],
  );

  const setConversationUnread = useCallback(
    (conversationId: string, unread: boolean) => {
      if (unread) {
        setForcedUnreadIds((prev) =>
          prev.includes(conversationId) ? prev : [...prev, conversationId],
        );
        return;
      }
      setForcedUnreadIds((prev) => prev.filter((id) => id !== conversationId));
      markConversationRead(conversationId);
    },
    [markConversationRead],
  );

  const sendMessage = useCallback(
    (conversationId: string, text: string) => {
      const socket = getMessagingSocket();
      if (socket?.connected) {
        sendMessageViaSocket(conversationId, text);
      } else {
        void MessagingRestApi.sendMessage(conversationId, text);
      }
      // Optimiste a minima : le fil se met à jour via l'écho WebSocket
      // (`message:new`) ou, à défaut (fallback REST, socket indisponible), à
      // la prochaine invalidation ci-dessous.
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messaging.thread(conversationId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messaging.conversations,
      });
    },
    [queryClient],
  );

  const startConversation = useCallback(
    async (participantId: string): Promise<string> => {
      const conv = await MessagingRestApi.createConversation(participantId);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.messaging.conversations,
      });
      return conv.id;
    },
    [queryClient],
  );

  const setTyping = useCallback((conversationId: string, typing: boolean) => {
    emitTyping(conversationId, typing);
  }, []);

  // Sans ce useMemo, chaque render de MessagingProvider (donc de tout /app,
  // vu sa position dans l'arbre) recréerait cet objet et re-render tous les
  // consommateurs de useMessaging(), même ceux dont l'état suivi n'a pas changé.
  const value = useMemo(
    () => ({
      isMessagingOpen,
      activeConversationId,
      unreadConversationIds,
      conversations,
      isLoadingConversations: conversationsQuery.isLoading,
      openMessaging,
      openConversation,
      goToConversationList,
      closeMessaging,
      toggleMessaging,
      setConversationUnread,
      sendMessage,
      startConversation,
      typingConversationIds,
      setTyping,
    }),
    [
      isMessagingOpen,
      activeConversationId,
      unreadConversationIds,
      conversations,
      conversationsQuery.isLoading,
      openMessaging,
      openConversation,
      goToConversationList,
      closeMessaging,
      toggleMessaging,
      setConversationUnread,
      sendMessage,
      startConversation,
      typingConversationIds,
      setTyping,
    ],
  );

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}
