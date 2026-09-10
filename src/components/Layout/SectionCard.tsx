import { useState, type ReactNode } from "react";
import { ChevronDown, Plus } from "@/lib/icons";
import { Link } from "react-router";

interface SectionCardBaseProps {
  title: string;
  headerAction?: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  /**
   * Header sans bandeau : fond `base-100` (pas de gris `base-200`), pas d'ombre
   * ni de séparation sous le titre — le contenu suit directement. Utilisé par le
   * dashboard, où les sections doivent se fondre les unes dans les autres.
   */
  flat?: boolean;
  children: ReactNode;
}

// headerTo transforme le header en <Link> plein cadre : le combiner avec
// onAdd imbriquerait un <button> dans ce lien (HTML invalide, clic
// ambigu). Les deux sont donc mutuellement exclusifs au niveau des types.
type SectionCardProps = SectionCardBaseProps &
  (
    | {
        headerTo?: undefined;
        onAdd?: () => void;
        addLabel?: string;
        onHeaderClick?: never;
      }
    | {
        headerTo: string;
        onAdd?: never;
        addLabel?: never;
        onHeaderClick?: () => void;
      }
  );

// Carte de section — même pattern que ProfileContact/ProfileSkills (header
// avec titre + "+" optionnel). Repliable par défaut (chevron + toggle) ;
// passer collapsible={false} pour un header statique, toujours ouvert
// (ex: un dashboard, où le contenu doit rester visible d'un coup d'œil).
// Passer headerTo transforme tout le bandeau de titre en lien (ex: "Voir
// tout" sur toute la largeur plutôt que sur le seul libellé) ; incompatible
// avec collapsible.
export function SectionCard({
  title,
  onAdd,
  addLabel,
  headerAction,
  headerTo,
  onHeaderClick,
  defaultOpen = true,
  collapsible = true,
  flat = false,
  children,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open = collapsible ? isOpen : true;

  const headerClassName = `relative z-10 flex items-center justify-between px-4 py-3 transition-colors ${
    flat ? "bg-base-100" : "bg-base-200 shadow-sm"
  } ${collapsible || headerTo ? "cursor-pointer" : ""} ${
    headerTo
      ? flat
        ? "hover:bg-base-200/60 active:bg-base-200"
        : "hover:bg-base-300/60 active:bg-base-300"
      : ""
  }`;

  const headerChildren = (
    <>
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-lg text-base-content">{title}</h2>
        {onAdd && (
          <button
            type="button"
            aria-label={addLabel ?? `Ajouter — ${title}`}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 text-base-content/70">
        {headerAction}
        {collapsible && (
          <ChevronDown
            aria-hidden="true"
            className={`w-5 h-5 text-base-content/50 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </div>
    </>
  );

  return (
    <div className="rounded-none sm:rounded-box overflow-hidden">
      {headerTo ? (
        <Link to={headerTo} onClick={onHeaderClick} className={headerClassName}>
          {headerChildren}
        </Link>
      ) : (
        <div
          role={collapsible ? "button" : undefined}
          tabIndex={collapsible ? 0 : undefined}
          onClick={collapsible ? () => setIsOpen((v) => !v) : undefined}
          onKeyDown={
            collapsible
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsOpen((v) => !v);
                  }
                }
              : undefined
          }
          aria-expanded={collapsible ? open : undefined}
          className={headerClassName}
        >
          {headerChildren}
        </div>
      )}

      {open && (
        <div
          className={`bg-base-100 p-4 ${flat ? "pt-0" : "border-t border-base-200"}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
