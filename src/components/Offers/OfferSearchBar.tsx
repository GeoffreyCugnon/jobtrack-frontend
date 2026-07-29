import { useRef, type FormEvent } from "react";
import { Search, X } from "lucide-react";

interface OfferSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function OfferSearchBar({ value, onChange }: OfferSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Le filtrage est déjà réactif à chaque frappe ; la soumission (clic sur la
  // loupe ou touche Entrée) sert surtout à confirmer la recherche et refermer
  // le clavier mobile plutôt qu'à déclencher un filtrage qui a déjà eu lieu.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    inputRef.current?.blur();
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <button
        type="submit"
        aria-label="Lancer la recherche"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-primary"
      >
        <Search className="w-4 h-4" />
      </button>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher une offre..."
        // h-11 (44px) : plus fin que le input daisyui par défaut tout en
        // gardant une cible tactile confortable (>= 40px).
        className={`input h-11 w-full bg-base-100 border-base-200 border-t-0 rounded-none transition-colors focus:border-primary focus:outline-none pl-11 ${
          value ? "pr-11" : ""
        }`}
      />
      {value && (
        <button
          type="button"
          aria-label="Effacer la recherche"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-base-content"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
