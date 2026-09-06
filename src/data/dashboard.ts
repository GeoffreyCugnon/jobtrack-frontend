import { Mail, Eye, TrendingUp, Calendar, Briefcase, XCircle, type LucideIcon } from "@/lib/icons";

export interface DashboardStat {
  label: string;
  count: number;
  icon: LucideIcon;
  to: string;
}

export const dashboardStats: DashboardStat[] = [
  {
    label: "Candidatures actives",
    count: 12,
    icon: TrendingUp,
    to: "/candidatures",
  },
  {
    label: "Entretiens prévus",
    count: 3,
    icon: Calendar,
    to: "/entretiens",
  },
  {
    label: "Offres disponibles",
    count: 1,
    icon: Briefcase,
    to: "/offers",
  },
];

export interface DashboardTask {
  id: number;
  type: string;
  company?: string;
  role?: string;
  text?: string;
  icon: LucideIcon;
  time?: string;
  dueCategory: "today" | "upcoming";
}

export const dashboardTodayTasks: DashboardTask[] = [
  {
    id: 1,
    type: "relance",
    company: "TechCorp",
    role: "RH",
    icon: Mail,
    time: "Aujourd'hui",
    dueCategory: "today",
  },
];

export const dashboardUpcomingTasks: DashboardTask[] = [
  {
    id: 2,
    type: "entretien",
    text: "Entretien demain 14h",
    icon: Eye,
    time: "Demain",
    dueCategory: "upcoming",
  },
];

export interface DashboardEvent {
  id: number;
  text: string;
  icon: LucideIcon;
  time?: string;
}

export const dashboardRecentEvents: DashboardEvent[] = [
  {
    id: 1,
    text: 'Offre sauvegardée : "Dev React"',
    icon: Briefcase,
    time: "Il y a 20 min",
  },
  {
    id: 2,
    text: 'Statut modifié : "Lidl" -> Refusé',
    icon: XCircle,
    time: "Il y a 1 h",
  },
];
