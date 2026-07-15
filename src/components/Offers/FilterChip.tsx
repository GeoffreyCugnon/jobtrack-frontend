import { useState } from "react";
import { Grip } from "lucide-react";

type FilterChipProps = {
  label: string;
  defaultActive?: boolean;
};

export function FilterChip({ label, defaultActive = false }: FilterChipProps) {
  const [active, setActive] = useState(defaultActive);

  return (
    <button
      type="button"
      onClick={() => setActive((prev) => !prev)}
      className={`btn btn-sm rounded-full gap-2 border font-medium normal-case ${
        active
          ? "border-indigo-200 bg-indigo-50 text-slate-900 hover:bg-indigo-100"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Grip className="size-4" />
      {label}
    </button>
  );
}
