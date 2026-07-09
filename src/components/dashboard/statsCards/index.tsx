// src/components/dashboard/statscards/index.tsx
import { Card } from "./statCard";
import type { LucideIcon } from "lucide-react";

// 1. On remet les interfaces indispensables pour TypeScript
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
      <h2 className="text-sm uppercase tracking-wide text-gray-600 mb-3">
        Stats Rapides
      </h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {stats.map((stat) => (
          // 2. On utilise le bon nom du composant exporté par card.tsx
          <Card key={stat.label} {...stat} />
        ))}
      </div>
    </>
  );
}