// src/hooks/useSwipeGestures.ts
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMenu } from "../context/Menu/useMenu";
import { useMessaging } from "../context/Messaging/useMessaging";
import { MAIN_NAV_ITEMS } from "../constants/nav";

// Largeur (px) de la zone considérée comme "bord d'écran" pour déclencher
// l'ouverture du menu/de la messagerie plutôt qu'une navigation de page.
const EDGE_ZONE = 24;
// Distance horizontale minimale (px) pour valider un glissé volontaire.
const SWIPE_DISTANCE_THRESHOLD = 60;
// Au-delà de cette durée, un déplacement lent n'est plus considéré comme un
// "glissé" (évite de confondre avec un drag lent ou une hésitation).
const SWIPE_MAX_DURATION_MS = 600;
// Le geste doit être nettement plus horizontal que vertical pour ne pas
// entrer en conflit avec le scroll vertical de la page.
const DIRECTION_DOMINANCE_RATIO = 1.5;

type SwipeZone = "left-edge" | "right-edge" | "interior";

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
  zone: SwipeZone;
  // Le geste démarre dans un conteneur à défilement horizontal existant
  // (ex: filtres d'offres) : on laisse ce défilement natif faire son travail.
  skip: boolean;
}

function startsInsideHorizontalScroller(target: EventTarget | null): boolean {
  let node = target instanceof Element ? target : null;
  while (node) {
    const overflowX = getComputedStyle(node).overflowX;
    if (overflowX === "auto" || overflowX === "scroll") return true;
    node = node.parentElement;
  }
  return false;
}

// Comportements tactiles globaux de l'app (mobile) :
// - glisser depuis le bord gauche -> ouvre le SideMenu
// - glisser depuis le bord droit -> ouvre la Messagerie
// - glisser depuis l'intérieur vers la gauche -> page précédente de la navbar
// - glisser depuis l'intérieur vers la droite -> page suivante de la navbar
export function useSwipeGestures() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMenuOpen, openMenu } = useMenu();
  const { isMessagingOpen, openMessaging } = useMessaging();

  // Toujours à jour à chaque rendu, lu par des listeners montés une seule
  // fois — évite de démonter/remonter les listeners à chaque changement
  // d'état (isMenuOpen, isMessagingOpen, route...).
  const latestRef = useRef({
    location,
    isMenuOpen,
    isMessagingOpen,
    openMenu,
    openMessaging,
  });
  latestRef.current = {
    location,
    isMenuOpen,
    isMessagingOpen,
    openMenu,
    openMessaging,
  };

  const swipeRef = useRef<SwipeState | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        swipeRef.current = null;
        return;
      }
      const { isMenuOpen, isMessagingOpen } = latestRef.current;
      if (isMenuOpen || isMessagingOpen) {
        swipeRef.current = null;
        return;
      }

      const touch = e.touches[0];
      const zone: SwipeZone =
        touch.clientX < EDGE_ZONE
          ? "left-edge"
          : touch.clientX > window.innerWidth - EDGE_ZONE
            ? "right-edge"
            : "interior";

      swipeRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        zone,
        skip: startsInsideHorizontalScroller(e.target),
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const state = swipeRef.current;
      if (!state || state.skip || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - state.startX;
      const dy = touch.clientY - state.startY;
      // Une fois le geste clairement horizontal, on empêche le scroll/les
      // gestes natifs (retour navigateur) de prendre le dessus.
      if (
        Math.abs(dx) > 10 &&
        Math.abs(dx) > Math.abs(dy) * DIRECTION_DOMINANCE_RATIO
      ) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const state = swipeRef.current;
      swipeRef.current = null;
      if (!state || state.skip) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - state.startX;
      const dy = touch.clientY - state.startY;
      const elapsed = Date.now() - state.startTime;
      const isHorizontal =
        Math.abs(dx) > Math.abs(dy) * DIRECTION_DOMINANCE_RATIO;

      if (
        !isHorizontal ||
        Math.abs(dx) < SWIPE_DISTANCE_THRESHOLD ||
        elapsed > SWIPE_MAX_DURATION_MS
      ) {
        return;
      }

      const { location, openMenu, openMessaging } = latestRef.current;

      if (state.zone === "left-edge" && dx > 0) {
        openMenu();
        return;
      }
      if (state.zone === "right-edge" && dx < 0) {
        openMessaging();
        return;
      }
      if (state.zone === "interior") {
        const currentIndex = MAIN_NAV_ITEMS.findIndex(
          (item) => item.path === location.pathname
        );
        if (currentIndex === -1) return;
        if (dx < 0 && currentIndex > 0) {
          navigate(MAIN_NAV_ITEMS[currentIndex - 1].path);
        } else if (dx > 0 && currentIndex < MAIN_NAV_ITEMS.length - 1) {
          navigate(MAIN_NAV_ITEMS[currentIndex + 1].path);
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigate]);
}
