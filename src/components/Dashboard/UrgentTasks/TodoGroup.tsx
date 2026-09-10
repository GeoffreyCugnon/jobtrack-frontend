import type { LucideIcon } from "@/lib/icons";
import { TaskRow } from "./TaskRow";

export interface TodoItem {
  id: number;
  text: string;
  icon: LucideIcon;
  time?: string;
  to: string;
}

interface TodoGroupProps {
  label: string;
  items: TodoItem[];
}

// Sous-section de la todo : un regroupement nommé (ici "À venir") qui rend une
// liste de lignes du même type.
export function TodoGroup({ label, items }: TodoGroupProps) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-1">
        {label}
      </h3>
      <div className="divide-y divide-base-200">
        {items.map(({ id, ...item }) => (
          <TaskRow key={id} {...item} />
        ))}
      </div>
    </div>
  );
}
