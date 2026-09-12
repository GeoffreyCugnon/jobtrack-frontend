import { createContext } from "react";

export const THEME_DARK = "theme-dark" as const;
export const THEME_LIGHT = "theme-light" as const;

export type Theme = typeof THEME_DARK | typeof THEME_LIGHT;

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);
