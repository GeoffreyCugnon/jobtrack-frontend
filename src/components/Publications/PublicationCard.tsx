import { useState } from "react";
import { Link } from "react-router";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  ThumbsUp,
  X,
} from "lucide-react";

import { Avatar } from "../UI/Avatar";
import { useToastStore } from "../../store/toast.store";
import type { Publication } from "../../types/publication.types";

interface Props {
  publication: Publication;
  /** true (défaut) : la carte renvoie vers `/publications/:id`. false sur la
   *  page de détail elle-même, où la publication est déjà le sujet. */
  linkToDetail?: boolean;
  /** Fournie sur la page de détail : affiche une croix de fermeture. */
  onClose?: () => void;
}

const CLAMP_CHARS = 280;

const TYPE_LABEL: Record<string, string> = {
  ARTICLE: "Article",
  ANNONCE: "Annonce",
  ACTU: "Actu",
};

function authorInitials(name: string): string {
  const [a = "", b = ""] = name.trim().split(/\s+/);
  return `${a[0] ?? ""}${b[0] ?? ""}`.toUpperCase() || "?";
}

function plural(n: number, word: string): string {
  return `${n} ${word}${n > 1 ? "s" : ""}`;
}

export default function PublicationCard({
  publication,
  linkToDetail = true,
  onClose,
}: Props) {
  const to = `/publications/${publication.id}`;
  const [expanded, setExpanded] = useState(false);
  const notify = () =>
    useToastStore.getState().addToast("Bientôt disponible", "info");

  const isLong = publication.content.length > CLAMP_CHARS;
  const shown =
    !isLong || expanded
      ? publication.content
      : publication.content.slice(0, CLAMP_CHARS).trimEnd() + "…";

  const identity = (
    <div className="flex items-start gap-3">
      <Avatar
        label={authorInitials(publication.authorName)}
        avatarUrl={publication.authorAvatarUrl ?? undefined}
        size="md"
      />
      <div className="min-w-0 leading-tight">
        <p className="font-semibold text-base-content truncate">
          {publication.authorName}
        </p>
        <p className="text-xs text-base-content/50">
          {TYPE_LABEL[publication.type] ?? publication.type} ·{" "}
          {publication.timeAgo}
        </p>
      </div>
    </div>
  );

  // Dans le fil, tout l'en-tête mène au détail du post. Sur la page de détail
  // (le post est déjà le sujet), l'en-tête mène à la fiche de l'auteur.
  const header = linkToDetail ? (
    <Link to={to} className="block min-w-0 hover:opacity-90">
      {identity}
    </Link>
  ) : (
    <Link
      to={`/members/${publication.authorId}`}
      className="inline-block min-w-0 hover:opacity-90"
    >
      {identity}
    </Link>
  );

  return (
    <article className="bg-base-100">
      <div className="px-4 pt-3">
        <div className="flex items-start justify-between gap-2">
          {header}
          <div className="flex shrink-0 items-center text-base-content/50">
            <button
              type="button"
              aria-label="Plus d'options"
              onClick={notify}
              className="btn btn-ghost btn-circle btn-sm"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {onClose && (
              <button
                type="button"
                aria-label="Fermer"
                onClick={onClose}
                className="btn btn-ghost btn-circle btn-sm"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 text-[15px] leading-relaxed text-base-content/90 whitespace-pre-line">
          {publication.title && (
            <span className="font-medium">{publication.title}. </span>
          )}
          {shown}
          {isLong && !expanded && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="ml-1 text-sm font-medium text-base-content/50 hover:text-primary"
            >
              plus
            </button>
          )}
        </div>
      </div>

      {/* Résumé des réactions (façon LinkedIn) : petit cumul d'icônes + total,
          puis nombre de commentaires / republications. */}
      <div className="mt-3 flex items-center justify-between px-4 text-xs text-base-content/50">
        <span className="flex items-center gap-1.5">
          <span className="flex -space-x-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-content ring-1 ring-base-100">
              <ThumbsUp className="h-2.5 w-2.5" fill="currentColor" />
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-error text-error-content ring-1 ring-base-100">
              <Heart className="h-2.5 w-2.5" fill="currentColor" />
            </span>
          </span>
          {publication.likesCount}
        </span>
        <span>
          {plural(publication.commentsCount, "commentaire")} ·{" "}
          {plural(publication.sharesCount, "republication")}
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between border-t border-base-200 px-2 py-1 text-base-content/60">
        <button
          type="button"
          onClick={notify}
          className="flex items-center gap-1.5 rounded-field px-3 py-2 text-sm hover:bg-base-200 hover:text-primary"
        >
          <ThumbsUp className="h-4 w-4" />
          {publication.likesCount}
        </button>

        {linkToDetail ? (
          <Link
            to={to}
            className="flex items-center gap-1.5 rounded-field px-3 py-2 text-sm hover:bg-base-200"
          >
            <MessageCircle className="h-4 w-4" />
            {publication.commentsCount}
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-2 text-sm">
            <MessageCircle className="h-4 w-4" />
            {publication.commentsCount}
          </span>
        )}

        <button
          type="button"
          onClick={notify}
          className="flex items-center gap-1.5 rounded-field px-3 py-2 text-sm hover:bg-base-200"
        >
          <Repeat2 className="h-4 w-4" />
          {publication.sharesCount}
        </button>

        <button
          type="button"
          onClick={notify}
          className="flex items-center gap-1.5 rounded-field px-3 py-2 text-sm hover:bg-base-200"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
