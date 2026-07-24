import { useNavigate } from "react-router";
import { User } from "lucide-react";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";

import { ProfileIdentity } from "../../components/Profile/ProfileIdentity";
import { ProfileContact } from "../../components/Profile/Contact";
import { ProfileSkills } from "../../components/Profile/Skill";

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
    <>
      <Header />
      <PageContainer className="py-3">
        <PageTitle title="Mon profil" icon={User} />

        <div className="-mx-4 sm:mx-0 mt-3">
          <ProfileIdentity
            user={user}
            onEdit={() => navigate("/app/profile/edit")}
          />
          <ProfileContact
            user={user}
            onAdd={() => navigate("/app/profile/contact/edit")}
          />
          <ProfileSkills
            skills={skills}
            onAdd={() => navigate("/app/profile/skills/edit")}
          />
        </div>
      </PageContainer>
    </>
  );
}
