interface ConversationItemProps {
  name: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
}

export function ConversationItem({
  name,
  lastMessage,
  time,
  unread,
}: ConversationItemProps) {
  return (
    <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-base-200 transition-colors text-left">
      <div className="avatar placeholder shrink-0">
        <div className="w-10 rounded-full bg-base-200 text-base-content/70">
          <span className="text-sm">{name.charAt(0)}</span>
        </div>
      </div>
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
      {unread && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
    </button>
  );
}
