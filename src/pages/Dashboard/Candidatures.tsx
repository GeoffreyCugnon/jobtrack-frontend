// src/pages/Dashboard/Candidatures.tsx
import { TrendingUp } from "@/lib/icons";
import { ClickableRow } from "../../components/Layout/ClickableRow";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";
import { candidatureItems } from "../../data/candidatures";

// "Entretien prévu" est une évolution positive (comme le badge "À venir" des
// todo items) ; "En attente" reste neutre, ce n'est ni urgent ni un signal
// positif ou négatif.
const STATUS_BADGE_CLASS: Record<string, string> = {
  "Entretien prévu": "badge-success",
  "En attente": "badge-soft",
};

export function Candidatures() {
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
            {candidatureItems.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                message="Aucune candidature en cours, lancez-vous !"
              />
            ) : (
              <div className="divide-y divide-base-200">
                {candidatureItems.map((candidature) => (
                  <ClickableRow
                    key={candidature.id}
                    to={`/candidatures/${candidature.id}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-base-content/90 truncate">
                        {candidature.company} — {candidature.role}
                      </span>
                      <span
                        className={`badge badge-sm shrink-0 ${STATUS_BADGE_CLASS[candidature.status]}`}
                      >
                        {candidature.status}
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
