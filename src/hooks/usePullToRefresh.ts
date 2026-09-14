// src/hooks/usePullToRefresh.ts
import { useEffect, useRef, useState } from "react";

// Distance de tirage (px, après résistance) nécessaire pour déclencher le
// refresh au relâchement.
const PULL_THRESHOLD = 70;
// Tirage visuel maximum : au-delà, le doigt continue de bouger mais
// l'indicateur ne suit plus (résistance en fin de course).
const MAX_PULL = 90;
// Résistance appliquée au déplacement brut du doigt (effet "élastique").
const RESISTANCE = 0.5;

function findScrollableAncestor(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    const overflowY = getComputedStyle(node).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

/**
 * Pull-to-refresh générique : glisser vers le bas depuis le haut d'une liste
 * déjà scrollée en haut déclenche `onRefresh`. La page elle-même n'a pas de
 * scroll propre (c'est le conteneur `overflow-y-auto` de `Root` qui défile).
 *
 * Écoute au niveau `document` (comme `useSwipeGestures`) plutôt que
 * d'attacher les écouteurs directement sur le scroller trouvé au montage :
 * ce dernier peut être remonté (Fast Refresh, re-rendu du layout partagé
 * `Root`...) entre-temps, ce qui laisserait les écouteurs sur un nœud DOM
 * détaché — constaté en pratique. On revalide donc `containerRef` et on
 * recherche le scroller à chaque geste plutôt qu'une seule fois.
 */
export function usePullToRefresh<T extends HTMLElement>(
  onRefresh: () => unknown,
) {
  const containerRef = useRef<T>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => {
    let startY: number | null = null;
    let scroller: HTMLElement | null = null;
    let tracking = false;
    let pull = 0;
    let busy = false;

    const onTouchStart = (e: TouchEvent) => {
      const container = containerRef.current;
      if (
        e.touches.length !== 1 ||
        busy ||
        !container ||
        !(e.target instanceof Node) ||
        !container.contains(e.target)
      ) {
        tracking = false;
        return;
      }
      scroller = findScrollableAncestor(container);
      if (!scroller || scroller.scrollTop > 0) {
        tracking = false;
        return;
      }
      startY = e.touches[0].clientY;
      tracking = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking || startY === null || !scroller) return;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0 || scroller.scrollTop > 0) {
        tracking = false;
        pull = 0;
        setPullDistance(0);
        return;
      }
      // Empêche le navigateur d'interpréter le geste comme un scroll/un
      // pull-to-refresh natif pendant qu'on gère le nôtre.
      e.preventDefault();
      pull = Math.min(dy * RESISTANCE, MAX_PULL);
      setPullDistance(pull);
    };

    const onTouchEnd = () => {
      if (!tracking) return;
      tracking = false;
      startY = null;
      const shouldRefresh = pull >= PULL_THRESHOLD;
      const activeScroller = scroller;
      pull = 0;
      setPullDistance(0);
      if (!shouldRefresh || !activeScroller) return;

      busy = true;
      setRefreshing(true);
      activeScroller.scrollTo({ top: 0, behavior: "smooth" });
      Promise.resolve(onRefreshRef.current()).finally(() => {
        busy = false;
        setRefreshing(false);
      });
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  return { containerRef, pullDistance, refreshing, threshold: PULL_THRESHOLD };
}
