import { useState } from "react";
import { Link } from "react-router";
import {
  BookmarkSimple,
  ChatCircle,
  DotsThreeVertical,
  EyeSlash,
  Flag,
  Heart,
  PaperPlaneTilt,
  Repeat,
  ShareNetwork,
  ThumbsDown,
  ThumbsUp,
  WarningDiamond,
  X,
} from "@phosphor-icons/react";
import type { Icon as IconType } from "@phosphor-icons/react";

import { Avatar } from "../UI/Avatar";
import { BottomSheet } from "../UI/BottomSheet";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import type { Publication } from "../../types/publication.types";

interface Props {
  publication: Publication;
  /** true (défaut) : la carte renvoie vers `/publications/:id`. false sur la
   *  page de détail elle-même, où la publication est déjà le sujet. */
  linkToDetail?: boolean;
  /** Croix en haut à droite : masque le post (fil) ou ferme le détail. */
  onHide?: () => void;
  /**
   * Aperçu à hauteur fixe (accueil invité) : texte et image sont bornés en
   * hauteur (`overflow-hidden`), en-tête et barre de réactions restent
   * toujours entiers. Les affordances d'expansion ("plus") sont masquées
   * puisqu'elles resteraient coupées par le crop.
   */
  previewCrop?: boolean;
  /** true si c'est la dernière carte de l'aperçu : retire le `mb` sous la
   *  barre de réactions (redondant avec l'espace déjà géré par les spacers
   *  autour du lien "Voir tout" dans `GuestHome`). */
  previewLast?: boolean;
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
  previewCrop = false,
  previewLast = false,
}: Props) {
  const to = `/publications/${publication.id}`;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [expanded, setExpanded] = useState(false);
  const [imageExpanded, setImageExpanded] = useState(false);
  const [imageTall, setImageTall] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  // Masquage local (pas d'endpoint dédié) : le "X" ne retire pas le post
  // directement, il le remplace par un panneau d'annulation façon LinkedIn.
  const [hidden, setHidden] = useState(false);
  const notify = () =>
    useToastStore.getState().addToast("Bientôt disponible", "info");
  const notifyAuthRequired = () =>
    useToastStore
      .getState()
      .addToast("Connectez-vous pour interagir avec les publications", "info");
  // Like / commentaire / repost / partage : réservés aux utilisateurs
  // connectés (un invité voit un toast plutôt que l'action, même placeholder).
  const handleEngagement = () => {
    if (!isAuthenticated) {
      notifyAuthRequired();
      return;
    }
    notify();
  };

  const optionItems: { icon: IconType; label: string }[] = [
    { icon: BookmarkSimple, label: "Enregistrer" },
    { icon: ShareNetwork, label: "Partager via" },
    { icon: EyeSlash, label: `Masquer les posts de ${publication.authorName}` },
    { icon: ThumbsDown, label: "Pas intéressé(e)" },
    { icon: WarningDiamond, label: "On dirait de l'IA slop" },
    { icon: Flag, label: "Signaler le post" },
  ];

  const hideFollowUpItems: { icon: IconType; label: string }[] = [
    { icon: EyeSlash, label: `Masquer les posts de ${publication.authorName}` },
    { icon: WarningDiamond, label: "On dirait de l'IA slop" },
    { icon: Flag, label: "Signaler le post" },
  ];

  if (hidden) {
    return (
      <article className="bg-base-100 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm text-base-content/70">
            Post masqué dans le fil d'actualité. Vous verrez moins de posts de
            ce genre.
          </p>
          <button
            type="button"
            onClick={() => setHidden(false)}
            className="shrink-0 cursor-pointer text-sm font-semibold text-link hover:underline"
          >
            Annuler
          </button>
        </div>

        <ul className="mt-2 divide-y divide-base-200 border-t border-base-200">
          {hideFollowUpItems.map(({ icon: OptionIcon, label }) => (
            <li key={label}>
              <button
                type="button"
                onClick={notify}
                className="flex w-full cursor-pointer items-center gap-4 py-3 text-left text-sm font-medium text-base-content hover:bg-base-200"
              >
                <OptionIcon className="h-5 w-5 shrink-0" weight="fill" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </article>
    );
  }

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
        size={previewCrop ? "sm" : "md"}
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

  // Dernière carte de l'aperçu : retire le padding bas des boutons de
  // réaction (redondant avec l'espace déjà géré par les spacers autour du
  // lien "Voir tout" dans `GuestHome`), garde le padding haut pour la cible
  // tactile.
  const actionBtn = `flex items-center gap-1.5 rounded-field mx-1 px-1.5 text-sm hover:bg-base-200 cursor-pointer ${
    previewCrop ? (previewLast ? "pt-1.5" : "py-1.5") : "py-2"
  }`;

  return (
    <article className="bg-base-100">
      <div className={`px-4 ${previewCrop ? "pt-2.5" : "pt-3"}`}>
        <div className="flex items-start justify-between gap-2">
          {header}
          {isAuthenticated && (
            <div className="flex shrink-0 items-center text-base-content/60">
              <button
                type="button"
                aria-label="Plus d'options"
                onClick={() => setOptionsOpen(true)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-base-200"
              >
                <DotsThreeVertical className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Masquer ce post"
                onClick={onHide ?? (() => setHidden(true))}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-field hover:bg-base-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-4">
        <div
          className={`${previewCrop ? "mt-1.5" : "mt-2"} text-[15px] ${
            previewCrop ? "leading-snug" : "leading-relaxed"
          } text-base-content/90 whitespace-pre-line ${
            previewCrop ? "line-clamp-2" : ""
          }`}
        >
          {publication.title && (
            <span className="font-medium">{publication.title}. </span>
          )}
          {shown}
          {isLong && !expanded && !previewCrop && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="ml-1 text-sm font-medium text-base-content/50 hover:text-link"
            >
              plus
            </button>
          )}
        </div>
      </div>

      {publication.imageUrl && !previewCrop && (
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
              className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-linear-to-t from-base-100 via-base-100/80 to-transparent pt-12 pb-2 text-sm font-medium text-link"
            >
              … plus
            </button>
          )}
        </div>
      )}

      {/* Une seule ligne : actions à gauche, résumé des réactions à droite.
          Pas de marge haute quand une image la précède (elle colle l'image).
          Resserrée en `previewCrop` (accueil invité), pour laisser un peu
          plus de place aux cartes sur l'aperçu de l'accueil invité. */}
      <div
        className={`${
          publication.imageUrl ? "" : previewCrop ? "mt-1" : "mt-2"
        } flex items-center justify-between px-2 ${
          previewCrop ? `py-0 ${previewLast ? "" : "mb-1.5"}` : "py-1"
        } text-base-content/60`}
      >
        <div className="flex items-center">
          <button type="button" onClick={handleEngagement} className={actionBtn}>
            <ThumbsUp className="h-5 w-5" weight="bold" />
            {publication.likesCount}
          </button>

          {!linkToDetail ? (
            <span className={actionBtn}>
              <ChatCircle className="h-5 w-5" weight="bold" />
              {publication.commentsCount}
            </span>
          ) : isAuthenticated ? (
            <Link to={to} className={actionBtn}>
              <ChatCircle className="h-5 w-5" weight="bold" />
              {publication.commentsCount}
            </Link>
          ) : (
            <button
              type="button"
              onClick={notifyAuthRequired}
              className={actionBtn}
            >
              <ChatCircle className="h-5 w-5" weight="bold" />
              {publication.commentsCount}
            </button>
          )}

          <button type="button" onClick={handleEngagement} className={actionBtn}>
            <Repeat className="h-5 w-5" weight="bold" />
            {publication.sharesCount}
          </button>

          <button
            type="button"
            onClick={handleEngagement}
            aria-label="Partager"
            className={actionBtn}
          >
            <PaperPlaneTilt className="h-5 w-5" weight="bold" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setReactionsOpen(true)}
          className="flex cursor-pointer items-center gap-1 pr-2 text-xs text-base-content/50 hover:underline"
        >
          <span className="flex -space-x-1">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-content ring-1 ring-base-100">
              <ThumbsUp className="h-2.5 w-2.5" weight="fill" />
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-error text-error-content ring-1 ring-base-100">
              <Heart className="h-2.5 w-2.5" weight="fill" />
            </span>
          </span>
          {publication.likesCount}
        </button>
      </div>

      <BottomSheet
        open={reactionsOpen}
        onClose={() => setReactionsOpen(false)}
        title="Réactions"
      >
        <div className="flex items-center gap-2 border-b border-base-200 pb-3">
          <span className="flex -space-x-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-content ring-2 ring-base-100">
              <ThumbsUp className="h-3.5 w-3.5" weight="fill" />
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-error text-error-content ring-2 ring-base-100">
              <Heart className="h-3.5 w-3.5" weight="fill" />
            </span>
          </span>
          <span className="font-semibold text-base-content">
            {publication.likesCount}
          </span>
        </div>
        <p className="py-4 text-sm text-base-content/60">
          Détail des réactions bientôt disponible.
        </p>
      </BottomSheet>

      <BottomSheet open={optionsOpen} onClose={() => setOptionsOpen(false)}>
        <ul className="py-1">
          {optionItems.map(({ icon: OptionIcon, label }) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => {
                  setOptionsOpen(false);
                  notify();
                }}
                className="flex w-full cursor-pointer items-center gap-4 rounded-field px-2 py-3 text-left text-base font-medium text-base-content hover:bg-base-200"
              >
                <OptionIcon className="h-5 w-5 shrink-0" weight="fill" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </article>
  );
}
