import { useNavigate } from "react-router";
import { User } from "lucide-react";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";

import { ProfileIdentity } from "../../components/Profile/ProfileIdentity";
import { ProfileContact } from "../../components/Profile/Contact/ProfileContact";
import { ProfileSkills } from "../../components/Profile/Skill/ProfileSkills";
import { useAuthStore } from "../../store/auth.store";
import { getUserDisplay } from "../../utils/user-display";

// Champs encore fictifs : le modèle `User` côté Backend ne porte pour l'instant
// que l'identité (nom, email). Le reste (titre, bio, localisation, réseaux,
// disponibilité...) reste une maquette en attendant d'étoffer `User` ou de
// dédier un modèle profil.
const MOCK_PROFILE_DETAILS = {
  title: "Développeur Web Junior",
  location: "Paris, France",
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
  const { firstName, lastName, initials, email, avatarUrl } = getUserDisplay(
    useAuthStore((state) => state.user),
  );
  const user = {
    firstName,
    lastName,
    initials,
    email,
    avatarUrl,
    ...MOCK_PROFILE_DETAILS,
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Mon profil"
          description="Vos informations visibles par les recruteurs"
          icon={User}
        />

        <div className="-mx-4 sm:mx-0 mt-3">
          <ProfileIdentity
            user={user}
            onEdit={() => navigate("/profile/edit")}
          />
          <ProfileContact
            user={user}
            onAdd={() => navigate("/profile/contact/edit")}
          />
          <ProfileSkills
            skills={skills}
            onAdd={() => navigate("/profile/skills/edit")}
          />
        </div>
      </PageContainer>
    </div>
  );
}
