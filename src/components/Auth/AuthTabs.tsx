import { Tabs } from "../Layout/Tabs";

interface AuthTabsProps {
  // Onglet actuellement actif (contrôlé par le parent, ex: la page Auth)
  mode: "login" | "signup";
  // Callback déclenché au clic sur un onglet, remonte le nouveau mode au parent
  onChange: (mode: "login" | "signup") => void;
}

/**
 * AuthTabs
 * Switch à deux onglets ("Se connecter" / "S'inscrire") permettant de basculer
 * entre les formulaires de login et d'inscription sur la page d'authentification.
 * Composant contrôlé : n'a pas d'état interne, tout est piloté via les props.
 */
export function AuthTabs({ mode, onChange }: AuthTabsProps) {
  return (
    <Tabs<"login" | "signup">
      items={[
        { key: "login", label: "Se connecter" },
        { key: "signup", label: "S'inscrire" },
      ]}
      value={mode}
      onChange={onChange}
      variant="onCard"
      className="mb-6"
    />
  );
}
