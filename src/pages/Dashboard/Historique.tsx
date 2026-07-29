// src/pages/Dashboard/Historique.tsx
import {
  History,
  Briefcase as BriefcaseIcon,
  XCircle,
  Mail,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { EventRow } from "../../components/Dashboard/RecentEvents/EventRow";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";

export function Historique() {
  const events = [
    {
      id: 1,
      text: 'Offre sauvegardée : "Dev React"',
      icon: BriefcaseIcon,
      time: "Il y a 20 min",
    },
    {
      id: 2,
      text: 'Statut modifié : "Lidl" -> Refusé',
      icon: XCircle,
      time: "Il y a 1 h",
    },
    {
      id: 3,
      text: 'Relance envoyée : "TechCorp"',
      icon: Mail,
      time: "Hier",
    },
    {
      id: 4,
      text: 'Candidature envoyée : "Concepteur Appli - InnovA"',
      icon: CheckCircle2,
      time: "Il y a 2 jours",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Historique des actions"
          description="Toutes les actions récentes sur votre compte"
          icon={History}
        />

        <div className="-mx-4 sm:mx-0">
          <SectionCard title="Actions" collapsible={false}>
            {events.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                message="Aucune action pour l'instant, revenez plus tard !"
              />
            ) : (
              <div className="divide-y divide-base-200">
                {events.map(({ id, ...event }) => (
                  <EventRow key={id} {...event} />
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </PageContainer>
    </div>
  );
}
