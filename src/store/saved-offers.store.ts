import { create } from "zustand";

/**
 * Offres « sauvegardées » (cœur) — état partagé entre la liste `/offers` et la
 * page dédiée `/offers/saved`. En mémoire uniquement (pas d'endpoint dédié
 * côté Backend pour l'instant) : la sélection est perdue au rechargement.
 */
type SavedOffersState = {
  savedIds: number[];
  toggle: (id: number) => void;
};

export const useSavedOffersStore = create<SavedOffersState>((set) => ({
  savedIds: [],
  toggle: (id) =>
    set((state) => ({
      savedIds: state.savedIds.includes(id)
        ? state.savedIds.filter((savedId) => savedId !== id)
        : [...state.savedIds, id],
    })),
}));
