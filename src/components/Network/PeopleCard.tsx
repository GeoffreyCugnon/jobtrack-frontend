import { Link } from "react-router";
import { Avatar } from "../UI/Avatar";
import { memberHeadline, memberInitials, memberName } from "../../utils/member";
import type { User } from "../../types/user.type";
import { useTheme } from "../../context/Theme/useTheme";
import { THEME_DARK } from "../../context/Theme/themeContextInstance";

interface PeopleCardProps {
  user: User;
  index: number;
  /** Libellé du bouton d'action (défaut « Se connecter »). */
  actionLabel?: string;
  /** Bouton grisé (invitation déjà envoyée, relation déjà en place…). */
  actionDisabled?: boolean;
  onAction: () => void;
  /** Ligne secondaire sous le nom. Défaut : intitulé de poste dérivé. */
  caption?: string;
  /** Carte "recrutement" : anneau primary + pastille #Hiring. Défaut `true`. */
  hiring?: boolean;
}

export function PeopleCard({
  user,
  index,
  actionLabel = "Se connecter",
  actionDisabled = false,
  onAction,
  caption,
  hiring = true,
}: PeopleCardProps) {
  const name = memberName(user);
  const initials = memberInitials(user);
  const secondary = caption ?? memberHeadline(user, index);
  const { theme } = useTheme();
  const isDark = theme === THEME_DARK;

  return (
    <div className="flex flex-col overflow-hidden rounded-box border border-base-200 bg-base-100">
      <Link
        to={`/members/${user.id}`}
        className="flex flex-1 flex-col transition-colors hover:bg-base-200/40"
      >
        <div
          className={`h-12 w-full bg-linear-to-r ${
            isDark ? "from-white/30 to-secondary/70" : "from-primary/70 to-secondary/70"
          }`}
        />

        <div className="-mt-9 flex flex-col items-center px-3 text-center">
          <div className="relative">
            <div
              className={`rounded-full bg-base-100 p-0.5 ring-4 ${
                hiring ? (isDark ? "ring-white" : "ring-primary") : "ring-base-200"
              }`}
            >
              <Avatar
                label={initials}
                avatarUrl={user.avatar_url ?? undefined}
                size="lg"
              />
            </div>
            {hiring && (
              <span
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide shadow ${
                  isDark ? "bg-white text-black" : "bg-primary text-primary-content"
                }`}
              >
                #Hiring
              </span>
            )}
          </div>

          <p
            className={`${
              hiring ? "mt-3.5" : "mt-2"
            } line-clamp-1 font-semibold text-base-content`}
          >
            {name}
          </p>
          <p className="mt-0.5 line-clamp-2 min-h-8 text-xs text-base-content/60">
            {secondary}
          </p>
        </div>
      </Link>

      <div className="px-3 pt-2 pb-3">
        <button
          type="button"
          onClick={onAction}
          disabled={actionDisabled}
          className={
            isDark
              ? "btn btn-sm w-full rounded-full border border-white text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-white"
              : "btn btn-outline btn-primary btn-sm w-full rounded-full disabled:btn-outline"
          }
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
