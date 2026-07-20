import React from "react";
import { ChevronRight } from "lucide-react";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
}

export default function SettingsItem({ icon, label, value, onClick }: SettingsItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between bg-base-100 px-4 py-4 text-left transition-colors hover:bg-base-200 border-b border-base-200 last:border-b-0"
    >
      <span className="flex items-center gap-3">
        <span className="text-base-content/60">{icon}</span>
        <span className="font-medium text-base-content">{label}</span>
      </span>
      <span className="flex items-center gap-2 text-base-content/50">
        {value && <span className="text-sm">{value}</span>}
        <ChevronRight size={18} />
      </span>
    </button>
  );
}