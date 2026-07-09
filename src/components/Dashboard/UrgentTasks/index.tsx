// src/components/dashboard/urgenttasks/index.tsx
import { TaskRow } from "./TaskRow";
import type { LucideIcon } from "lucide-react";

interface TaskItem {
  id: number;
  type: string;
  company?: string;
  role?: string;
  text?: string;
  icon: LucideIcon;
}

interface UrgentTasksProps {
  tasks: TaskItem[];
}

export function UrgentTasks({ tasks }: UrgentTasksProps) {
  return (
    <>
      <h2 className="text-xs uppercase tracking-wide text-base-content/50 mb-3">
        À Faire Ce Jour
      </h2>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskRow key={task.id} {...task} />
        ))}
      </div>
    </>
  );
}