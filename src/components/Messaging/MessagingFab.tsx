import { MessageCircle } from "lucide-react";
import { useMessaging } from "../../context/Messaging/useMessaging";
import { BOTTOM_NAV_HEIGHT } from "../../constants/layout";

interface MessagingFabProps {
  unreadCount?: number;
  hidden?: boolean;
}

const FAB_SIZE = 44;

export function MessagingFab({
  unreadCount = 0,
  hidden = false,
}: MessagingFabProps) {
  const { openMessaging } = useMessaging();
  const displayCount = unreadCount > 9 ? "9+" : unreadCount;

  return (
    <div
      className={`fixed left-0 right-0 z-50 max-w-5xl mx-auto px-4 pointer-events-none transition-opacity duration-200 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ bottom: BOTTOM_NAV_HEIGHT - FAB_SIZE / 2 }}
    >
      <div className="relative w-full">
        <button
          onClick={openMessaging}
          disabled={hidden}
          aria-label={
            unreadCount > 0
              ? `Messagerie, ${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`
              : "Messagerie"
          }
          className="absolute bottom-0 right-0 w-11 h-11 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors pointer-events-auto"
        >
          <MessageCircle className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-error text-error-content text-[10px] font-medium flex items-center justify-center">
              {displayCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
