import { MessageCircle, X } from "lucide-react";

interface MessagingHeaderProps {
  onClose: () => void;
}

export function MessagingHeader({ onClose }: MessagingHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-base-content/10 px-5 pt-6 pb-6">
      <div className="flex items-center gap-3">
        <div className="avatar placeholder">
          <div className="w-10 rounded-full bg-primary/10 text-primary ring-2 ring-primary/40">
            <MessageCircle className="w-5 h-5" />
          </div>
        </div>
        <h2 className="font-semibold text-base-content text-lg">Messagerie</h2>
      </div>

      <button
        onClick={onClose}
        aria-label="Fermer la messagerie"
        className="btn btn-ghost btn-circle btn-sm bg-base-200 hover:bg-base-300 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
