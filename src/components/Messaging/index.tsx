import { MessagingOverlay } from "./MessagingOverlay";
import { MessagingHeader } from "./MessagingHeader";
import { ConversationItem } from "./ConversationItem";

interface MessagingPanelProps {
  open: boolean;
  onClose: () => void;
}

export function MessagingPanel({ open, onClose }: MessagingPanelProps) {
  const conversations = [
    {
      name: "TechCorp RH",
      lastMessage: "On vous recontacte lundi",
      time: "10:32",
      unread: true,
    },
    {
      name: "Sophie Martin",
      lastMessage: "Merci pour l'entretien !",
      time: "Hier",
      unread: true,
    },
    {
      name: "Lidl Recrutement",
      lastMessage: "Candidature refusée",
      time: "Lundi",
    },
  ];

  return (
    <>
      <MessagingOverlay open={open} onClose={onClose} />

      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-72 bg-base-100 border-l border-base-content/10 shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <MessagingHeader onClose={onClose} />

        <div className="flex flex-col overflow-y-auto h-[calc(100%-88px)]">
          {conversations.map((conv) => (
            <ConversationItem key={conv.name} {...conv} />
          ))}
        </div>
      </aside>
    </>
  );
}
