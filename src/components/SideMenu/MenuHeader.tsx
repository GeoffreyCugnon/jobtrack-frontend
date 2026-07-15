import { User, X } from "lucide-react";

interface MenuHeaderProps {
  name: string;
  email: string;
  onClose: () => void;
}

export function MenuHeader({ name, email, onClose }: MenuHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-base-content/10 px-5 pt-6 pb-6">
      <div className="flex items-center gap-4">
        <div className="avatar placeholder">
          <div className="w-14 rounded-full bg-primary/10 text-primary ring-2 ring-primary/40">
            <User className="w-6 h-6" />
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-base-content">{name}</h2>
          <p className="text-sm text-base-content/70">{email}</p>
        </div>
      </div>

      <button
        onClick={onClose}
        aria-label="Fermer le menu"
        className="btn btn-ghost btn-circle btn-sm bg-base-200 hover:bg-base-300 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
