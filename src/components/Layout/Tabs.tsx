interface TabItem<T extends string> {
  key: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  // "onCard": piste foncée + pastille claire, pour un switcher posé sur une carte blanche (ex: Auth)
  // "onPage": piste claire + pastille foncée, pour un switcher posé directement sur le fond gris de la page (ex: Documents)
  variant?: "onCard" | "onPage";
  className?: string;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  variant = "onCard",
  className = "",
}: TabsProps<T>) {
  const trackStyles =
    variant === "onPage"
      ? "bg-base-100 border border-base-200 shadow-sm"
      : "bg-base-200";

  const activeStyles =
    variant === "onPage"
      ? "bg-base-200 text-base-content"
      : "bg-base-100 shadow-sm text-base-content";

  return (
    <div
      className={`grid gap-1 rounded-field p-1 ${trackStyles} ${className}`}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          aria-pressed={value === item.key}
          onClick={() => onChange(item.key)}
          className={`cursor-pointer rounded-field py-2 text-sm font-medium transition-colors ${
            value === item.key
              ? activeStyles
              : "text-base-content/50 hover:text-base-content/80"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
