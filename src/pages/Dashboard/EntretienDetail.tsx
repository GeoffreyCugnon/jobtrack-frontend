// src/pages/Dashboard/EntretienDetail.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { Calendar, CheckCircle, FileDashed, MapPin, VideoCamera } from "@phosphor-icons/react";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { SectionCard } from "../../components/Layout/SectionCard";
import { InterviewsApi } from "../../api/interviews.api";
import { queryKeys } from "../../api/query-keys";

export function EntretienDetail() {
  const { id } = useParams();
  const [confirmed, setConfirmed] = useState(false);

  const {
    data: entretien,
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKeys.interviews.detail(id ?? ""),
    queryFn: () => InterviewsApi.getById(id!),
    enabled: !!id,
  });

  if (isPending) {
    return (
      <div className="flex-1 flex flex-col">
        <Header />
        <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
          <PageTitle title="Entretien" icon={Calendar} />
          <p className="p-4 text-sm text-base-content/60">Chargement…</p>
        </PageContainer>
      </div>
    );
  }

  if (isError || !entretien) {
    return (
      <div className="flex-1 flex flex-col">
        <Header />
        <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
          <PageTitle title="Entretien introuvable" icon={Calendar} />
          <EmptyState
            icon={FileDashed}
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
                    <VideoCamera className="w-4 h-4" aria-hidden="true" />
                    {entretien.interviewType === "TELEPHONE"
                      ? "Entretien téléphonique"
                      : "Visioconférence"}
                  </span>
                  {entretien.visioLink ? (
                    <a
                      href={entretien.visioLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      Rejoindre
                    </a>
                  ) : (
                    <span className="text-sm text-base-content/90 text-right">
                      {entretien.notes ?? "—"}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm text-base-content/60">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                    Adresse
                  </span>
                  <span className="text-sm text-base-content/90 text-right">
                    {entretien.location ?? "À préciser"}
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
          <CheckCircle className="w-4 h-4" aria-hidden="true" />
          {confirmed ? "Présence confirmée" : "Confirmer ma présence"}
        </button>
      </PageContainer>
    </div>
  );
}
