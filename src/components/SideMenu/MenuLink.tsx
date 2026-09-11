import { Link, useLocation } from "react-router";
import { type Icon as IconType } from "@phosphor-icons/react";
import { isNavItemActive } from "../../constants/nav";

interface MenuLinkProps {
  to: string;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  icon?: IconType;
}

export function MenuLink({
  to,
  label,
  onClick,
  variant = "default",
  icon: Icon,
}: MenuLinkProps) {
  const { pathname } = useLocation();
  const isActive = variant === "default" && isNavItemActive(pathname, to);

  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        className={
          variant === "danger"
            ? "text-error hover:bg-error/10"
            : isActive
              ? "bg-primary/10 text-link font-medium"
              : "text-base-content"
        }
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Link>
    </li>
  );
}
