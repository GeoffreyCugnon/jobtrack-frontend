import { Link } from "react-router";
import { Avatar } from "../UI/Avatar";
import { memberHeadline, memberInitials, memberName } from "../../utils/member";
import type { User } from "../../types/user.type";

interface PeopleCardProps {
  user: User;
  index: number;
  onAction: () => void;
}

export function PeopleCard({ user, index, onAction }: PeopleCardProps) {
  const name = memberName(user);
  const initials = memberInitials(user);
  const headline = memberHeadline(user, index);
  const actionLabel = index % 2 === 0 ? "Se connecter" : "Suivre";

  return (
    <div className="flex flex-col overflow-hidden rounded-box border border-base-200 bg-base-100">
      <Link
        to={`/members/${user.id}`}
        className="flex flex-1 flex-col transition-colors hover:bg-base-200/40"
      >
        <div className="h-12 w-full bg-linear-to-r from-primary/70 to-secondary/70" />

        <div className="-mt-9 flex flex-col items-center px-3 text-center">
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
        </div>
      </Link>

      <div className="px-3 pt-2 pb-3">
        <button
          type="button"
          onClick={onAction}
          className="btn btn-outline btn-primary btn-sm w-full rounded-full"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
