// src/components/Auth/AuthLogo.tsx
import { LogoMark } from "./LogoMark";

type AuthLogoSize = "sm" | "lg" | "xl";

interface AuthLogoProps {
  size?: AuthLogoSize;
  align?: "left" | "center";
}

export function AuthLogo({ size = "lg", align = "center" }: AuthLogoProps) {
  // "xl" : largeur relative (plafonnée) plutôt que fixe, pour grossir sur
  // grand écran sans jamais déborder sur un mobile étroit (cf. GuestHome).
  const width =
    size === "xl" ? "w-full max-w-md" : size === "lg" ? "w-96" : "w-52";

  return (
    <div className={align === "center" ? "flex justify-center mb-8" : ""}>
      <LogoMark className={`${width} text-base-content`} />
    </div>
  );
}
