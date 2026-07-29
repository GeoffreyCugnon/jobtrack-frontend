import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

const FAB_SIZE = 44;
// En dessous de ce déplacement (px), on considère que c'est un tap, pas un
// glissé — évite qu'un léger tremblement du doigt annule l'ouverture.
const DRAG_THRESHOLD = 6;
// Marge gardée avec le bord de l'écran une fois aimanté.
const EDGE_MARGIN = 12;
// Durée de l'animation d'aimantation vers le bord le plus proche.
const SNAP_DURATION_MS = 200;

interface UseDraggableFabOptions {
  // Appelé au relâchement si le pointeur n'a pas dépassé DRAG_THRESHOLD —
  // c'est-à-dire un tap plutôt qu'un glissé.
  onTap: () => void;
}

// Logique de glissé + aimantation d'un bouton flottant mobile (drag libre à
// l'écran, se recale sur le bord gauche ou droit le plus proche au
// relâchement). Isolée de MessagingFab pour ne pas mélanger cette physique
// de pointeur avec le rendu des deux boutons (mobile/desktop).
export function useDraggableFab({ onTap }: UseDraggableFabOptions) {
  // Position libre une fois déplacé au moins une fois ; tant que c'est null,
  // l'appelant garde son ancrage par défaut.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    dragging: boolean;
  } | null>(null);
  const [isSnapping, setIsSnapping] = useState(false);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, []);

  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    // Empêche le navigateur de synthétiser un clic de compatibilité après le
    // relâchement tactile : sans ça, ce clic fantôme atterrit sur l'overlay
    // plein écran qui vient de s'afficher et referme aussitôt la messagerie.
    e.preventDefault();
    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    setIsSnapping(false);
    const rect = wrapper.getBoundingClientRect();
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
      dragging: false,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    if (!drag.dragging && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    drag.dragging = true;

    const maxX = window.innerWidth - FAB_SIZE;
    const maxY = window.innerHeight - FAB_SIZE;
    setPosition({
      x: Math.min(Math.max(drag.originX + dx, 0), maxX),
      y: Math.min(Math.max(drag.originY + dy, 0), maxY),
    });
  };

  // La décision d'ouvrir se prend ici plutôt que dans onClick : après un
  // vrai glissé tactile, les navigateurs ne déclenchent pas forcément de
  // "click" ensuite, donc on ne peut pas se fier à cet événement pour
  // distinguer tap et glissé.
  const handlePointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;

    if (drag.dragging) {
      // Aimantation : se recale sur le bord gauche ou droit le plus proche.
      setPosition((pos) => {
        if (!pos) return pos;
        const snappedX =
          pos.x + FAB_SIZE / 2 < window.innerWidth / 2
            ? EDGE_MARGIN
            : window.innerWidth - FAB_SIZE - EDGE_MARGIN;
        return { x: snappedX, y: pos.y };
      });
      setIsSnapping(true);
      snapTimeoutRef.current = setTimeout(
        () => setIsSnapping(false),
        SNAP_DURATION_MS
      );
    } else {
      onTap();
    }
  };

  return {
    wrapperRef,
    position,
    isSnapping,
    snapDurationMs: SNAP_DURATION_MS,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
