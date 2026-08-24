import { SkillCategory } from "./SkillCategory";
import { SectionCard } from "../../Layout/SectionCard";

interface SkillGroup {
  category: string;
  items: string[];
}

interface ProfileSkillsProps {
  skills: SkillGroup[];
  onAdd?: () => void;
}

export function ProfileSkills({ skills, onAdd }: ProfileSkillsProps) {
  return (
    <SectionCard
      title="Compétences"
      onAdd={onAdd}
      addLabel="Ajouter une compétence"
    >
      <div className="space-y-3">
        {skills.map((group) => (
          <SkillCategory
            key={group.category}
            category={group.category}
            items={group.items}
          />
        ))}
      </div>
    </SectionCard>
  );
}
