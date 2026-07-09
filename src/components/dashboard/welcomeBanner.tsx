// src/components/dashboard/WelcomeBanner.tsx
interface WelcomeBannerProps {
  name: string;
  urgentCount: number;
}

export function WelcomeBanner({ name, urgentCount }: WelcomeBannerProps) {
  return (
    <div className="alert alert-info shadow-sm rounded-lg p-4 flex flex-col items-start gap-1">
      <div>
        <p className="text-lg font-medium">Bonjour {name} !</p>
        <p className="text-sm flex items-center gap-2 mt-1 opacity-90">
          <span>👉</span>
          <span>{urgentCount} relances urgentes aujourd'hui</span>
        </p>
      </div>
    </div>
  );
}