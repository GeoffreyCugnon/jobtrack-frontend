// src/components/dashboard/taskRow.tsx
import type { LucideIcon } from "lucide-react";

interface TaskRowProps {
  type: string;
  company?: string;
  role?: string;
  text?: string;
  icon: LucideIcon;
}

export function TaskRow({
  type,
  company,
  role,
  text,
  icon: Icon,
}: TaskRowProps) {
  const label = type === "relance" ? `Relancer ${company} (${role})` : text;
  const actionLabel =
    type === "relance"
      ? `Envoyer un email à ${company}`
      : "Ouvrir le lien de l'entretien";

  return (
    <div className="bg-base-100 border border-base-200 rounded-field px-4 py-3 flex items-center justify-between shadow-sm cursor-pointer hover:bg-base-content/10 transition-colors">
      <div className="flex items-center gap-3">
        <span className="badge badge-error badge-sm text-error-content">
          Urgent
        </span>
        <span className="text-sm text-base-content/90">{label}</span>
      </div>
      <button
        aria-label={actionLabel}
        className="text-primary p-1.5 -m-1.5 bg-transparent border-none shadow-none"
      >
        <Icon className="w-5 h-5" />
      </button>
    </div>
  );
}
