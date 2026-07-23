// src/constants/styles.ts
// Combos de classes DaisyUI/Tailwind répétés à l'identique dans plusieurs
// formulaires, centralisés ici pour éviter la divergence au copier-coller.

export const INPUT_CLASS =
  "input input-bordered border-base-content/20 focus:border-primary w-full";

export const TEXTAREA_CLASS =
  "textarea textarea-bordered border-base-content/20 focus:border-primary w-full";

export const BTN_FOCUS_RING = {
  primary: "border border-primary-content/20 focus:border-primary-content/40",
  secondary:
    "border border-secondary-content/20 focus:border-secondary-content/40",
  error: "border border-error-content/20 focus:border-error-content/40",
} as const;
