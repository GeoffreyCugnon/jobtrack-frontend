// src/context/useMenu.ts
import { useContext } from "react";
import { MenuContext } from "./menuContextInstance";

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within a MenuProvider");
  return context;
}
