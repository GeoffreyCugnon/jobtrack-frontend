import { ChevronRight, type LucideIcon } from "@/lib/icons";
import { Link } from "react-router";

interface StatCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  to: string;
}

export function StatCard({ label, count, icon: Icon, to }: StatCardProps) {
  // Libellé forcé sur 2 lignes (premier mot / reste), pour un rendu homogène
  // entre les 3 cartes quelle que soit la largeur.
  const spaceIdx = label.indexOf(" ");
  const line1 = spaceIdx === -1 ? label : label.slice(0, spaceIdx);
  const line2 = spaceIdx === -1 ? "" : label.slice(spaceIdx + 1);

  return (
    <Link
      to={to}
      // Le bloc chiffre+libellé est centré dans toute la carte (`justify-center`) ;
      // le chevron est posé *par-dessus*, collé à droite, sans participer au
      // centrage. Filet vertical *court* sur les colonnes 2 et 3 (pseudo-élément).
      className="relative flex items-center justify-center rounded-none bg-base-100 p-4 text-center transition hover:bg-base-200/60 active:scale-[0.97] active:bg-base-200 not-first:before:absolute not-first:before:left-0 not-first:before:top-[26%] not-first:before:bottom-[26%] not-first:before:w-px not-first:before:bg-base-200 not-first:before:content-['']"
    >
      <div>
        <div className="flex items-center justify-center gap-1.5 text-primary">
          <span className="text-3xl font-bold leading-none">{count}</span>
          <Icon className="w-7 h-7 shrink-0" aria-hidden="true" />
        </div>
        <div className="mt-1.25 text-[13px] leading-tight text-base-content/70">
          {line1}
          {line2 && (
            <>
              <br />
              {line2}
            </>
          )}
        </div>
      </div>
      <ChevronRight
        aria-hidden="true"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-base-content/50"
      />
    </Link>
  );
}
