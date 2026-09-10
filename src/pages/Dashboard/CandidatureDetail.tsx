// src/pages/Dashboard/CandidatureDetail.tsx
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { TrendingUp, FileQuestion } from "@/lib/icons";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";
import { ApplicationsApi } from "../../api/applications.api";
import { queryKeys } from "../../api/query-keys";
import { CANDIDATURE_STATUS_BADGE_CLASS } from "./candidature-status";

export function CandidatureDetail() {
  const { id } = useParams();
  const {
    data: candidature,
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKeys.applications.detail(id ?? ""),
    queryFn: () => ApplicationsApi.getById(id!),
    enabled: !!id,
  });

  const shell = (children: React.ReactNode, title = "Candidature") => (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle title={title} icon={TrendingUp} />
        {children}
      </PageContainer>
    </div>
  );

  if (isPending) {
    return shell(
      <p className="p-4 text-sm text-base-content/60">Chargement…</p>,
    );
  }

  if (isError || !candidature) {
    return shell(
      <EmptyState
        icon={FileQuestion}
        message="Cette candidature n'existe pas ou plus."
      />,
      "Candidature introuvable",
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title={`${candidature.company} — ${candidature.role}`}
          description="Détail de la candidature"
          icon={TrendingUp}
        />

        <div className="-mx-4 sm:mx-0">
          <SectionCard title="Résumé" collapsible={false}>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-base-content/60">Statut</span>
                <span
                  className={`badge badge-sm ${
                    CANDIDATURE_STATUS_BADGE_CLASS[candidature.statusLabel] ??
                    "badge-soft"
                  }`}
                >
                  {candidature.statusLabel}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-base-content/60">Entreprise</span>
                <span className="text-sm text-base-content/90">
                  {candidature.company}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-base-content/60">Poste</span>
                <span className="text-sm text-base-content/90">
                  {candidature.role}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-base-content/60">
                  Candidature envoyée le
                </span>
                <span className="text-sm text-base-content/90">
                  {candidature.appliedDate}
                </span>
              </div>
              {candidature.interviewsCount > 0 && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-base-content/60">
                    Entretiens
                  </span>
                  <span className="text-sm text-base-content/90">
                    {candidature.interviewsCount}
                  </span>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </PageContainer>
    </div>
  );
}
