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
  // Configuration des onglets. "as const" fige le type de "key" en literal
  // ("login" | "signup") plutôt que "string", pour matcher AuthTabsProps
  const tabs = [
    { key: "login" as const, label: "Se connecter" },
    { key: "signup" as const, label: "S'inscrire" },
  ];

  return (
    // Piste de fond (grid 2 colonnes) qui contient les deux boutons,
    // avec un léger padding pour créer l'effet "pilule" autour de l'onglet actif
    <div className="grid grid-cols-2 gap-1 bg-base-200 rounded-field p-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button" // évite un submit accidentel si le composant est dans un <form>
          onClick={() => onChange(tab.key)}
          className={`cursor-pointer rounded-field py-2 text-sm font-medium transition-colors ${
            mode === tab.key
              ? // Onglet actif : fond clair + ombre légère pour le faire "flotter"
                // au-dessus de la piste bg-base-200
                "bg-base-100 shadow-sm text-base-content"
              : // Onglet inactif : texte atténué (opacité), s'assombrit légèrement au survol
                "text-base-content/50 hover:text-base-content/80"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
