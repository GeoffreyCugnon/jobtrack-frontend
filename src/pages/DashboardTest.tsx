// src/pages/DashboardTest.tsx
// Variante du Dashboard inspirée de la structure de la page Profil :
// bannière "hero" avec avatar en overlap, et sections en cartes repliables
// (même pattern que ProfileContact/ProfileSkills) via SectionCard.
import {
  Home,
  Mail,
  Link as LinkIcon,
  TrendingUp,
  Calendar,
  Briefcase,
  Briefcase as BriefcaseIcon,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Card as StatCard } from "../components/Dashboard/StatsCards/StatCard";
import { TaskRow } from "../components/Dashboard/UrgentTasks/TaskRow";
import { Header } from "../components/Layout/Header";
import { PageContainer } from "../components/Layout/PageContainer";
import { PageTitle } from "../components/Layout/PageTitle";
import { SectionCard } from "../components/Layout/SectionCard";

export function DashboardTest() {
  const user = { name: "Geoffrey", urgentCount: 2 };
  const initials = user.name.slice(0, 2).toUpperCase();

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
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle title="Dashboard" icon={Home} />

        {/* Même convention que ProfileIdentity/Contact/Skills : sections en
            pleine largeur sur mobile (-mx-4), avec la marge de page qui
            revient à partir de sm. */}
        <div className="-mx-4 sm:mx-0 flex-1 flex flex-col">
          {/* Bannière "hero" — même structure que ProfileIdentity, condensée */}
          <div className="rounded-none sm:rounded-box overflow-hidden">
            <div className="h-16 sm:h-24 bg-linear-to-r from-primary to-secondary" />
            <div className="relative bg-base-100 pt-8 px-4 pb-4 -mt-2">
              <div className="absolute left-4 -top-8 avatar placeholder">
                <div className="w-16 h-16 rounded-full ring-4 ring-base-100 shadow-md bg-primary text-primary-content flex items-center justify-center font-semibold">
                  {initials}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-base-content">
                    Bonjour {user.name} !
                  </h2>
                  <p className="text-sm text-base-content/60">
                    {user.urgentCount} relances urgentes aujourd'hui
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-sm shrink-0 gap-1.5 bg-base-200 hover:bg-base-300 text-base-content/80 hover:text-base-content border-none transition-colors"
                >
                  Relances
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <SectionCard title="Stats rapides" collapsible={false}>
            <div className="-m-4 grid grid-cols-3">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="À faire ce jour"
            addLabel="Ajouter une tâche"
            collapsible={false}
            onAdd={() => {
              // TODO: brancher sur la création manuelle de tâche
              console.log("Ajouter une tâche");
            }}
          >
            <div className="divide-y divide-base-200">
              {urgentTasks.map((task) => (
                <TaskRow key={task.id} {...task} />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Derniers événements" collapsible={false}>
            <div className="divide-y divide-base-200">
              {recentEvents.map(({ id, text, icon: Icon, variant }) => (
                <div
                  key={id}
                  className="flex items-center gap-2 py-2 first:pt-0 last:pb-0"
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      variant === "error"
                        ? "text-error"
                        : "text-base-content/50"
                    }`}
                  />
                  <span className="text-base-content/80">{text}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="flex-1 bg-base-100" />
        </div>
      </PageContainer>
    </div>
  );
}
