import { create } from "zustand";
import { BOTTOM_NAV_HEIGHT } from "../constants/layout";

export type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
  /** true le temps de son effet de sortie, avant d'être remplacé par un
   *  doublon (cf. `addToast`) — `<Toast/>` s'en sert pour l'animer. */
  hiding?: boolean;
};

// Doit correspondre à la durée de la transition CSS de sortie dans `<Toast/>`.
export const TOAST_HIDE_DURATION = 150;

type ToastState = {
  toasts: Toast[];
  /** Hauteur px de la pile de toasts affichée, mesurée par `<Toast/>`. Permet
   *  aux éléments empilés au-dessus (bouton flottant messagerie) de se
   *  positionner juste au-dessus plutôt que de recouvrir. */
  stackHeight: number;
  /**
   * Hauteur px de la barre fixe en bas d'écran au-dessus de laquelle le toast
   * doit s'empiler. Par défaut la nav du bas mobile (`BOTTOM_NAV_HEIGHT`) ;
   * une page qui la remplace par autre chose (ex. `GuestHome` et son CTA)
   * publie sa propre hauteur mesurée le temps qu'elle est montée.
   */
  bottomBarHeight: number;
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: number) => void;
  setStackHeight: (height: number) => void;
  setBottomBarHeight: (height: number) => void;
};

let nextId = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  stackHeight: 0,
  setStackHeight: (height) => set({ stackHeight: height }),
  bottomBarHeight: BOTTOM_NAV_HEIGHT,
  setBottomBarHeight: (height) => set({ bottomBarHeight: height }),

  addToast: (message, type) => {
    const push = () => {
      const id = nextId++;
      set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, 4000);
    };

    // Un doublon du toast déjà affiché juste en-dessous (ex. plusieurs clics
    // rapides sur le même bouton "like") joue d'abord son effet de sortie
    // (`hiding: true`, cf. `<Toast/>`) avant d'être remplacé, plutôt que de
    // s'empiler par-dessus ou de le remplacer sans transition visible.
    const { toasts } = get();
    const last = toasts[toasts.length - 1];
    if (last && last.message === message && last.type === type) {
      set((state) => ({
        toasts: state.toasts.map((t) =>
          t.id === last.id ? { ...t, hiding: true } : t,
        ),
      }));
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== last.id),
        }));
        push();
      }, TOAST_HIDE_DURATION);
      return;
    }

    push();
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
