import { MoreVertical, Circle, CheckCircle2, Archive, Trash2 } from "lucide-react";
import { Avatar } from "../UI/Avatar";
import { DropdownMenu } from "../UI/DropdownMenu";

interface ConversationItemProps {
  name: string;
  lastMessage: string;
  time: string;
  avatarUrl?: string;
  unread?: boolean;
  onClick?: () => void;
  onToggleUnread: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

export function ConversationItem({
  name,
  lastMessage,
  time,
  avatarUrl,
  unread,
  onClick,
  onToggleUnread,
  onArchive,
  onDelete,
}: ConversationItemProps) {
  return (
    // role="button" plutôt qu'un <button> natif : le menu "..." est un vrai
    // bouton imbriqué dans la rangée (un <button> dans un <button> est
    // invalide en HTML) — même pattern que SectionCard pour une rangée
    // cliquable contenant une action secondaire.
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-base-200 transition-colors text-left cursor-pointer"
    >
      <Avatar label={name.charAt(0).toUpperCase()} avatarUrl={avatarUrl} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-sm ${unread ? "font-semibold text-base-content" : "text-base-content/90"}`}
          >
            {name}
          </span>
          <span className="text-xs text-base-content/50 shrink-0">{time}</span>
        </div>
        <p
          className={`text-xs truncate ${unread ? "text-base-content/80" : "text-base-content/50"}`}
        >
          {lastMessage}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {unread && <span className="w-2 h-2 rounded-full bg-primary" />}
        <DropdownMenu
          triggerIcon={MoreVertical}
          triggerLabel={`Actions pour la conversation avec ${name}`}
          items={[
            {
              label: unread ? "Marquer comme lu" : "Marquer comme non lu",
              icon: unread ? CheckCircle2 : Circle,
              onClick: onToggleUnread,
            },
            { label: "Archiver", icon: Archive, onClick: onArchive },
            {
              label: "Supprimer la conversation",
              icon: Trash2,
              onClick: onDelete,
              variant: "danger",
            },
          ]}
        />
      </div>
    </div>
  );
}
