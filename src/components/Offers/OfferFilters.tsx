import type { ComponentType } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { getCategoryStyle } from "../../data/offerCategories";
import { useJobCategories } from "../../hooks/useJobCategories";
import {
  CONTRACT_OPTIONS,
  WORK_MODE_OPTIONS,
  type OfferFiltersValue,
} from "./offer-filters.types";

interface Option {
  value: string;
  label: string;
  // Optionnels : seul le filtre « Catégorie » les fournit (pastille colorée +
  // pictogramme, repris de l'ancien sélecteur de catégories).
  icon?: ComponentType<{ className?: string }>;
  colorClass?: string;
}

/** Pastille colorée + icône d'une option (catégories uniquement). */
function OptionIcon({ option }: { option: Option }) {
  if (!option.icon) return null;
  const Icon = option.icon;
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
        option.colorClass ?? "bg-base-300"
      }`}
    >
      <Icon className="h-3 w-3 text-white" />
    </span>
  );
}

interface FilterDropdownProps {
  label: string;
  options: Option[];
  value: string | null;
  onSelect: (value: string | null) => void;
}

function FilterDropdown({ label, options, value, onSelect }: FilterDropdownProps) {
  const selected = options.find((o) => o.value === value);

  // daisyUI `dropdown` (ouverture au focus) : après un choix on retire le focus
  // pour refermer le menu.
  const choose = (v: string | null) => {
    onSelect(v);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        aria-label={`Filtrer par ${label.toLowerCase()}`}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          selected
            ? "border-primary bg-primary/5 text-primary"
            : "border-base-300 text-base-content/70 hover:border-base-content/30"
        }`}
      >
        {selected && <OptionIcon option={selected} />}
        <span className="max-w-40 truncate">{selected?.label ?? label}</span>
        <CaretDown className="w-3.5 h-3.5 shrink-0" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu z-30 mt-1 max-h-80 w-56 flex-nowrap overflow-y-auto rounded-box border border-base-300 bg-base-100 p-1 shadow-lg"
      >
        <li>
          <button
            type="button"
            className={value === null ? "menu-active" : undefined}
            onClick={() => choose(null)}
          >
            Toutes
          </button>
        </li>
        {options.map((o) => (
          <li key={o.value}>
            <button
              type="button"
              className={value === o.value ? "menu-active" : undefined}
              onClick={() => choose(o.value)}
            >
              <OptionIcon option={o} />
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface OfferFiltersProps {
  value: OfferFiltersValue;
  onChange: (patch: Partial<OfferFiltersValue>) => void;
}

/** Trois pastilles-dropdowns cumulables : Catégorie / Mode de travail / Contrat. */
export function OfferFilters({ value, onChange }: OfferFiltersProps) {
  // Référentiel `Job_category` (`GET /job-categories`). Tant qu'il n'est pas
  // chargé, le filtre « Catégorie » n'affiche que « Toutes ».
  const { categories } = useJobCategories();

  return (
    <div className="flex flex-wrap gap-2">
      <FilterDropdown
        label="Catégorie"
        // `isWorkMode` exclu : « À distance » / « Hybride » relèvent du filtre
        // « Mode de travail », pas d'un secteur d'activité.
        options={categories
          .filter((c) => !c.isWorkMode)
          .map((c) => {
            const style = getCategoryStyle(c.key);
            return {
              value: c.key,
              label: c.label,
              icon: style.icon,
              colorClass: style.colorClass,
            };
          })}
        value={value.category}
        onSelect={(v) => onChange({ category: v })}
      />
      <FilterDropdown
        label="Mode de travail"
        options={WORK_MODE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        value={value.workMode}
        onSelect={(v) =>
          onChange({ workMode: v as OfferFiltersValue["workMode"] })
        }
      />
      <FilterDropdown
        label="Contrat"
        options={CONTRACT_OPTIONS.map((c) => ({ value: c, label: c }))}
        value={value.contract}
        onSelect={(v) => onChange({ contract: v })}
      />
    </div>
  );
}
