import { Avatar } from "../UI/Avatar";
import type { User } from "../../types/user.type";

// Pas de "headline" sur le modèle User : intitulé de démo déterministe.
const HEADLINES = [
  "Talent Acquisition Partner",
  "Référent·e recrutement",
  "IT Recruiter",
  "Chargé·e de recrutement",
  "Assistant·e RH",
  "Responsable talent",
  "Tech Recruiter",
  "People & Culture",
];

interface PeopleCardProps {
  user: User;
  index: number;
  onAction: () => void;
}

export function PeopleCard({ user, index, onAction }: PeopleCardProps) {
  const name =
    `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.email;
  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
    "?";
  const headline = HEADLINES[(Number(user.id) || index) % HEADLINES.length];
  const actionLabel = index % 2 === 0 ? "Se connecter" : "Suivre";

  return (
    <div className="flex flex-col overflow-hidden rounded-box border border-base-200 bg-base-100">
      <div className="h-12 w-full bg-linear-to-r from-primary/70 to-secondary/70" />

      <div className="-mt-9 flex flex-col items-center px-3 pb-3 text-center">
        <div className="relative">
          <div className="rounded-full bg-base-100 p-0.5 ring-4 ring-primary">
            <Avatar
              label={initials}
              avatarUrl={user.avatar_url ?? undefined}
              size="lg"
            />
          </div>
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary-content shadow">
            #Hiring
          </span>
        </div>

        <p className="mt-3.5 line-clamp-1 font-semibold text-base-content">
          {name}
        </p>
        <p className="mt-0.5 line-clamp-2 min-h-8 text-xs text-base-content/60">
          {headline}
        </p>

        <button
          type="button"
          onClick={onAction}
          className="btn btn-outline btn-primary btn-sm mt-3 w-full rounded-full"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
