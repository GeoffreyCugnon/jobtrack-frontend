import { Plus } from "lucide-react";

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
      {/* En-tête de la section alignée */}
      <div className="flex items-center justify-between px-4 mb-4">
        <h3 className="font-bold text-lg text-base-content">Compétences</h3>
        <button className="btn btn-ghost btn-circle btn-sm bg-base-200 hover:bg-base-300 transition-colors">
          <Plus className="w-4 h-4 text-base-content/70" />
        </button>
      </div>
      
      {/* Corps des compétences structuré sans div externe lourde */}
      <div className="bg-base-100 p-4 shadow-sm mb-3 rounded-none sm:rounded-box space-y-5 w-full">
        {skills.map((group) => (
          <div key={group.category} className="space-y-2">
            <p className="text-xs font-bold text-base-content/40 uppercase tracking-wider">
              {group.category}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <span 
                  key={skill} 
                  className="badge badge-md bg-primary/10 text-primary border-none font-medium py-3 px-3"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}