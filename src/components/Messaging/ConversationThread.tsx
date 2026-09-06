import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, X } from "@/lib/icons";
import type { Conversation } from "../../constants/conversations";
import { Avatar } from "../UI/Avatar";

interface ConversationThreadProps {
  conversation: Conversation;
  onBack: () => void;
  onClose: () => void;
  onSend: (text: string) => void;
}

export function ConversationThread({
  conversation,
  onBack,
  onClose,
  onSend,
}: ConversationThreadProps) {
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Descend en bas du fil à l'ouverture d'une conversation et à chaque
  // nouveau message.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [conversation.id, conversation.messages.length]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
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
            size="sm"
          />
          <span className="font-semibold text-base-content text-sm truncate">
            {conversation.name}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer la messagerie"
          className="btn btn-ghost btn-circle btn-sm bg-base-200 hover:bg-base-300 transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.from === "me" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-box px-3 py-2 text-sm ${
                message.from === "me"
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content"
              }`}
            >
              {message.text}
            </div>
            <span className="text-xs text-base-content/50 mt-1">
              {message.time}
            </span>
          </div>
        ))}
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
          onChange={(e) => setDraft(e.target.value)}
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
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
