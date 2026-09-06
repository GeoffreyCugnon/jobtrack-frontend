import { useNavigate } from "react-router";
import {
  X,
  PenSquare,
  MoreVertical,
  ListChecks,
  SlidersHorizontal,
  Archive,
  CalendarClock,
} from "lucide-react";
import { DropdownMenu } from "../UI/DropdownMenu";

interface MessagingHeaderProps {
  onClose: () => void;
  onNewConversation: () => void;
}

export function MessagingHeader({
  onClose,
  onNewConversation,
}: MessagingHeaderProps) {
  const navigate = useNavigate();

  // Ces options ouvrent une page à part entière : on quitte le contexte du
  // panneau, donc on le referme avant de naviguer (cohérent avec le reste de
  // l'app où un clic sur un lien ferme les overlays en cours).
  const goTo = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="flex items-center justify-between gap-2 border-b border-base-content/10 px-4 pt-6 pb-6">
      <h2 className="font-semibold text-base-content text-lg">Messagerie</h2>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onNewConversation}
          aria-label="Nouvelle conversation"
          className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:bg-base-200 transition-colors"
        >
          <PenSquare className="w-5 h-5" />
        </button>

        <DropdownMenu
          triggerIcon={MoreVertical}
          triggerLabel="Plus d'options"
          items={[
            {
              label: "Gérer les conversations",
              icon: ListChecks,
              onClick: () => goTo("/messaging/manage"),
            },
            {
              label: "Préférences de messagerie",
              icon: SlidersHorizontal,
              onClick: () => goTo("/messaging/preferences"),
            },
            {
              label: "Messages archivés",
              icon: Archive,
              onClick: () => goTo("/messaging/archived"),
            },
            {
              label: "Message d'absence",
              icon: CalendarClock,
              onClick: () => goTo("/messaging/away-message"),
            },
          ]}
        />

        <button
          onClick={onClose}
          aria-label="Fermer la messagerie"
          className="btn btn-ghost btn-circle btn-sm bg-base-200 hover:bg-base-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
