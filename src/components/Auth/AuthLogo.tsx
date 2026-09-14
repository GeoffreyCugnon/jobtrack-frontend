// src/components/Auth/AuthLogo.tsx
import { LogoMark } from "./LogoMark";

type AuthLogoSize = "sm" | "lg" | "xl";

interface AuthLogoProps {
  size?: AuthLogoSize;
  align?: "left" | "center";
  /** Réduit la marge basse (`mb-8` -> `mb-2`) : accueil invité, où chaque
   *  pixel compte pour laisser de la place aux cartes offres/publications. */
  compact?: boolean;
}

export function AuthLogo({
  size = "lg",
  align = "center",
  compact = false,
}: AuthLogoProps) {
  // "xl" : largeur relative (plafonnée) plutôt que fixe, pour grossir sur
  // grand écran sans jamais déborder sur un mobile étroit (cf. GuestHome).
  // En `compact`, un plafond un peu réduit laisse de la place aux cartes
  // offres/publications, sans sacrifier l'aération générale de la page pour
  // gagner une carte sur des cas limites (cf. GuestHome).
  // `min-[414px]` est plus PETIT que le palier de base : pas un bug, c'est
  // calé pour une 5e carte offre à 414×846 — une fenêtre redimensionnée en
  // direct autour de 414px verrait le logo rétrécir légèrement, sans impact
  // en usage réel (largeur fixe par device).
  const width =
    size === "xl"
      ? `w-full ${compact ? "max-w-[300px] min-[414px]:max-w-[260px] sm:max-w-xs md:max-w-sm" : "max-w-md"}`
      : size === "lg"
        ? "w-96"
        : "w-52";

  return (
    <div
      className={
        align === "center" ? `flex justify-center ${compact ? "mb-3" : "mb-8"}` : ""
      }
    >
      <LogoMark className={`${width} text-base-content`} />
    </div>
  );
}
