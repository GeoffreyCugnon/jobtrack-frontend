// src/components/Auth/LogoMark.tsx
interface LogoMarkProps {
  className?: string;
  align?: "left" | "center";
}

export function LogoMark({ className, align = "left" }: LogoMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 150"
      className={className}
    >
      <defs>
        <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* translate(30,0) uniquement en mode "center" (page d'auth), absent en mode "left" (header) */}
      <g transform={align === "center" ? "translate(30, 0)" : undefined}>
        <g transform="translate(20, 15)">
          <rect
            x="15"
            y="45"
            width="90"
            height="65"
            rx="12"
            fill="url(#primaryGrad)"
            filter="url(#dropShadow)"
          />
          <path
            d="M40,45 V32 C40,26 46,20 52,20 H68 C74,20 80,26 80,32 V45"
            fill="none"
            stroke="url(#primaryGrad)"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M25,85 L50,60 L70,75 L105,35"
            fill="none"
            stroke="url(#accentGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M90,35 H105 V50"
            fill="none"
            stroke="url(#accentGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <g transform="translate(145, 92)">
          <text
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            fontSize="54"
            fontWeight="800"
            fill="currentColor"
            letterSpacing="-1"
          >
            Job<tspan fill="url(#primaryGrad)">Track</tspan>
          </text>
          <text
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
            fontSize="14"
            fontWeight="600"
            fill="#64748b"
            letterSpacing="4"
            x="4"
            y="24"
          >
            CAREER NAVIGATOR
          </text>
        </g>
      </g>
    </svg>
  );
}
