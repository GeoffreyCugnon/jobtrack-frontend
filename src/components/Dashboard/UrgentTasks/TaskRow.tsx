import { CaretRight, type Icon as IconType } from "@phosphor-icons/react";
import { Link } from "react-router";

interface TaskRowProps {
  text: string;
  icon: IconType;
  time?: string;
  /** Cible du clic (liste concernée). */
  to: string;
}

export function TaskRow({ text, icon: Icon, time, to }: TaskRowProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-2 -mx-2 px-2 py-3 first:pt-0 last:pb-0 rounded-field transition-colors hover:bg-base-200/60 active:bg-base-200"
    >
      <div className="min-w-0">
        <span className="block text-sm text-base-content/90 truncate">
          {text}
        </span>
        {time ? (
          <span className="text-xs text-base-content/50">{time}</span>
        ) : null}
      </div>
      <div className="flex items-center gap-1 shrink-0 text-primary">
        <Icon className="w-5 h-5" aria-hidden="true" />
        <CaretRight aria-hidden="true" className="w-3.5 h-3.5 lg:hidden" />
      </div>
    </Link>
  );
}
