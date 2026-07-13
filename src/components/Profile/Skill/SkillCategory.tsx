// src/components/Profile/SkillCategory.tsx
interface SkillCategoryProps {
  category: string;
  items: string[];
}

export function SkillCategory({ category, items }: SkillCategoryProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
        {category}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((skill) => (
          <span
            key={skill}
            className="badge badge-md bg-primary/10 text-primary border-none font-medium py-1.5 px-3"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}