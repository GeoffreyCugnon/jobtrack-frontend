import { MenuLink } from "./MenuLink";
import type { LucideIcon } from "lucide-react";

interface LinkItem {
  to: string;
  label: string;
  icon?: LucideIcon;
}

interface MenuSectionProps {
  links: LinkItem[];
  onLinkClick: () => void;
  bordered?: boolean;
}

export function MenuSection({
  links,
  onLinkClick,
  bordered = true,
}: MenuSectionProps) {
  return (
    <ul
      className={`menu menu-vertical w-full ${bordered ? "border-b border-base-content/10" : ""}`}
    >
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
  );
}
