import { useCallback, useMemo, useState, type ReactNode } from "react";
import { MenuContext } from "./menuContextInstance";

interface MenuProviderProps {
  children: ReactNode;
}

export function MenuProvider({ children }: MenuProviderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const toggleMenu = useCallback(() => setIsMenuOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({ isMenuOpen, openMenu, closeMenu, toggleMenu }),
    [isMenuOpen, openMenu, closeMenu, toggleMenu]
  );

  return (
    <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
  );
}
