import type { LucideIcon } from "@/lib/icons";

interface EventRowProps {
  text: string;
  icon: LucideIcon;
  time?: string;
}

export function EventRow({ text, icon: Icon, time }: EventRowProps) {
  return (
    <div className="flex items-center gap-2 py-2 first:pt-0 last:pb-0">
      <span className="w-6 h-full flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-base-content/60" />
      </span>
      <div className="min-w-0">
        <span className="block text-sm text-base-content/80 leading-5">
          {text}
        </span>
        {time ? (
          <span className="text-xs text-base-content/50">{time}</span>
        ) : null}
      </div>
    </div>
  );
}
