// src/pages/Dashboard/Entretiens.tsx
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/lib/icons";
import { ClickableRow } from "../../components/Layout/ClickableRow";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";
import { InterviewsApi } from "../../api/interviews.api";
import { queryKeys } from "../../api/query-keys";

export function Entretiens() {
  const {
    data: entretiens = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKeys.interviews.all,
    queryFn: () => InterviewsApi.list(),
  });

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Entretiens prévus"
          description="Vos prochains entretiens"
          icon={Calendar}
        />

        <div className="-mx-4 sm:mx-0">
          <SectionCard title="Entretiens" collapsible={false}>
            {isPending ? (
              <p className="p-4 text-sm text-base-content/60">Chargement…</p>
            ) : isError ? (
              <EmptyState
                icon={Calendar}
                message="Impossible de charger vos entretiens pour le moment."
              />
            ) : entretiens.length === 0 ? (
              <EmptyState
                icon={Calendar}
                message="Aucun entretien prévu pour l'instant."
              />
            ) : (
              <div className="divide-y divide-base-200">
                {entretiens.map((entretien) => (
                  <ClickableRow
                    key={entretien.id}
                    to={`/entretiens/${entretien.id}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-base-content/90 truncate">
                        {entretien.company} — {entretien.role}
                      </span>
                      <span className="text-xs text-base-content/50 shrink-0">
                        {entretien.date}
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
