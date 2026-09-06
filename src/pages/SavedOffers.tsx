import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bookmark, RotateCw } from "@/lib/icons";

import { EmptyState } from "../components/Layout/EmptyState";
import { OfferList } from "../components/Offers/OfferList";
import { OffersApi } from "../api/offers.api";
import { queryKeys } from "../api/query-keys";
import { useSavedOffersStore } from "../store/saved-offers.store";

function pluralize(count: number, singular: string, plural: string) {
  return count > 1 ? plural : singular;
}

export function SavedOffers() {
  const navigate = useNavigate();
  const savedIds = useSavedOffersStore((state) => state.savedIds);
  const toggleSave = useSavedOffersStore((state) => state.toggle);
  const [dismissedIds, setDismissedIds] = useState<number[]>([]);

  const {
    data: offers = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.offers.all,
    queryFn: () => OffersApi.getAll(),
  });

  const savedOffers = (Array.isArray(offers) ? offers : [])
    .filter(
      (offer) => savedIds.includes(offer.id) && !dismissedIds.includes(offer.id),
    )
    .sort((a, b) => a.postedHoursAgo - b.postedHoursAgo);

  return (
    <div className="flex-1 flex flex-col bg-base-200">
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-base-200 bg-base-100 px-4 py-4">
        <button
          type="button"
          aria-label="Retour"
          onClick={() => navigate("/offers")}
          className="text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-base-content">
          Offres sauvegardées
          {savedOffers.length > 0 && (
            <span className="ml-2 text-base font-semibold text-base-content/50">
              {savedOffers.length}
            </span>
          )}
        </h1>
      </div>

      {isPending ? (
        <p className="bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Chargement…
        </p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 bg-base-100 p-6 text-center">
          <p className="text-sm text-base-content/60">
            Impossible de charger les offres.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="btn btn-sm btn-outline gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      ) : savedOffers.length === 0 ? (
        <div className="bg-base-100 p-10">
          <EmptyState
            icon={Bookmark}
            message="Aucune offre sauvegardée. Touchez le cœur d'une offre pour l'ajouter ici."
          />
        </div>
      ) : (
        <div className="bg-base-100">
          <p className="px-4 pt-3 text-sm text-base-content/60">
            {savedOffers.length}{" "}
            {pluralize(
              savedOffers.length,
              "offre sauvegardée",
              "offres sauvegardées",
            )}
          </p>
          <OfferList
            offers={savedOffers}
            savedIds={savedIds}
            onToggleSave={toggleSave}
            onDismiss={(id) => setDismissedIds((prev) => [...prev, id])}
          />
        </div>
      )}
    </div>
  );
}
