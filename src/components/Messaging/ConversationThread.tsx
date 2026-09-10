import { useEffect, useRef, useState } from "react";
import { ArrowLeft, PaperPlaneTilt, X } from "@phosphor-icons/react";
import type { Conversation } from "../../types/messaging.type";
import { Avatar } from "../UI/Avatar";
import { useMessaging } from "../../context/Messaging/useMessaging";
import { useAuthStore } from "../../store/auth.store";
import { getUserDisplay } from "../../utils/user-display";

interface ConversationThreadProps {
  conversation: Conversation;
  onBack: () => void;
  onClose: () => void;
  onSend: (text: string) => void;
}

// Fréquence max d'émission de `typing:start` pendant la frappe (MS-Messagerie
// borne à 20 / 10 s par utilisateur, refus silencieux au-delà).
const TYPING_START_THROTTLE_MS = 3000;
// Délai d'inactivité clavier après lequel on émet `typing:stop`.
const TYPING_IDLE_MS = 2500;

export function ConversationThread({
  conversation,
  onBack,
  onClose,
  onSend,
}: ConversationThreadProps) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { typingConversationIds, setTyping } = useMessaging();
  const me = getUserDisplay(useAuthStore((state) => state.user));
  const otherIsTyping = typingConversationIds.includes(conversation.id);

  // Émission de l'indicateur « en train d'écrire » : throttle du `start`,
  // `stop` après une pause de frappe.
  const lastTypingStartRef = useRef(0);
  const typingIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTyping = () => {
    if (typingIdleTimerRef.current) {
      clearTimeout(typingIdleTimerRef.current);
      typingIdleTimerRef.current = null;
    }
    lastTypingStartRef.current = 0;
    setTyping(conversation.id, false);
  };

  const handleDraftChange = (value: string) => {
    setDraft(value);
    const now = Date.now();
    if (now - lastTypingStartRef.current > TYPING_START_THROTTLE_MS) {
      lastTypingStartRef.current = now;
      setTyping(conversation.id, true);
    }
    if (typingIdleTimerRef.current) clearTimeout(typingIdleTimerRef.current);
    typingIdleTimerRef.current = setTimeout(stopTyping, TYPING_IDLE_MS);
  };

  // Fil changé / composant démonté : on cesse d'annoncer la frappe pour la
  // conversation qu'on quitte.
  useEffect(() => {
    return () => {
      if (typingIdleTimerRef.current) clearTimeout(typingIdleTimerRef.current);
      lastTypingStartRef.current = 0;
      setTyping(conversation.id, false);
    };
  }, [conversation.id, setTyping]);

  // Descend en bas du fil à l'ouverture d'une conversation, à chaque nouveau
  // message et à l'apparition de l'indicateur de frappe.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.id, conversation.messages.length, otherIsTyping]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
    stopTyping();
    // On garde le focus dans le champ : le clavier mobile reste ouvert pour
    // enchaîner les messages.
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100%)]">
      <div className="flex items-center justify-between gap-2 border-b border-base-content/10 px-3 py-4">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            aria-label="Retour à la liste des conversations"
            className="btn btn-ghost btn-circle btn-sm shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Avatar
            label={conversation.name.charAt(0).toUpperCase()}
            avatarUrl={conversation.avatarUrl}
            online={conversation.online}
            size="sm"
          />
          <div className="min-w-0">
            <span className="block font-semibold text-base-content text-sm truncate">
              {conversation.name}
            </span>
            {conversation.online !== undefined && (
              <span className="block text-xs text-base-content/50">
                {conversation.online ? "En ligne" : "Hors ligne"}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer la messagerie"
          className="btn btn-ghost btn-circle btn-sm bg-base-200 hover:bg-base-300 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {conversation.messages.map((message, index, all) => {
          const mine = message.from === "me";
          // En one-to-one, deux auteurs seulement : une nouvelle salve commence
          // dès que l'expéditeur change.
          const startsGroup =
            index === 0 || all[index - 1].from !== message.from;
          const authorName = mine ? me.name : conversation.name;
          const authorAvatar = mine ? me.avatarUrl : conversation.avatarUrl;
          const authorInitial = mine
            ? me.initials
            : (conversation.name.charAt(0) || "?").toUpperCase();

          return (
            <div
              key={message.id}
              className={`flex flex-col ${mine ? "items-end" : "items-start"} ${
                startsGroup && index > 0 ? "mt-3" : ""
              }`}
            >
              {startsGroup && (
                <div
                  className={`flex items-center gap-2 mb-1 ${
                    mine ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar
                    label={authorInitial}
                    avatarUrl={authorAvatar}
                    size="sm"
                  />
                  <span className="text-xs font-semibold text-base-content/80">
                    {authorName}
                  </span>
                  <span className="text-xs text-base-content/50">
                    {message.time}
                  </span>
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-box px-3 py-2 text-sm ${
                  mine
                    ? "bg-primary text-primary-content"
                    : "bg-base-200 text-base-content"
                }`}
              >
                {message.text}
              </div>
            </div>
          );
        })}

        {otherIsTyping && (
          <p className="text-xs text-base-content/50 italic pt-1">
            {conversation.name} est en train d'écrire…
          </p>
        )}

        <div ref={endRef} />
      </div>

      <form
        onSubmit={submit}
        className="flex items-center gap-2 border-t border-base-content/10 bg-base-100 px-3 py-2.5"
      >
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          placeholder="Écrire un message…"
          aria-label="Écrire un message"
          enterKeyHint="send"
          autoComplete="off"
          className="input input-sm flex-1 rounded-full bg-base-200"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Envoyer le message"
          className="btn btn-primary btn-sm btn-circle shrink-0"
        >
          <PaperPlaneTilt className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
