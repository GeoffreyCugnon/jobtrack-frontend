// src/components/dashboard/RecentEvents.tsx
import { type LucideIcon } from "lucide-react";

interface EventItem {
  id: number;
  text: string;
  icon: LucideIcon;
  variant?: "default" | "error";
}

export function RecentEvents({ events }: { events: EventItem[] }) {
  return (
    <>
      <h2 className="text-xs uppercase tracking-wide text-base-content/50 mb-3">
        Derniers Événements
      </h2>
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body p-4 divide-y divide-base-200">
          {events.map(({ id, text, icon: Icon, variant }) => (
            <div
              key={id}
              className="flex items-center gap-2 py-2 first:pt-0 last:pb-0"
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  variant === "error" ? "text-error" : "text-base-content/50"
                }`}
              />
              <span className="text-base-content/80">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
