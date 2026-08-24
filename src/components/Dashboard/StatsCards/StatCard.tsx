import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router";

interface StatCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  to: string;
}

export function StatCard({ label, count, icon: Icon, to }: StatCardProps) {
  return (
    <Link
      to={to}
      className="card relative rounded-none bg-base-100 border border-base-200 shadow-sm text-center transition hover:bg-base-200/60 hover:border-primary/30 active:scale-[0.97] active:bg-base-200"
    >
      <ChevronRight
        aria-hidden="true"
        className="absolute top-2 right-2 w-3.5 h-3.5 text-base-content/70 lg:hidden"
      />
      <div className="card-body p-4 flex flex-col items-center justify-center gap-1">
        <Icon className="w-6 h-6 text-primary" />
        <div className="text-2xl font-bold">{count}</div>
        <div className="text-xs leading-tight text-base-content/70">
          {label}
        </div>
      </div>
    </Link>
  );
}
