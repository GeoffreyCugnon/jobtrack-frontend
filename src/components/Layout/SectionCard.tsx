import { useState, type ReactNode } from "react";
import { ChevronDown, Plus } from "lucide-react";

interface SectionCardProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  defaultOpen?: boolean;
  collapsible?: boolean;
  children: ReactNode;
}

// Carte de section — même pattern que ProfileContact/ProfileSkills (header
// avec titre + "+" optionnel). Repliable par défaut (chevron + toggle) ;
// passer collapsible={false} pour un header statique, toujours ouvert
// (ex: un dashboard, où le contenu doit rester visible d'un coup d'œil).
export function SectionCard({
  title,
  onAdd,
  addLabel,
  defaultOpen = true,
  collapsible = true,
  children,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open = collapsible ? isOpen : true;

  return (
    <div className="rounded-none sm:rounded-box overflow-hidden">
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
        className={`flex items-center justify-between px-4 py-3 bg-base-200 ${collapsible ? "cursor-pointer" : ""}`}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-base-content">{title}</h3>
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
        {collapsible && (
          <ChevronDown
            className={`w-5 h-5 text-base-content/50 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </div>

      {open && (
        <div className="bg-base-100 p-4 border-t border-base-200">
          {children}
        </div>
      )}
    </div>
  );
}
