import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "@/lib/icons";

export interface DropdownMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface DropdownMenuProps {
  triggerIcon: LucideIcon;
  triggerLabel: string;
  items: DropdownMenuItem[];
  align?: "start" | "end";
  // "sm" (32px, défaut) convient quand le déclencheur est déjà accompagné
  // d'autres cibles proches (ex: ConversationItem). "lg" (44px) pour un
  // déclencheur isolé, seule action visible sur son conteneur.
  triggerSize?: "sm" | "lg";
}

// Largeur du menu (w-56) — utilisée pour calculer sa position en mode
// align="end" avant même qu'il soit rendu, cf. plus bas.
const MENU_WIDTH_PX = 224;

// Menu "..." générique (déclenché par clic, fermeture au clic extérieur, au
// scroll ou à la sélection d'un item) — pas de pattern Dropdown existant
// ailleurs dans l'app avant ce composant, donc conçu pour être réutilisable
// (header Messagerie, actions par conversation, cards Documents...) plutôt
// que dupliqué par site d'appel.
//
// Rendu via un portail (document.body) plutôt qu'en position absolute
// classique dans le flux : un déclencheur posé dans une card avec
// overflow-hidden (nécessaire pour ses coins arrondis) verrait sinon son
// menu tronqué dès qu'il dépasse les limites de cette card.
export function DropdownMenu({
  triggerIcon: TriggerIcon,
  triggerLabel,
  items,
  align = "end",
  triggerSize = "sm",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null
  );
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 4,
      left: align === "end" ? rect.right - MENU_WIDTH_PX : rect.left,
    });
  }, [open, align]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    // Fermer au scroll plutôt que de repositionner en continu : plus simple
    // et robuste, l'utilisateur peut rouvrir le menu une fois stabilisé.
    const handleScroll = () => setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          // Le déclencheur est souvent imbriqué dans une rangée cliquable
          // (ex: ConversationItem, DocumentCard) : jamais laisser ce clic
          // lui remonter.
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`btn btn-ghost btn-circle text-base-content/50 hover:bg-base-200 hover:text-base-content shrink-0 ${
          triggerSize === "lg" ? "w-11 h-11 min-h-0" : "btn-sm"
        }`}
      >
        <TriggerIcon className="w-5 h-5" />
      </button>

      {open &&
        position &&
        createPortal(
          <ul
            ref={menuRef}
            role="menu"
            onClick={(e) => e.stopPropagation()}
            style={{ top: position.top, left: position.left, width: MENU_WIDTH_PX }}
            className="menu fixed z-50 rounded-box bg-base-100 shadow-lg border border-base-200 p-1"
          >
            {items.map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className={item.variant === "danger" ? "text-error" : "text-base-content"}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </>
  );
}
