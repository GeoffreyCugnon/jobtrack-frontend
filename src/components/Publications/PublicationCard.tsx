import { useState } from "react";
import { Link } from "react-router";
import { ChatCircle, DotsThree, Heart, PaperPlaneTilt, Repeat, ThumbsUp, X } from "@phosphor-icons/react";

import { Avatar } from "../UI/Avatar";
import { useToastStore } from "../../store/toast.store";
import type { Publication } from "../../types/publication.types";

interface Props {
  publication: Publication;
  /** true (défaut) : la carte renvoie vers `/publications/:id`. false sur la
   *  page de détail elle-même, où la publication est déjà le sujet. */
  linkToDetail?: boolean;
  /** Croix en haut à droite : masque le post (fil) ou ferme le détail. */
  onHide?: () => void;
}

const CLAMP_CHARS = 280;
// Une image dont le ratio hauteur/largeur dépasse ce seuil est repliée
// (hauteur max) avec un « … plus » pour l'afficher en entier.
const TALL_IMAGE_RATIO = 0.9;

const TYPE_LABEL: Record<string, string> = {
  ARTICLE: "Article",
  ANNONCE: "Annonce",
  ACTU: "Actu",
};

function authorInitials(name: string): string {
  const [a = "", b = ""] = name.trim().split(/\s+/);
  return `${a[0] ?? ""}${b[0] ?? ""}`.toUpperCase() || "?";
}

export default function PublicationCard({
  publication,
  linkToDetail = true,
  onHide,
}: Props) {
  const to = `/publications/${publication.id}`;
  const [expanded, setExpanded] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imageTall, setImageTall] = useState(false);
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

  const actionBtn =
    "flex items-center gap-1.5 rounded-field px-2.5 py-2 text-sm hover:bg-base-200";

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
              <DotsThree className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Masquer ce post"
              onClick={onHide ?? notify}
              className="btn btn-ghost btn-sm btn-square"
            >
              <X className="h-4 w-4" />
            </button>
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

      {publication.imageUrl && (
        <div
          className={`relative mt-3 overflow-hidden ${
            imageTall && !imageExpanded ? "max-h-112" : ""
          }`}
        >
          <img
            src={publication.imageUrl}
            alt=""
            loading="lazy"
            onLoad={(e) => {
              const img = e.currentTarget;
              setImageTall(
                img.naturalHeight / img.naturalWidth > TALL_IMAGE_RATIO,
              );
            }}
            className="block w-full object-cover"
          />
          {imageTall && !imageExpanded && (
            <button
              type="button"
              onClick={() => setImageExpanded(true)}
              className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-linear-to-t from-base-100 via-base-100/80 to-transparent pt-12 pb-2 text-sm font-medium text-primary"
            >
              … plus
            </button>
          )}
        </div>
      )}

      {/* Une seule ligne : actions à gauche, résumé des réactions à droite.
          Pas de marge haute quand une image la précède (elle colle l'image). */}
      <div
        className={`${
          publication.imageUrl ? "" : "mt-2"
        } flex items-center justify-between border-t border-base-200 px-2 py-1 text-base-content/60`}
      >
        <div className="flex items-center">
          <button type="button" onClick={notify} className={actionBtn}>
            <ThumbsUp className="h-5 w-5" weight="bold" />
            {publication.likesCount}
          </button>

          {linkToDetail ? (
            <Link to={to} className={actionBtn}>
              <ChatCircle className="h-5 w-5" weight="bold" />
              {publication.commentsCount}
            </Link>
          ) : (
            <span className={actionBtn}>
              <ChatCircle className="h-5 w-5" weight="bold" />
              {publication.commentsCount}
            </span>
          )}

          <button type="button" onClick={notify} className={actionBtn}>
            <Repeat className="h-5 w-5" weight="bold" />
            {publication.sharesCount}
          </button>

          <button
            type="button"
            onClick={notify}
            aria-label="Partager"
            className={actionBtn}
          >
            <PaperPlaneTilt className="h-5 w-5" weight="bold" />
          </button>
        </div>

        <span className="flex items-center gap-1 pr-2 text-xs text-base-content/50">
          <span className="flex -space-x-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-content ring-1 ring-base-100">
              <ThumbsUp className="h-2.5 w-2.5" weight="fill" />
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-error text-error-content ring-1 ring-base-100">
              <Heart className="h-2.5 w-2.5" weight="fill" />
            </span>
          </span>
          {publication.likesCount}
        </span>
      </div>
    </article>
  );
}
