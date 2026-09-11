import { useEffect, useState, type CSSProperties } from "react";
import { Link, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowClockwise, BookmarkSimple, Briefcase, CaretRight } from "@phosphor-icons/react";
import { OfferFilters } from "../components/Offers/OfferFilters";
import {
  EMPTY_OFFER_FILTERS,
  type OfferFiltersValue,
} from "../components/Offers/offer-filters.types";
import { OfferList } from "../components/Offers/OfferList";
import { EmptyState } from "../components/Layout/EmptyState";
import { Header } from "../components/Layout/Header";
import { PageContainer } from "../components/Layout/PageContainer";
import { useJobCategories } from "../hooks/useJobCategories";
import { OffersApi } from "../api/offers.api";
import { queryKeys } from "../api/query-keys";
import { useAuthStore } from "../store/auth.store";
import { useSavedOffersStore } from "../store/saved-offers.store";

function pluralize(count: number, singular: string, plural: string) {
  return count > 1 ? plural : singular;
}

export function Offers() {
  // La recherche texte se fait depuis la barre globale du header, qui navigue
  // vers `/offers?q=...` : plus de barre de recherche propre à la page.
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") ?? "").trim();
  // En invité : pas de sauvegarde d'offres.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const savedIds = useSavedOffersStore((state) => state.savedIds);
  const toggleSave = useSavedOffersStore((state) => state.toggle);
  // Référentiel des catégories (`GET /job-categories`) : libellé de la bannière.
  const { categories: jobCategories } = useJobCategories();

  // Filtres cumulables (Catégorie / Mode de travail / Contrat).
  const [filters, setFilters] = useState<OfferFiltersValue>(EMPTY_OFFER_FILTERS);
  const patchFilters = (patch: Partial<OfferFiltersValue>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  // Alerte de catégorie : état purement local (pas d'endpoint dédié), comme
  // dans l'ancienne bannière. N'a de sens que sur une catégorie précise, donc
  // on la remet à zéro dès qu'on repasse sur « Toutes les offres ».
  const [alertEnabled, setAlertEnabled] = useState(false);
  useEffect(() => {
    if (!filters.category) setAlertEnabled(false);
  }, [filters.category]);

  const {
    data: offers = [],
    isPending: loading,
    isError: loadError,
    refetch: loadOffers,
  } = useQuery({
    queryKey: queryKeys.offers.all,
    queryFn: () => OffersApi.getAll(),
  });

  // Masquage local (le cache React Query reste la source) : l'offre rejetée
  // disparaît de la liste jusqu'au prochain rechargement des données.
  const dismissOffer = (id: number) => setDismissedIds((prev) => [...prev, id]);

  const filteredOffers = (Array.isArray(offers) ? offers : [])
    .filter((offer) => !dismissedIds.includes(offer.id))
    .filter((offer) => !filters.category || offer.category === filters.category)
    .filter(
      (offer) =>
        !filters.workMode || (offer.workMode ?? "onSite") === filters.workMode,
    )
    .filter(
      (offer) =>
        !filters.contract ||
        (offer.contractType ?? "").toLowerCase() ===
          filters.contract.toLowerCase(),
    );

  const searchedOffers = filteredOffers.filter((offer) => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;
    return (
      offer.role.toLowerCase().includes(query) ||
      offer.company.toLowerCase().includes(query) ||
      offer.location.toLowerCase().includes(query)
    );
  });

  // Plus récent d'abord : `postedHoursAgo` croissant.
  const visibleOffers = [...searchedOffers].sort(
    (a, b) => a.postedHoursAgo - b.postedHoursAgo,
  );

  const activeCategoryData = jobCategories.find(
    (category) => category.key === filters.category,
  );
  const bannerLabel = activeCategoryData
    ? activeCategoryData.label
    : "Toutes les offres";
  // Toggle d'alerte : seulement connecté ET sur une catégorie précise (une
  // alerte n'a rien à surveiller sur « Toutes les offres »).
  const showAlertToggle = isAuthenticated && !!activeCategoryData;
  const alertActive = showAlertToggle && alertEnabled;
  const resultsLabel = loadError
    ? "Chargement impossible"
    : `${searchedOffers.length} ${pluralize(
        searchedOffers.length,
        "offre trouvée",
        "offres trouvées",
      )}`;

  // Échec de chargement (API/DB injoignable) : distinct de « 0 offre trouvée »,
  // avec un bouton pour relancer l'appel.
  const offersErrorState = (
    <div className="flex flex-col items-center gap-3 p-6">
      <EmptyState
        icon={Briefcase}
        message="Impossible de charger les offres pour le moment."
      />
      <button
        type="button"
        onClick={() => void loadOffers()}
        className="btn btn-sm btn-outline gap-2"
      >
        <ArrowClockwise className="w-4 h-4" />
        Réessayer
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-base-100">
      <Header />

      <PageContainer className="flex-1 flex flex-col">
        <div className="-mx-4 sm:mx-0 flex flex-col">
          {isAuthenticated && (
            <Link
              to="/offers/saved"
              className="flex items-center gap-3 border-b border-base-200 px-4 py-3.5 text-sm font-semibold text-base-content transition-colors hover:bg-base-200"
            >
              <BookmarkSimple className="h-5 w-5 text-primary" />
              <span className="flex-1">Offres sauvegardées</span>
              {savedIds.length > 0 && (
                <span className="badge badge-primary badge-sm font-semibold">
                  {savedIds.length}
                </span>
              )}
              <CaretRight className="h-4 w-4 text-base-content/50" />
            </Link>
          )}

          <div className="border-b border-base-200 px-4 py-3">
            <OfferFilters value={filters} onChange={patchFilters} />
          </div>

          <div>
            {loading ? (
              <div className="p-4 text-sm text-base-content/60">
                Chargement des offres...
              </div>
            ) : loadError ? (
              offersErrorState
            ) : visibleOffers.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={Briefcase}
                  message="Aucune offre dans cette catégorie pour l'instant."
                />
              </div>
            ) : (
              <OfferList
                offers={visibleOffers}
                savedIds={savedIds}
                showActions={isAuthenticated}
                onToggleSave={toggleSave}
                onDismiss={dismissOffer}
              />
            )}
          </div>
        </div>
      </PageContainer>

      {/* Bandeau récap collé en bas de la liste — réservé aux connectés (alerte
          de catégorie, sans objet pour un invité). `bottom-0` suffit : le
          conteneur de scroll (Root) porte déjà `pb-16` pour dégager la nav
          mobile — remettre un `bottom-16` ici doublait la marge et laissait
          un trou de la hauteur de la nav au-dessus d'elle. */}
      {isAuthenticated && (
        <div
          className={`sticky bottom-0 z-20 shadow-[0_-2px_10px_rgba(15,23,42,0.15)] transition-colors ${
            alertActive
              ? "bg-success text-success-content"
              : "bg-primary text-primary-content"
          }`}
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5">
            <div className="min-w-0">
              <p className="truncate font-bold leading-tight">{bannerLabel}</p>
              <p
                className={`text-sm font-bold leading-tight ${
                  alertActive
                    ? "text-success-content/80"
                    : "text-primary-content/80"
                }`}
              >
                {resultsLabel}
              </p>
            </div>

            {showAlertToggle && (
              <label className="flex shrink-0 items-center gap-2 text-sm font-medium">
                <span className="whitespace-nowrap leading-none">
                  {alertEnabled ? "Alerte activée" : "Définir une alerte"}
                </span>
                <input
                  type="checkbox"
                  checked={alertEnabled}
                  onChange={(e) => setAlertEnabled(e.target.checked)}
                  className="toggle toggle-sm"
                  // Piste peu visible sur le fond bleu tant que décoché : on force
                  // le blanc. Une fois coché, daisyUI passe sur un fond clair déjà
                  // lisible.
                  style={
                    !alertEnabled
                      ? ({ "--input-color": "#fff" } as CSSProperties)
                      : undefined
                  }
                  aria-label="Définir une alerte pour cette catégorie"
                />
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
