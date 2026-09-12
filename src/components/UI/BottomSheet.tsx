import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

// Panneau modal ancré en bas de l'écran, même logique overlay + transition
// que `SideMenu`/`MessagingPanel` (translation) mais depuis le bas plutôt
// que depuis un côté.
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-42 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-base-100 shadow-xl transition-transform duration-300 flex flex-col ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <button
          type="button"
          aria-label="Fermer"
          onClick={onClose}
          className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-base-content/20"
        />
        {title && (
          <h2 className="px-4 pt-3 text-base font-semibold text-base-content">
            {title}
          </h2>
        )}
        <div className="px-4 pt-2 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          {children}
        </div>
      </div>
    </>
  );
}
