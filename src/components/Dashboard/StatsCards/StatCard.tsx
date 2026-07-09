// src/components/dashboard/StatCard.tsx
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
}

export function Card({ label, count, icon: Icon }: StatCardProps) {
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm text-center">
      <div className="card-body p-4 flex flex-col items-center justify-center">
        <Icon className="w-6 h-6 text-primary mb-2" />
        <div className="text-2xl font-bold mb-1">{count}</div>
        <div className="text-sm text-base-content/70">{label}</div>
      </div>
    </div>
  );
}
