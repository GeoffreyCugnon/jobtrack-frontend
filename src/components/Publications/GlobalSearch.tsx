import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Search, X, Newspaper, Briefcase } from "lucide-react";
import publications from "../../data/publications";
import { OffersApi } from "../../api/offers.api";
import type { Offer } from "../../types/offer.type";

const MAX_PER_GROUP = 4;

/**
 * Barre de recherche du fil d'actus : cherche en même temps dans les
 * publications (`data/publications`) et dans les offres d'emploi
 * (`OffersApi`, chargées à la première ouverture). Les résultats renvoient
 * vers `/publications?q=` ou `/offers?q=`, qui pré-filtrent leur liste.
 */
export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  // Offres chargées une seule fois, à la première ouverture du champ.
  useEffect(() => {
    if (!open || offers.length > 0) return;
    let cancelled = false;
    OffersApi.getAll()
      .then((data) => {
        if (!cancelled) setOffers(data);
      })
      .catch((error) =>
        console.error("Recherche : chargement des offres échoué", error),
      );
    return () => {
      cancelled = true;
    };
  }, [open, offers.length]);

  // Fermeture au clic extérieur / touche Échap.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const q = query.trim().toLowerCase();

  const matchingPubs = useMemo(() => {
    if (!q) return [];
    return publications.filter(
      (p) =>
        p.author.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [q]);

  const matchingOffers = useMemo(() => {
    if (!q) return [];
    return offers.filter(
      (o) =>
        o.role.toLowerCase().includes(q) ||
        o.company.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q),
    );
  }, [q, offers]);

  const hasResults = matchingPubs.length > 0 || matchingOffers.length > 0;

  const closeAndGo = (to: string) => {
    setOpen(false);
    navigate(to);
  };
  const suffix = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
  const goActus = () => closeAndGo(`/publications${suffix}`);
  const goOffers = () => closeAndGo(`/offers${suffix}`);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (matchingOffers.length > 0 && matchingPubs.length === 0) goOffers();
    else goActus();
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher une actu ou une offre..."
          aria-label="Rechercher parmi les actus et les offres"
          className={`input input-sm h-10 w-full rounded-full bg-base-100 border-base-200 focus:border-primary focus:outline-none pl-9 ${
            query ? "pr-9" : ""
          }`}
        />
        {query && (
          <button
            type="button"
            aria-label="Effacer la recherche"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-xs text-base-content/40 hover:text-base-content"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {open && q.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-box border border-base-200 bg-base-100 shadow-xl overflow-hidden">
          {!hasResults ? (
            <p className="px-4 py-3 text-sm text-base-content/60">
              Aucun résultat pour «&nbsp;{query.trim()}&nbsp;»
            </p>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto py-1">
              {matchingPubs.length > 0 && (
                <section>
                  <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                    Actus
                  </p>
                  {matchingPubs.slice(0, MAX_PER_GROUP).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={goActus}
                      className="flex w-full items-start gap-3 px-4 py-2 text-left hover:bg-base-200"
                    >
                      <Newspaper className="mt-0.5 w-4 h-4 shrink-0 text-base-content/40" />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium truncate">
                          {p.author}
                        </span>
                        <span className="block text-xs text-base-content/60 truncate">
                          {p.description}
                        </span>
                      </span>
                    </button>
                  ))}
                </section>
              )}

              {matchingOffers.length > 0 && (
                <section>
                  <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-base-content/50">
                    Offres
                  </p>
                  {matchingOffers.slice(0, MAX_PER_GROUP).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={goOffers}
                      className="flex w-full items-start gap-3 px-4 py-2 text-left hover:bg-base-200"
                    >
                      <Briefcase className="mt-0.5 w-4 h-4 shrink-0 text-base-content/40" />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium truncate">
                          {o.role}
                        </span>
                        <span className="block text-xs text-base-content/60 truncate">
                          {o.company} · {o.location}
                        </span>
                      </span>
                    </button>
                  ))}
                </section>
              )}

              <button
                type="button"
                onClick={goActus}
                className="block w-full border-t border-base-200 px-4 py-2 text-center text-xs font-medium text-primary hover:bg-base-200"
              >
                Voir tous les résultats
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
