// src/pages/Dashboard.tsx
import { Mail, Link as LinkIcon, TrendingUp, Calendar, Briefcase } from "lucide-react";
import { WelcomeBanner } from "../components/dashboard/welcomeBanner";
import { StatCards } from "../components/dashboard/statsCards";
import { UrgentTasks } from "../components/dashboard/urgentTasks"; //
import { RecentEvents } from "../components/dashboard/recentEvents";
import { Header } from "../components/header";

export function Dashboard() {
  const stats = [
    { label: "Active", count: 12, icon: TrendingUp },
    { label: "Entret.", count: 3, icon: Calendar },
    { label: "Offres", count: 1, icon: Briefcase },
  ];

  const urgentTasks = [
    { id: 1, type: "relance", company: "TechCorp", role: "RH", icon: Mail },
    { id: 2, type: "entretien", text: "Entretien demain 14h", icon: LinkIcon },
  ];

  const recentEvents = [
    { id: 1, text: 'Offre sauvegardée : "Dev React"' },
    { id: 2, text: 'Statut modifié : "Lidl" -> Refusé' },
  ];

  return (
    <>
      <Header title="MON CRM EMPLOI" />

      {/* Utilisation de p-4 (raccourci Tailwind v4/daisyUI) et maintien de l'espacement entre sections */}
      <div className="p-4 space-y-4">
        {/* 1. Bannière Bienvenue */}
        <WelcomeBanner name="Geoffrey" urgentCount={2} />

        {/* 2. Section Stats */}
        <StatCards stats={stats} />

        {/* 3. Section Tâches urgentes */}
        <UrgentTasks tasks={urgentTasks} />

        {/* 4. Section Événements récents */}
        <RecentEvents events={recentEvents} />
      </div>
    </>
  );
}