import { Moon, Sun } from "@phosphor-icons/react";
import { useTheme } from "../../context/Theme/useTheme";
import { THEME_DARK } from "../../context/Theme/themeContextInstance";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEME_DARK;
  const Icon = isDark ? Moon : Sun;

  return (
    <li>
      <button onClick={toggleTheme}>
        <Icon className="w-4 h-4" />
        {isDark ? "Thème sombre" : "Thème clair"}
      </button>
    </li>
  );
}
