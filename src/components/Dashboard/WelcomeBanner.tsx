// src/components/dashboard/WelcomeBanner.tsx
import { ArrowRight } from "lucide-react";
interface WelcomeBannerProps {
  name: string;
  urgentCount: number;
}

export function WelcomeBanner({ name, urgentCount }: WelcomeBannerProps) {
  return (
    <div className="bg-primary text-primary-content rounded-field p-4 shadow-sm">
      <p className="text-lg font-medium">Bonjour {name} !</p>
      <p className="text-sm flex items-center gap-2 mt-1 text-primary-content/70">
        <ArrowRight className="w-4 h-4 shrink-0" />
        <span>{urgentCount} relances urgentes aujourd'hui</span>
      </p>
    </div>
  );
}