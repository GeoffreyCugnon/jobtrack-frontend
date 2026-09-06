import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastState = {
  toasts: Toast[];
  /** Hauteur px de la pile de toasts affichée, mesurée par `<Toast/>`. Permet
   *  aux éléments empilés au-dessus (bouton flottant messagerie) de se
   *  positionner juste au-dessus plutôt que de recouvrir. */
  stackHeight: number;
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: number) => void;
  setStackHeight: (height: number) => void;
};

let nextId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  stackHeight: 0,
  setStackHeight: (height) => set({ stackHeight: height }),

  addToast: (message, type) => {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
