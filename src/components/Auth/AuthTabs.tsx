interface AuthTabsProps {
  mode: "login" | "signup";
  onChange: (mode: "login" | "signup") => void;
}

export function AuthTabs({ mode, onChange }: AuthTabsProps) {
  const tabs = [
    { key: "login" as const, label: "Se connecter" },
    { key: "signup" as const, label: "S'inscrire" },
  ];

  return (
    <div className="grid grid-cols-2 gap-1 bg-base-200 rounded-lg p-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`cursor-pointer rounded-md py-2 text-sm font-medium transition-colors ${
            mode === tab.key
              ? "bg-base-100 shadow-sm text-base-content"
              : "text-base-content/50 hover:text-base-content/80"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
