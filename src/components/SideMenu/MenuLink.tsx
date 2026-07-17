import { Link } from "react-router";
import type { LucideIcon } from "lucide-react";

interface MenuLinkProps {
  to: string;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  icon?: LucideIcon;
}

export function MenuLink({
  to,
  label,
  onClick,
  variant = "default",
  icon: Icon,
}: MenuLinkProps) {
  return (
    <li>
      <Link
        to={to}
        onClick={onClick}
        className={
          variant === "danger"
            ? "text-error hover:bg-error/10"
            : "text-base-content"
        }
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </Link>
    </li>
  );
}
