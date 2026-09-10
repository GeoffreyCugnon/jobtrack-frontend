// src/pages/Dashboard/Dashboard.tsx
// Structure inspirée de la page Profil : bannière "hero" avec avatar en
// overlap, et sections en cartes repliables (même pattern que
// ProfileContact/ProfileSkills) via SectionCard.
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "@/lib/icons";
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
import { DEFAULT_MOTIVATION, pickMotivation } from "../../data/motivation";

// Le widget "Derniers événements" n'affiche que les entrées pas encore vues ;
// elles ne sont marquées comme vues qu'au clic sur "Voir tout".
const SEEN_EVENTS_KEY = "dashboard-seen-event-ids";
const MAX_VISIBLE_EVENTS = 3;
const MAX_VISIBLE_TASKS = 5;

// Présentation (libellé / icône / lien) des 3 tuiles ; le compteur vient de
// `GET /dashboard/stats`.
const STAT_TILES: { key: string; label: string; icon: LucideIcon; to: string }[] =
  [
    {
      key: "activeApplications",
      label: "Candidatures actives",
      icon: TrendingUp,
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

export function Dashboard() {
  const [seenEventIds, setSeenEventIds] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(SEEN_EVENTS_KEY);
      return raw ? (JSON.parse(raw) as number[]) : [];
    } catch {
      return [];
    }
  });

  const authUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const display = getUserDisplay(authUser);
  const user = { name: display.firstName || "Invité" };
  const initials = display.initials;

  const { data: stats } = useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => DashboardApi.stats(),
    enabled: isAuthenticated,
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

  const statCounts: Record<string, number> = {
    activeApplications: stats?.activeApplications ?? 0,
    upcomingInterviews: stats?.upcomingInterviews ?? 0,
    availableOffers: stats?.availableOffers ?? 0,
  };

  // "Prochaines actions" : les entretiens à venir (plus de "relances", pas de
  // modèle côté Backend).
  const upcomingTasks = useMemo(
    () =>
      interviews
        .filter((interview) => interview.isUpcoming)
        .slice(0, MAX_VISIBLE_TASKS)
        .map((interview) => ({
          id: interview.id,
          type: "entretien",
          text: `Entretien — ${interview.company}`,
          icon: Calendar,
          time: interview.date,
          dueCategory: "upcoming" as const,
        })),
    [interviews],
  );

  // "Derniers événements" : dérivé des candidatures récentes.
  const recentEvents = useMemo(
    () =>
      applications.slice(0, 8).map((application) => ({
        id: application.id,
        text: `Candidature — ${application.role} chez ${application.company}`,
        icon: Briefcase,
        time: application.appliedDate,
      })),
    [applications],
  );

  const newEvents = useMemo(
    () => recentEvents.filter((event) => !seenEventIds.includes(event.id)),
    [recentEvents, seenEventIds],
  );
  const visibleEvents = newEvents.slice(0, MAX_VISIBLE_EVENTS);

  // Ligne "motivation" du hero : contextuelle si le tableau de bord a quelque
  // chose de saillant à dire, sinon une citation. Choisie une seule fois, dès
  // que les compteurs sont chargés (avant : repli neutre).
  const [motivation, setMotivation] = useState<string | null>(null);
  useEffect(() => {
    if (motivation !== null || !stats) return;
    setMotivation(
      pickMotivation({
        todayRelances: 0,
        upcomingInterviews: upcomingTasks.length,
        scheduledInterviews: stats.upcomingInterviews,
        newEvents: newEvents.length,
        activeApplications: stats.activeApplications,
      }),
    );
  }, [stats, upcomingTasks.length, newEvents.length, motivation]);

  const markEventsAsSeen = () => {
    const merged = Array.from(
      new Set([...seenEventIds, ...recentEvents.map((event) => event.id)]),
    );
    setSeenEventIds(merged);
    try {
      localStorage.setItem(SEEN_EVENTS_KEY, JSON.stringify(merged));
    } catch {
      /* stockage indisponible : le widget se re-remplira au prochain chargement */
    }
  };

  return (
    // Fond blanc (pas le gris `base-200` de page) : la bannière et les sections
    // occupent tout, aucune bande grise ne doit apparaître.
    <div className="flex-1 flex flex-col bg-base-100">
      <Header />
      <PageContainer className="flex-1 flex flex-col">
        <div className="-mx-4 sm:mx-0 flex-1 flex flex-col">
          <div className="flex flex-col divide-y divide-base-300">
            <DashboardHeroBanner
              initials={initials}
              name={user.name}
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
                    count={statCounts[tile.key] ?? 0}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Prochaines actions" collapsible={false} flat>
              {upcomingTasks.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  message="Aucun entretien à venir, vous êtes à jour !"
                />
              ) : (
                <div className="space-y-4">
                  <TodoGroup label="À venir" items={upcomingTasks} />
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Derniers événements"
              collapsible={false}
              flat
              headerTo="/historique"
              onHeaderClick={markEventsAsSeen}
              headerAction={
                <span className="flex items-center gap-1 text-[15px] font-medium text-primary">
                  Voir tout
                  <ChevronRight aria-hidden="true" className="w-4 h-4" />
                </span>
              }
            >
              {newEvents.length === 0 ? (
                <EmptyState
                  icon={Sparkles}
                  message="Rien de nouveau pour l'instant, revenez plus tard !"
                />
              ) : (
                <div>
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
