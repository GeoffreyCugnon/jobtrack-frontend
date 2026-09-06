import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { Header } from "../components/Layout/Header";
import { PeopleCard } from "../components/Network/PeopleCard";
import { UserApi } from "../api/user.api";
import { queryKeys } from "../api/query-keys";
import { useAuthStore } from "../store/auth.store";
import { useToastStore } from "../store/toast.store";
import {
  memberHeadline,
  memberMutualCount,
  memberSharedCompany,
  memberSharedSkills,
} from "../utils/member";
import type { User } from "../types/user.type";

const PER_SECTION = 4;

const notify = () =>
  useToastStore.getState().addToast("Bientôt disponible", "info");

function NavRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-base-200 bg-base-100 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-base-200"
    >
      <span className="font-medium text-base-content">{label}</span>
      <ArrowRight size={18} className="text-base-content/50" />
    </button>
  );
}

// Rotation du même pool d'utilisateurs pour éviter d'afficher exactement
// les mêmes personnes dans chaque section quand la base est petite.
function rotate<T>(arr: T[], offset: number): T[] {
  if (arr.length === 0) return arr;
  const n = offset % arr.length;
  return arr.slice(n).concat(arr.slice(0, n));
}

interface SectionConfig {
  key: string;
  title: string;
  description?: string;
  hiring?: boolean;
  caption: (user: User, index: number) => string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: "hiring",
    hiring: true,
    title: "Personnes qui recrutent à votre poste",
    caption: (user, index) => memberHeadline(user, index),
  },
  {
    key: "mutual",
    title: "Personnes que vous pourriez connaître",
    description: "D'après vos relations en commun",
    caption: (user) => `${memberMutualCount(user)} relations en commun`,
  },
  {
    key: "activity",
    title: "En fonction de votre activité récente",
    description: "Entreprises et publications que vous suivez",
    caption: (user) => `Suit aussi ${memberSharedCompany(user)}`,
  },
  {
    key: "personalized",
    title: "Suggestions personnalisées",
    description: "Compétences et intitulé de poste en commun",
    caption: (user) =>
      `Compétences communes · ${memberSharedSkills(user).join(", ")}`,
  },
];

function PeopleSection({
  config,
  people,
}: {
  config: SectionConfig;
  people: User[];
}) {
  if (people.length === 0) return null;

  return (
    <section className="mt-2 bg-base-100">
      <div className="px-4 pt-4">
        <h2 className="text-lg font-bold text-base-content">{config.title}</h2>
        {config.description && (
          <p className="mt-0.5 text-sm text-base-content/60">
            {config.description}
          </p>
        )}

        <div className="mt-3 grid grid-cols-2 gap-3">
          {people.map((user, index) => (
            <PeopleCard
              key={user.id}
              user={user}
              index={index}
              hiring={Boolean(config.hiring)}
              caption={config.caption(user, index)}
              onAction={notify}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={notify}
        className="mt-4 flex w-full items-center justify-center gap-1.5 border-t border-base-200 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-base-200"
      >
        Tout afficher
        <ArrowRight size={16} />
      </button>
    </section>
  );
}

export function Network() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => UserApi.getAll(),
    enabled: isAuthenticated,
  });

  const people = (data ?? []).filter(
    (u) => String(u.id) !== String(currentUser?.id),
  );

  return (
    <div className="flex-1 flex flex-col bg-base-200 pb-6">
      <Header />

      <div className="mt-2 bg-base-100">
        <NavRow label="Invitations" onClick={notify} />
        <NavRow label="Gérer mon réseau" onClick={notify} />
      </div>

      {!isAuthenticated ? (
        <p className="mt-2 bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Connectez-vous pour voir des suggestions.
        </p>
      ) : isPending ? (
        <p className="mt-2 bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Chargement…
        </p>
      ) : isError ? (
        <p className="mt-2 bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Impossible de charger les suggestions.
        </p>
      ) : people.length === 0 ? (
        <p className="mt-2 bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Aucune suggestion pour l'instant.
        </p>
      ) : (
        SECTIONS.map((config, i) => (
          <PeopleSection
            key={config.key}
            config={config}
            people={rotate(people, i * PER_SECTION).slice(0, PER_SECTION)}
          />
        ))
      )}
    </div>
  );
}
