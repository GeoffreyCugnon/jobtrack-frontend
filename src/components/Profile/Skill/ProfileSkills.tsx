import { SectionCard } from "../../Layout/SectionCard";

interface ProfileSkillsProps {
  skills: string[];
  onAdd?: () => void;
}

export function ProfileSkills({ skills, onAdd }: ProfileSkillsProps) {
  return (
    <SectionCard
      title="Compétences"
      onAdd={onAdd}
      addLabel="Modifier les compétences"
    >
      {skills.length === 0 ? (
        <p className="text-sm text-base-content/50">
          Aucune compétence renseignée.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="badge badge-md bg-primary/10 text-primary border-none font-medium py-1.5 px-3"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
