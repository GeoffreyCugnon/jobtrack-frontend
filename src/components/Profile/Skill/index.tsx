import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { SkillCategory } from "./SkillCategory";

interface SkillGroup {
  category: string;
  items: string[];
}

interface ProfileSkillsProps {
  skills: SkillGroup[];
  onAdd?: () => void;
}

export function ProfileSkills({ skills, onAdd }: ProfileSkillsProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-base-200 rounded-none sm:rounded-box overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((v) => !v);
          }
        }}
        aria-expanded={isOpen}
        className="flex items-center justify-between px-4 py-3 bg-base-300 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-base-content">Compétences</h3>
          <button
            type="button"
            aria-label="Ajouter une compétence"
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.();
            }}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Plus className="w-4 h-4 text-base-content/70" />
          </button>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-base-content/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="bg-base-100 p-4 border-t border-base-200 space-y-3">
          {skills.map((group) => (
            <SkillCategory
              key={group.category}
              category={group.category}
              items={group.items}
            />
          ))}
        </div>
      )}
    </div>
  );
}
