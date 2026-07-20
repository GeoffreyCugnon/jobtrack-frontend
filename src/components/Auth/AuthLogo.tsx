// src/components/Auth/AuthLogo.tsx
import { LogoMark } from "./LogoMark";

type AuthLogoSize = "sm" | "lg";

interface AuthLogoProps {
  size?: AuthLogoSize;
  align?: "left" | "center";
}

export function AuthLogo({ size = "lg", align = "center" }: AuthLogoProps) {
  const width = size === "lg" ? "w-96" : "w-52";

  return (
    <div className={align === "center" ? "flex justify-center mb-8" : ""}>
      <LogoMark className={`${width} text-base-content`} align={align} />
    </div>
  );
}
