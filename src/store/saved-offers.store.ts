import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Offres « sauvegardées » (cœur) — état partagé entre la liste `/offers` et la
 * page dédiée `/offers/saved`. Persisté en `localStorage` (`persist`) faute
 * d'endpoint dédié côté Backend : la sélection survit au rechargement mais
 * reste locale à l'appareil.
 */
type SavedOffersState = {
  savedIds: number[];
  toggle: (id: number) => void;
};

export const useSavedOffersStore = create<SavedOffersState>()(
  persist(
    (set) => ({
      savedIds: [],
      toggle: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((savedId) => savedId !== id)
            : [...state.savedIds, id],
        })),
    }),
    { name: "jobtrack-saved-offers" },
  ),
);
