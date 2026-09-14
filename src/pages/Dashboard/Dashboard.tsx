// src/pages/Dashboard/Dashboard.tsx
// Structure inspirée de la page Profil : bannière "hero" avec avatar en
// overlap, et sections en cartes (SectionCard `flat`).
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Calendar, CheckCircle, Sparkle, TrendUp, type Icon as IconType } from "@phosphor-icons/react";
import { StatCard } from "../../components/Dashboard/StatsCards/StatCard";
import { TodoGroup } from "../../components/Dashboard/UrgentTasks/TodoGroup";
import { EventRow } from "../../components/Dashboard/RecentEvents/EventRow";
import { DashboardHeroBanner } from "../../components/Dashboard/DashboardHeroBanner";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { SectionCard } from "../../components/Layout/SectionCard";
import { useAuthStore } from "../../store/auth.store";
import { getUserDisplay } from "../../utils/user-display";
import { DashboardApi } from "../../api/dashboard.api";
import { ApplicationsApi } from "../../api/applications.api";
import { InterviewsApi } from "../../api/interviews.api";
import { queryKeys } from "../../api/query-keys";
import { staleTimeByCategory } from "../../api/query-cache";
import { DEFAULT_MOTIVATION, pickMotivation } from "../../data/motivation";

const MAX_VISIBLE_EVENTS = 4;
const MAX_VISIBLE_TASKS = 5;

// Présentation (libellé / icône / lien) des 3 tuiles ; le compteur vient de
// `GET /dashboard/stats`.
const STAT_TILES: {
  key: keyof DashboardCounts;
  label: string;
  icon: IconType;
  to: string;
}[] = [
  {
    key: "activeApplications",
    label: "Candidatures actives",
    icon: TrendUp,
    to: "/candidatures",
  },
  {
    key: "upcomingInterviews",
    label: "Entretiens prévus",
    icon: Calendar,
    to: "/entretiens",
  },
  {
    key: "availableOffers",
    label: "Offres disponibles",
    icon: Briefcase,
    to: "/offers",
  },
];

interface DashboardCounts {
  activeApplications: number;
  upcomingInterviews: number;
  availableOffers: number;
}

export function Dashboard() {
  const authUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const display = getUserDisplay(authUser);
  const name = display.firstName || "Invité";

  const { data: stats } = useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => DashboardApi.stats(),
    enabled: isAuthenticated,
    staleTime: staleTimeByCategory.dashboardStats,
  });
  const { data: applications = [] } = useQuery({
    queryKey: queryKeys.applications.all,
    queryFn: () => ApplicationsApi.list(),
    enabled: isAuthenticated,
  });
  const { data: interviews = [] } = useQuery({
    queryKey: queryKeys.interviews.all,
    queryFn: () => InterviewsApi.list(),
    enabled: isAuthenticated,
  });

  const counts: DashboardCounts = {
    activeApplications: stats?.activeApplications ?? 0,
    upcomingInterviews: stats?.upcomingInterviews ?? 0,
    availableOffers: stats?.availableOffers ?? 0,
  };

  // "Prochaines actions" : les entretiens à venir.
  const upcomingTasks = useMemo(
    () =>
      interviews
        .filter((interview) => interview.isUpcoming)
        .slice(0, MAX_VISIBLE_TASKS)
        .map((interview) => ({
          id: interview.id,
          text: `Entretien — ${interview.company}`,
          icon: Calendar,
          time: interview.date,
          to: `/entretiens/${interview.id}`,
        })),
    [interviews],
  );

  // "Activité récente" : dérivée des candidatures les plus récentes.
  const recentEvents = useMemo(
    () =>
      applications.slice(0, MAX_VISIBLE_EVENTS).map((application) => ({
        id: application.id,
        text: `Candidature — ${application.role} chez ${application.company}`,
        icon: Briefcase,
        time: application.appliedDate,
      })),
    [applications],
  );

  // Ligne "motivation" du hero : contextuelle ou citation, choisie une fois les
  // compteurs chargés (repli neutre avant).
  const [motivation, setMotivation] = useState<string | null>(null);
  useEffect(() => {
    if (motivation !== null || !stats) return;
    setMotivation(
      pickMotivation({
        todayRelances: 0,
        upcomingInterviews: upcomingTasks.length,
        scheduledInterviews: stats.upcomingInterviews,
        newEvents: recentEvents.length,
        activeApplications: stats.activeApplications,
      }),
    );
  }, [stats, upcomingTasks.length, recentEvents.length, motivation]);

  return (
    <div className="flex-1 flex flex-col bg-base-100">
      <Header />
      <PageContainer className="flex-1 flex flex-col">
        <div className="-mx-4 sm:mx-0 flex-1 flex flex-col">
          <div className="flex flex-col divide-y divide-base-300">
            <DashboardHeroBanner
              initials={display.initials}
              name={name}
              avatarUrl={display.avatarUrl}
              bannerUrl={display.bannerUrl}
              motivation={motivation ?? DEFAULT_MOTIVATION}
            />

            <SectionCard title="Stats rapides" collapsible={false} flat>
              <div className="-mx-4 -mb-4 grid grid-cols-3">
                {STAT_TILES.map((tile) => (
                  <StatCard
                    key={tile.key}
                    label={tile.label}
                    icon={tile.icon}
                    to={tile.to}
                    count={counts[tile.key]}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Prochaines actions" collapsible={false} flat>
              {upcomingTasks.length === 0 ? (
                <EmptyState
                  icon={CheckCircle}
                  message="Aucun entretien à venir, vous êtes à jour !"
                />
              ) : (
                <TodoGroup label="À venir" items={upcomingTasks} />
              )}
            </SectionCard>

            <SectionCard title="Activité récente" collapsible={false} flat>
              {recentEvents.length === 0 ? (
                <EmptyState
                  icon={Sparkle}
                  message="Rien pour l'instant — vos candidatures apparaîtront ici."
                />
              ) : (
                <div>
                  {recentEvents.map(({ id, ...event }) => (
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
