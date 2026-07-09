// src/components/dashboard/taskRow.tsx
import type { LucideIcon } from "lucide-react";

interface TaskRowProps {
  type: string;
  company?: string;
  role?: string;
  text?: string;
  icon: LucideIcon;
}

export function TaskRow({ type, company, role, text, icon: Icon }: TaskRowProps) {
  return (
    <div className="bg-base-100 border border-base-200 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-error font-semibold">[!]</span>
        <span className="text-sm text-base-content/90">
          {type === "relance" ? `Relancer ${company} (${role})` : text}
        </span>
      </div>
      <button className="btn btn-square btn-sm btn-ghost text-primary bg-primary/10 hover:bg-primary/20 border-none">
        <Icon className="w-5 h-5" />
      </button>
    </div>
  );
}