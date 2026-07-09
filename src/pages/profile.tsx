import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

// Importations des sous-composants fraîchement créés
import { ProfileIdentity } from "../components/Profile/ProfileIdentity";
import { ProfileContact } from "../components/Profile/ProfileContact";
import { ProfileSkills } from "../components/Profile/ProfileSkills";

const user = {
  firstName: "Geoffrey",
  lastName: "Cugnon",
  initials: "GC",
  title: "Développeur Web Junior",
  location: "Paris, France",
  email: "junior@dev.fr",
  phone: "+33 6 12 34 56 78",
  website: "geoffreycugnon.dev",
  linkedin: "linkedin.com/in/gcugnon",
  github: "github.com/github",
  bio: "Développeur web passionné en reconversion, spécialisé React et Node.js. À la recherche d'opportunités en startup ou scale-up pour contribuer à des projets ambitieux.",
  availability: "Disponible immédiatement",
  jobType: "CDI · Freelance",
  salary: "35-45k€",
};

const skills = [
  { category: "Front-end", items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vite"] },
  { category: "Back-end", items: ["Node.js", "Express", "REST API", "PostgreSQL"] },
  { category: "Outils", items: ["Git", "GitHub", "Figma", "VS Code", "Docker (bases)"] },
  { category: "Soft skills", items: ["Autonomie", "Curiosité", "Esprit d'équipe", "Adaptabilité"] },
];

export function Profile() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-base-200 text-base-content">
      {/* Header Local */}
      <header className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-10 px-4">
        <div className="flex-none">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-circle btn-sm">
            <ArrowLeft className="w-5 h-5 text-base-content" />
          </button>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-semibold ml-2">Mon profil</h1>
        </div>
      </header>

      {/* Conteneur fluide : prend tout l'espace sur petit écran, se centre et se limite sur desktop */}
      <main className="w-full max-w-3xl mx-auto p-0 sm:p-4 space-y-4 mt-0 sm:mt-4 pb-4">
        <ProfileIdentity user={user} />
        <ProfileContact user={user} />
        <ProfileSkills skills={skills} />
        <div className="h-24 w-full bg-base-200 pointer-events-none" />
      </main>
    </div>
  );
}