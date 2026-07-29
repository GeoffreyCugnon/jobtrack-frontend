import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

interface ClickableRowProps {
  to: string;
  children: ReactNode;
}

// Ligne de liste générique : toute la ligne est la zone cliquable, chevron
// en fin de ligne comme seul indicateur (masqué sur desktop où le hover
// suffit), même pattern que les todo items du Dashboard.
export function ClickableRow({ to, children }: ClickableRowProps) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-2 -mx-2 px-2 py-3 first:pt-0 last:pb-0 rounded-field transition-colors hover:bg-base-200/60 active:bg-base-200"
    >
      <div className="min-w-0 flex-1">{children}</div>
      <ChevronRight
        aria-hidden="true"
        className="w-4 h-4 text-base-content/70 lg:hidden shrink-0"
      />
    </Link>
  );
}
