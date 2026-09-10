// src/pages/Dashboard/Candidatures.tsx
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "@/lib/icons";
import { ClickableRow } from "../../components/Layout/ClickableRow";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";
import { ApplicationsApi } from "../../api/applications.api";
import { queryKeys } from "../../api/query-keys";
import { CANDIDATURE_STATUS_BADGE_CLASS } from "./candidature-status";

export function Candidatures() {
  const {
    data: candidatures = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKeys.applications.all,
    queryFn: () => ApplicationsApi.list(),
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Candidatures actives"
          description="Vos candidatures en cours de traitement"
          icon={TrendingUp}
        />

        <div className="-mx-4 sm:mx-0">
          <SectionCard title="Candidatures" collapsible={false}>
            {isPending ? (
              <p className="p-4 text-sm text-base-content/60">Chargement…</p>
            ) : isError ? (
              <EmptyState
                icon={TrendingUp}
                message="Impossible de charger vos candidatures pour le moment."
              />
            ) : candidatures.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                message="Aucune candidature en cours, lancez-vous !"
              />
            ) : (
              <div className="divide-y divide-base-200">
                {candidatures.map((candidature) => (
                  <ClickableRow
                    key={candidature.id}
                    to={`/candidatures/${candidature.id}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-base-content/90 truncate">
                        {candidature.company} — {candidature.role}
                      </span>
                      <span
                        className={`badge badge-sm shrink-0 ${
                          CANDIDATURE_STATUS_BADGE_CLASS[
                            candidature.statusLabel
                          ] ?? "badge-soft"
                        }`}
                      >
                        {candidature.statusLabel}
                      </span>
                    </div>
                  </ClickableRow>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      </PageContainer>
    </div>
  );
}
