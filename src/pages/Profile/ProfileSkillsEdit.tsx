import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Sparkles, X } from "lucide-react";
import { Header } from "../../components/Layout/Header";
import { BTN_FOCUS_RING, INPUT_CLASS } from "../../constants/styles";

interface SkillGroup {
  category: string;
  items: string[];
}

const initialSkills: SkillGroup[] = [
  {
    category: "Front-end",
    items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vite"],
  },
  {
    category: "Back-end",
    items: ["Node.js", "Express", "REST API", "PostgreSQL"],
  },
  {
    category: "Outils",
    items: ["Git", "GitHub", "Figma", "VS Code", "Docker (bases)"],
  },
  {
    category: "Soft skills",
    items: ["Autonomie", "Curiosité", "Esprit d'équipe", "Adaptabilité"],
  },
];

const OTHER_CATEGORY = "Autres";

export function ProfileSkillsEdit() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");

  const removeSkill = (category: string, item: string) => {
    setSkills((groups) =>
      groups
        .map((g) =>
          g.category === category
            ? { ...g, items: g.items.filter((i) => i !== item) }
            : g
        )
        .filter((g) => g.items.length > 0)
    );
  };

  const addSkill = () => {
    const value = newSkill.trim();
    if (!value) return;
    setSkills((groups) => {
      const hasOthers = groups.some((g) => g.category === OTHER_CATEGORY);
      if (hasOthers) {
        return groups.map((g) =>
          g.category === OTHER_CATEGORY
            ? { ...g, items: [...g.items, value] }
            : g
        );
      }
      return [...groups, { category: OTHER_CATEGORY, items: [value] }];
    });
    setNewSkill("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: brancher sur PATCH /user/skills
    navigate("/app/profile");
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate("/app/profile")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          Retour au profil
        </button>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles size={18} />
              </div>
              <h1 className="text-lg font-semibold">Modifier mes compétences</h1>
            </div>

            <div className="flex flex-col gap-5">
              {skills.map((group) => (
                <div key={group.category} className="space-y-2">
                  <p className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="badge badge-md bg-primary/10 text-primary border-none font-medium gap-1.5 py-1.5 px-3"
                      >
                        {item}
                        <button
                          type="button"
                          aria-label={`Retirer ${item}`}
                          onClick={() => removeSkill(group.category, item)}
                          className="hover:text-error"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-6">
              <input
                type="text"
                placeholder="Ajouter une compétence..."
                className={INPUT_CLASS}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                className={`btn btn-secondary ${BTN_FOCUS_RING.secondary}`}
              >
                Ajouter
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="btn btn-primary mt-6 self-start"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
