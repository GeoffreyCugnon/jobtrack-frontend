import { LayoutGrid } from "lucide-react";

interface OfferFiltersProps {
  active: string[];
  onToggle: (filter: string) => void;
}

const filterOptions = ["Télétravail", "CDI", "Date"];

export function OfferFilters({ active, onToggle }: OfferFiltersProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
      {filterOptions.map((filter) => {
        const isActive = active.includes(filter);
        return (
          <button
            key={filter}
            onClick={() => onToggle(filter)}
            className={`btn btn-sm rounded-full border-none shrink-0 gap-1.5 font-medium ${
              isActive
                ? "bg-primary/10 text-primary"
                : "bg-base-100 text-base-content/70 shadow-sm"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            {filter}
          </button>
        );
      })}
    </div>
  );
}
