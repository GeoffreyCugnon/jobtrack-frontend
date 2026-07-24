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
    <div className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="badge badge-error badge-soft badge-sm shrink-0">
          Urgent
        </span>
        <span className="text-sm text-base-content/90 truncate">{label}</span>
      </div>
      <button
        aria-label={actionLabel}
        className="btn btn-ghost btn-circle btn-sm text-primary shrink-0"
      >
        <Icon className="w-5 h-5" />
      </button>
    </div>
  );
}
