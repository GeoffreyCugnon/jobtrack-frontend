import { Briefcase } from "lucide-react";

export function AuthLogo() {
  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-md">
        <Briefcase className="w-8 h-8 text-primary-content" />
      </div>
      <h1 className="text-xl font-bold text-base-content uppercase tracking-wide">
        Mon CRM Emploi
      </h1>
    </div>
  );
}
