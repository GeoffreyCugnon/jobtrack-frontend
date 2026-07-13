// src/components/Profile/ProfileSkills.tsx
import { Plus } from "lucide-react";
import { SkillCategory } from "./SkillCategory";

interface SkillGroup {
  category: string;
  items: string[];
}

interface ProfileSkillsProps {
  skills: SkillGroup[];
}

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  return (
    <>
      <div className="flex items-center gap-1 px-4 my-3 translate-y-0.5">
        <h3 className="font-bold text-lg text-base-content">Compétences</h3>
        <button
          aria-label="Ajouter une compétence"
          className="btn btn-ghost btn-circle btn-sm bg-base-200 hover:bg-base-300 transition-colors"
        >
          <Plus className="w-4 h-4 text-base-content/70" />
        </button>
      </div>

      <div className="bg-base-100 p-4 shadow-sm rounded-none sm:rounded-box space-y-3 w-full">
        {skills.map((group) => (
          <SkillCategory key={group.category} category={group.category} items={group.items} />
        ))}
      </div>
    </>
  );
}