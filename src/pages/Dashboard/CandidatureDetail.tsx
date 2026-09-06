// src/pages/Dashboard/CandidatureDetail.tsx
import { useParams } from "react-router";
import { TrendingUp, FileQuestion } from "@/lib/icons";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";
import { candidatureItems } from "../../data/candidatures";

// "Entretien prévu" est une évolution positive ; "En attente" reste neutre.
const STATUS_BADGE_CLASS: Record<string, string> = {
  "Entretien prévu": "badge-success",
  "En attente": "badge-soft",
};

export function CandidatureDetail() {
  const { id } = useParams();
  const candidature = candidatureItems.find((item) => String(item.id) === id);

  if (!candidature) {
    return (
      <div className="flex-1 flex flex-col">
        <Header />
        <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
          <PageTitle title="Candidature introuvable" icon={TrendingUp} />
          <EmptyState
            icon={FileQuestion}
            message="Cette candidature n'existe pas ou plus."
          />
        </PageContainer>
      </div>
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
                  className={`badge badge-sm ${STATUS_BADGE_CLASS[candidature.status]}`}
                >
                  {candidature.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-base-content/60">
                  Entreprise
                </span>
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
            </div>
          </SectionCard>
        </div>

        <button
          type="button"
          onClick={() => {
            // TODO: brancher sur l'envoi réel d'une relance
          }}
          className="btn btn-primary w-full"
        >
          Relancer cette candidature
        </button>
      </PageContainer>
    </div>
  );
}
