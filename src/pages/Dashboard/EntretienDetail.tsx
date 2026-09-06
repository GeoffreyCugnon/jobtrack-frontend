// src/pages/Dashboard/EntretienDetail.tsx
import { useState } from "react";
import { useParams } from "react-router";
import { Calendar, MapPin, Video, FileQuestion, CheckCircle2 } from "@/lib/icons";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";
import { entretienItems } from "../../data/entretiens";

export function EntretienDetail() {
  const { id } = useParams();
  const entretien = entretienItems.find((item) => String(item.id) === id);
  const [confirmed, setConfirmed] = useState(false);

  if (!entretien) {
    return (
      <div className="flex-1 flex flex-col">
        <Header />
        <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
          <PageTitle title="Entretien introuvable" icon={Calendar} />
          <EmptyState
            icon={FileQuestion}
            message="Cet entretien n'existe pas ou plus."
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
          title={`${entretien.company} — ${entretien.role}`}
          description={entretien.date}
          icon={Calendar}
        />

        <div className="-mx-4 sm:mx-0">
          <SectionCard title="Détails" collapsible={false}>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-base-content/60">Date</span>
                <span className="text-sm text-base-content/90">
                  {entretien.date}
                </span>
              </div>

              {entretien.mode === "visio" ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-base-content/60">
                    <Video className="w-4 h-4" aria-hidden="true" />
                    Visioconférence
                  </span>
                  <a
                    href={entretien.visioLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    Rejoindre la visio
                  </a>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-base-content/60">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    Adresse
                  </span>
                  <span className="text-sm text-base-content/90 text-right">
                    {entretien.location}
                  </span>
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <button
          type="button"
          onClick={() => setConfirmed((v) => !v)}
          className={`btn w-full gap-2 ${confirmed ? "btn-success" : "btn-primary"}`}
        >
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          {confirmed ? "Présence confirmée" : "Confirmer ma présence"}
        </button>
      </PageContainer>
    </div>
  );
}
