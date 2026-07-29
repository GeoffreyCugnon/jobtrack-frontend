// src/pages/Dashboard/Dashboard.tsx
// Structure inspirée de la page Profil : bannière "hero" avec avatar en
// overlap, et sections en cartes repliables (même pattern que
// ProfileContact/ProfileSkills) via SectionCard.
import { useMemo, useState } from "react";
import { Home, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Card as StatCard } from "../../components/Dashboard/StatsCards/StatCard";
import { TodoGroup } from "../../components/Dashboard/UrgentTasks/TodoGroup";
import { EventRow } from "../../components/Dashboard/RecentEvents/EventRow";
import { DashboardHeroBanner } from "../../components/Dashboard/DashboardHeroBanner";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";
import { currentUser } from "../../data/currentUser";
import {
  dashboardStats,
  dashboardTodayTasks,
  dashboardUpcomingTasks,
  dashboardRecentEvents,
} from "../../data/dashboard";

// Le widget "Derniers événements" du dashboard n'affiche que les événements
// pas encore vus ; ils ne sont marqués comme vus qu'au clic sur "Voir tout"
// (jamais au simple montage, pour ne pas les griller sur un refresh
// accidentel). Une fois marqués, ils disparaissent du widget mais restent
// visibles dans l'historique complet.
const SEEN_EVENTS_KEY = "dashboard-seen-event-ids";

// Ces deux widgets restent un aperçu rapide : au-delà, "Voir tout" prend le
// relais (vers l'historique complet, ou vers Relances qui agrège relances et
// entretiens — les lignes elles-mêmes renvoient vers la candidature/
// l'entretien précis, pas vers cette liste globale).
const MAX_VISIBLE_EVENTS = 3;
const MAX_VISIBLE_TASKS = 5;

export function Dashboard() {
  const [seenEventIds, setSeenEventIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(SEEN_EVENTS_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });

  const user = { name: currentUser.firstName };
  const initials = currentUser.initials;

  const stats = dashboardStats;
  const todayTasks = dashboardTodayTasks;
  const upcomingTasks = dashboardUpcomingTasks;
  const recentEvents = dashboardRecentEvents;

  const newEvents = useMemo(
    () => recentEvents.filter((event) => !seenEventIds.includes(event.id)),
    [recentEvents, seenEventIds]
  );
  const visibleEvents = newEvents.slice(0, MAX_VISIBLE_EVENTS);

  // Priorité aux tâches du jour pour les places disponibles dans le plafond.
  const visibleTodayTasks = todayTasks.slice(0, MAX_VISIBLE_TASKS);
  const visibleUpcomingTasks = upcomingTasks.slice(
    0,
    Math.max(0, MAX_VISIBLE_TASKS - visibleTodayTasks.length)
  );

  // "Voir tout" ne sert à rien si le dashboard montre déjà tout — contrairement
  // à "Derniers événements", dont l'historique complet contient toujours plus
  // que les seuls événements non lus affichés ici.
  const totalTasksCount = todayTasks.length + upcomingTasks.length;
  const showTasksSeeAll = totalTasksCount > MAX_VISIBLE_TASKS;

  const markEventsAsSeen = () => {
    const merged = Array.from(
      new Set([...seenEventIds, ...recentEvents.map((event) => event.id)])
    );
    setSeenEventIds(merged);
    localStorage.setItem(SEEN_EVENTS_KEY, JSON.stringify(merged));
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Accueil"
          description="Vue d'ensemble de votre recherche d'emploi"
          icon={Home}
        />

        {/* Même convention que ProfileIdentity/Contact/Skills : sections en
            pleine largeur sur mobile (-mx-4), avec la marge de page qui
            revient à partir de sm. */}
        <div className="-mx-4 sm:mx-0 flex-1 flex flex-col">
          <div className="flex flex-col divide-y divide-base-300">
            <DashboardHeroBanner initials={initials} name={user.name} />

            <SectionCard title="Stats rapides" collapsible={false}>
              <div className="-m-4 grid grid-cols-3">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Prochaines actions"
              collapsible={false}
              {...(showTasksSeeAll
                ? {
                    headerTo: "/app/relances",
                    headerAction: (
                      <span className="flex items-center gap-1 text-sm">
                        Voir tout
                        <ChevronRight
                          aria-hidden="true"
                          className="w-3.5 h-3.5"
                        />
                      </span>
                    ),
                  }
                : {})}
            >
              {visibleTodayTasks.length === 0 &&
              visibleUpcomingTasks.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  message="Aucune action en attente, vous êtes à jour !"
                />
              ) : (
                <div className="space-y-4">
                  <TodoGroup label="Aujourd'hui" items={visibleTodayTasks} />
                  <TodoGroup label="À venir" items={visibleUpcomingTasks} />
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Derniers événements"
              collapsible={false}
              headerTo="/app/historique"
              onHeaderClick={markEventsAsSeen}
              headerAction={
                <span className="flex items-center gap-1 text-sm">
                  Voir tout
                  <ChevronRight aria-hidden="true" className="w-3.5 h-3.5" />
                </span>
              }
            >
              {newEvents.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  message="Rien de nouveau pour l'instant, revenez plus tard !"
                />
              ) : (
                <div className="divide-y divide-base-200">
                  {visibleEvents.map(({ id, ...event }) => (
                    <EventRow key={id} {...event} />
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="flex-1 bg-base-100" />
        </div>
      </PageContainer>
    </div>
  );
}
