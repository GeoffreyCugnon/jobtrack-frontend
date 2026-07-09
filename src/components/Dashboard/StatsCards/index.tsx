// src/components/dashboard/statscards/index.tsx
import { Card } from "./StatCard";
import type { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  count: number;
  icon: LucideIcon;
}

interface StatCardsProps {
  stats: StatItem[];
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <>
      <h2 className="text-xs uppercase tracking-wide text-base-content/50 mb-3">
        Stats Rapides
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} {...stat} />
        ))}
      </div>
    </>
  );
}