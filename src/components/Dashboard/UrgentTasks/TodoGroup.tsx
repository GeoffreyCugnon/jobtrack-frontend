import type { LucideIcon } from "lucide-react";
import { TaskRow, type TaskDueCategory } from "./TaskRow";

interface TodoItem {
  id: number;
  type: string;
  company?: string;
  role?: string;
  text?: string;
  icon: LucideIcon;
  time?: string;
  dueCategory: TaskDueCategory;
}

interface TodoGroupProps {
  label: string;
  items: TodoItem[];
}

// Sous-section de la todo — même pattern que SideMenu/MenuSection : un
// regroupement nommé (ici "Aujourd'hui" / "À venir") qui rend une liste de
// lignes du même type.
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
