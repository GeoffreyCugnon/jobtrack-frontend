import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "../components/Layout/PageContainer";

import { ProfileIdentity } from "../components/Profile/ProfileIdentity";
import { ProfileContact } from "../components/Profile/Contact";
import { ProfileSkills } from "../components/Profile/Skill";

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

export function Profile() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-base-200 text-base-content">
      <header className="bg-base-300 border-b border-base-content/10 sticky top-0 z-10">
        <PageContainer className="h-14 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <ArrowLeft className="w-5 h-5 text-base-content" />
          </button>
          <h1 className="text-lg font-semibold ml-2">Mon profil</h1>
        </PageContainer>
      </header>

      <div className="max-w-5xl mx-auto px-0 sm:px-4 pb-0 sm:pb-4">
        <ProfileIdentity user={user} />
        <ProfileContact user={user} />
        <ProfileSkills skills={skills} />
      </div>
    </div>
  );
}
