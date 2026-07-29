import type { LucideIcon } from "lucide-react";

interface PageTitleProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function PageTitle({ title, description, icon: Icon }: PageTitleProps) {
  return (
    <header className="pb-1">
      <h1 className="flex items-end gap-2 text-xl font-semibold text-base-content">
        {Icon ? (
          <Icon className="w-5 h-5 text-base-content -translate-y-0.75" />
        ) : null}
        {title}
      </h1>
      {description ? (
        <p className="mt-1 text-sm text-base-content/60">{description}</p>
      ) : null}
    </header>
  );
}
