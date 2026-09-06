// src/components/dashboard/taskRow.tsx
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router";

export type TaskDueCategory = "today" | "upcoming";

interface TaskRowProps {
  type: string;
  company?: string;
  role?: string;
  text?: string;
  icon: LucideIcon;
  time?: string;
  dueCategory: TaskDueCategory;
}

export function TaskRow({
  type,
  company,
  role,
  text,
  icon: Icon,
  time,
  dueCategory,
}: TaskRowProps) {
  const label = type === "relance" ? `Relancer ${company} (${role})` : text;
  // TODO: cibler la candidature/l'entretien précis une fois les pages de
  // détail disponibles ; pour l'instant on renvoie vers la liste concernée.
  const to = type === "relance" ? "/relances" : "/entretiens";

  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-2 -mx-2 px-2 py-3 first:pt-0 last:pb-0 rounded-field transition-colors hover:bg-base-200/60 active:bg-base-200"
    >
      <div className="flex items-center gap-3 min-w-0">
        {dueCategory === "today" ? (
          <span className="badge badge-error badge-sm font-semibold shrink-0">
            Urgent
          </span>
        ) : (
          <span className="badge badge-success badge-sm font-semibold shrink-0">
            À venir
          </span>
        )}
        <div className="min-w-0">
          <span className="block text-sm text-base-content/90 truncate">
            {label}
          </span>
          {time ? (
            <span className="text-xs text-base-content/50">{time}</span>
          ) : null}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 text-base-content/70">
        <Icon className="w-5 h-5" aria-hidden="true" />
        <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 lg:hidden" />
      </div>
    </Link>
  );
}
