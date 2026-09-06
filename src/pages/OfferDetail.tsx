import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Building2,
  Clock,
  FileQuestion,
  MapPin,
  RotateCw,
  Users,
} from "@/lib/icons";
import { Header } from "../components/Layout/Header";
import { EmptyState } from "../components/Layout/EmptyState";
import { OffersApi } from "../api/offers.api";
import { queryKeys } from "../api/query-keys";
import { offerCategories } from "../data/offerCategories";

const WORK_MODE_LABEL: Record<string, string> = {
  onSite: "Sur site",
  Remote: "À distance",
  Hybrid: "Hybride",
};

export function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: offer,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.offers.detail(id ?? ""),
    queryFn: () => OffersApi.getById(id!),
    enabled: !!id,
  });

  const categoryLabel = offer
    ? (offerCategories.find((c) => c.key === offer.category)?.label ??
      offer.category)
    : "";

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate("/offers")}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          Retour aux offres
        </button>

        {isPending && (
          <p className="p-4 text-sm text-base-content/60">
            Chargement de l'offre...
          </p>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-3 p-6">
            <EmptyState
              icon={Briefcase}
              message="Impossible de charger cette offre pour le moment."
            />
            <button
              type="button"
              onClick={() => void refetch()}
              className="btn btn-sm btn-outline gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        )}

        {!isPending && !isError && !offer && (
          <EmptyState
            icon={FileQuestion}
            message="Cette offre n'existe pas ou plus."
          />
        )}

        {!isPending && !isError && offer && (
          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body gap-4 p-6">
              <div>
                <h1 className="flex items-center gap-2 text-xl font-bold text-primary">
                  {offer.role}
                  {offer.verified && (
                    <BadgeCheck
                      aria-label="Offre vérifiée"
                      className="w-5 h-5 shrink-0"
                    />
                  )}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/70">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {offer.company}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {offer.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {offer.timeAgo}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {offer.contractType && (
                  <span className="badge badge-primary badge-soft font-medium">
                    {offer.contractType}
                  </span>
                )}
                {offer.workMode && (
                  <span className="badge badge-soft font-medium">
                    {WORK_MODE_LABEL[offer.workMode] ?? offer.workMode}
                  </span>
                )}
                <span className="badge badge-outline font-medium">
                  {categoryLabel}
                </span>
                {offer.applicantCount !== undefined && (
                  <span className="badge badge-ghost gap-1 font-medium">
                    <Users className="w-3.5 h-3.5" />
                    {offer.applicantCount} candidat
                    {offer.applicantCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div>
                <h2 className="mb-1 text-sm font-semibold text-base-content/70">
                  Description
                </h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-base-content/80">
                  {offer.description?.trim() ||
                    "Aucune description fournie pour cette offre."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  // TODO: brancher sur POST /application
                }}
                className="btn btn-primary mt-2 self-start"
              >
                Postuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
