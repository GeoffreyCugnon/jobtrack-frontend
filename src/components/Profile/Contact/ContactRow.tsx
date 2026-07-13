// ContactRow.tsx
interface ContactRowProps {
  icon: React.ReactNode; // ou LucideIcon si toutes sont Lucide
  label: string;
}
export function ContactRow({ icon, label }: ContactRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-base-200 flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className="text-sm text-base-content/90">{label}</span>
    </div>
  );
}