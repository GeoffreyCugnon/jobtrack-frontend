// src/pages/Dashboard/Relances.tsx
import { Mail, Link as LinkIcon, Phone, CheckCircle2 } from "@/lib/icons";
import { TaskRow } from "../../components/Dashboard/UrgentTasks/TaskRow";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";

export function Relances() {
  const relances = [
    {
      id: 1,
      type: "relance",
      company: "TechCorp",
      role: "RH",
      icon: Mail,
      time: "Aujourd'hui",
      dueCategory: "today" as const,
    },
    {
      id: 2,
      type: "entretien",
      text: "Entretien demain 14h",
      icon: LinkIcon,
      time: "Demain",
      dueCategory: "upcoming" as const,
    },
    {
      id: 3,
      type: "relance",
      company: "InnovA",
      role: "Recruteur",
      icon: Phone,
      time: "Vendredi",
      dueCategory: "upcoming" as const,
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Relances"
          description="Toutes vos relances et entretiens à venir"
          icon={Mail}
        />

        <div className="-mx-4 sm:mx-0">
          <SectionCard title="Toutes les relances" collapsible={false}>
            {relances.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                message="Aucune relance en attente, vous êtes à jour !"
              />
            ) : (
              <div className="divide-y divide-base-200">
                {relances.map((relance) => (
                  <TaskRow key={relance.id} {...relance} />
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </PageContainer>
    </div>
  );
}
