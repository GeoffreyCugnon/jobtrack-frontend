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
  const label =
    unreadCount > 0
      ? `Messagerie, ${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`
      : "Messagerie";

  return (
    <>
      {/* Mobile : bouton rond flottant au-dessus de la barre de navigation */}
      <div
        className={`fixed right-4 z-50 lg:hidden pointer-events-none transition-opacity duration-200 ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ bottom: BOTTOM_NAV_HEIGHT - FAB_SIZE / 2 }}
      >
        <button
          onClick={openMessaging}
          disabled={hidden}
          aria-label={label}
          className="relative w-11 h-11 rounded-full bg-primary text-primary-content flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors pointer-events-auto"
        >
          <MessageCircle className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-error text-error-content text-[10px] font-medium flex items-center justify-center">
              {displayCount}
            </span>
          )}
        </button>
      </div>

      {/* Desktop : barre rectangulaire ancrée dans le coin inférieur droit de la fenêtre */}
      <div
        className={`hidden lg:block fixed bottom-0 right-6 z-50 pointer-events-none transition-opacity duration-200 ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <button
          onClick={openMessaging}
          disabled={hidden}
          aria-label={label}
          className="relative flex items-center gap-2 h-11 pl-2.5 pr-4 rounded-t-lg bg-base-100 border border-b-0 border-base-content/10 shadow-lg hover:bg-base-200 transition-colors pointer-events-auto"
        >
          <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-content shrink-0">
            <MessageCircle className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-4 h-4 px-1 rounded-full bg-error text-error-content text-[10px] font-medium flex items-center justify-center">
                {displayCount}
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
