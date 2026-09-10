import { MenuLink } from "./MenuLink";
import { type Icon as IconType } from "@phosphor-icons/react";

interface LinkItem {
  to: string;
  label: string;
  icon?: IconType;
}

interface MenuSectionProps {
  links: LinkItem[];
  onLinkClick: () => void;
  bordered?: boolean;
  // Label court au-dessus du groupe, uniquement quand la distinction avec le
  // groupe précédent a besoin d'être explicitée (ex: "Suivi" pour des pages
  // de contenu/reporting, par opposition à l'espace de travail principal).
  title?: string;
}

export function MenuSection({
  links,
  onLinkClick,
  bordered = true,
  title,
}: MenuSectionProps) {
  return (
    <div className={bordered ? "border-b border-base-content/10 pb-2" : ""}>
      {title && (
        <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-base-content/50">
          {title}
        </p>
      )}
      <ul className="menu menu-vertical w-full">
        {links.map((link) => (
          <MenuLink
            key={link.to}
            to={link.to}
            label={link.label}
            onClick={onLinkClick}
            icon={link.icon}
          />
        ))}
      </ul>
    </div>
  );
}
