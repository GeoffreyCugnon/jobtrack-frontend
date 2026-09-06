// src/constants/layout.ts
export const BOTTOM_NAV_HEIGHT = 64; // px

// Coin inférieur droit : zone d'empilement au-dessus de la barre de nav mobile
// (toasts, bouton flottant messagerie). Tout part de ce niveau puis s'empile
// vers le haut.
export const STACK_BOTTOM_OFFSET = BOTTOM_NAV_HEIGHT + 12; // px, au-dessus de la nav
export const STACK_ITEM_GAP = 12; // px, entre deux éléments empilés