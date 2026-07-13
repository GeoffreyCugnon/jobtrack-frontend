// src/pages/Dashboard.tsx
import {
  Mail,
  Link as LinkIcon,
  TrendingUp,
  Calendar,
  Briefcase,
  Briefcase as BriefcaseIcon,
  XCircle,
} from "lucide-react";
import { WelcomeBanner } from "../components/Dashboard/WelcomeBanner";
import { StatCards } from "../components/Dashboard/StatsCards";
import { UrgentTasks } from "../components/Dashboard/UrgentTasks";
import { RecentEvents } from "../components/Dashboard/RecentEvents";
import { Header } from "../components/Header";
import { PageContainer } from "../components/Layout/PageContainer";

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
    { id: 1, text: 'Offre sauvegardée : "Dev React"', icon: BriefcaseIcon },
    {
      id: 2,
      text: 'Statut modifié : "Lidl" -> Refusé',
      icon: XCircle,
      variant: "error" as const,
    },
  ];

  return (
    <>
      <Header title="MON CRM EMPLOI" />
      <PageContainer className="py-4 space-y-4">
        <WelcomeBanner name="Geoffrey" urgentCount={2} />
        <StatCards stats={stats} />
        <UrgentTasks tasks={urgentTasks} />
        <RecentEvents events={recentEvents} />
      </PageContainer>
    </>
  );
}
