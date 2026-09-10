import { type Icon as IconType } from "@phosphor-icons/react";

interface EmptyStateProps {
  icon: IconType;
  message: string;
}

export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <Icon aria-hidden="true" className="w-6 h-6 text-base-content/40" />
      <p className="text-sm text-base-content/60 max-w-50">{message}</p>
    </div>
  );
}
