import { createContext } from "react";

export interface MenuContextType {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

export const MenuContext = createContext<MenuContextType | undefined>(
  undefined,
);
