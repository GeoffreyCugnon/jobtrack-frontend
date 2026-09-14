import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowClockwise, ArrowLeft, Briefcase, Buildings, Clock, FileDashed, MapPin, SealCheck, Users } from "@phosphor-icons/react";
import { EmptyState } from "../components/Layout/EmptyState";
import { OffersApi } from "../api/offers.api";
import { ApplicationsApi } from "../api/applications.api";
import { queryKeys } from "../api/query-keys";
import { DETAIL_PAGE_GC_TIME } from "../api/query-cache";
import { useJobCategories } from "../hooks/useJobCategories";
import { useAuthStore } from "../store/auth.store";
import { useToastStore } from "../store/toast.store";
import { getBackendErrorMessage } from "../utils/http-error";
import { logError } from "../utils/log";

const WORK_MODE_LABEL: Record<string, string> = {
  onSite: "Sur site",
  Remote: "À distance",
  Hybrid: "Hybride",
};

export function OfferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    data: offer,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.offers.detail(id ?? ""),
    queryFn: () => OffersApi.getById(id!),
    enabled: !!id,
    gcTime: DETAIL_PAGE_GC_TIME,
  });

  const { categories: jobCategories } = useJobCategories();
  const categoryLabel = offer
    ? (jobCategories.find((c) => c.key === offer.category)?.label ??
      offer.category)
    : "";

  const applyMutation = useMutation({
    mutationFn: () => ApplicationsApi.create({ jobOfferingId: offer!.id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      useToastStore.getState().addToast("Candidature envoyée", "success");
    },
    onError: (error) => {
      logError("offers/apply", error);
      useToastStore
        .getState()
        .addToast(
          getBackendErrorMessage(error, "La candidature a échoué"),
          "error",
        );
    },
  });

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    applyMutation.mutate();
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="mx-auto w-full max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate("/offers")}
          className="mb-4 flex items-center gap-2 text-xl font-bold text-base-content hover:text-base-content/80"
        >
          <ArrowLeft size={20} />
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
              <ArrowClockwise className="w-4 h-4" />
              Réessayer
            </button>
          </div>
        )}

        {!isPending && !isError && !offer && (
          <EmptyState
            icon={FileDashed}
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
                    <SealCheck
                      aria-label="Offre vérifiée"
                      className="w-5 h-5 shrink-0"
                    />
                  )}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-base-content/70">
                  <span className="flex items-center gap-1.5">
                    <Buildings className="w-4 h-4" />
                    {offer.companyId ? (
                      <Link
                        to={`/company/${offer.companyId}`}
                        className="text-link hover:underline"
                      >
                        {offer.company}
                      </Link>
                    ) : (
                      offer.company
                    )}
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
                onClick={handleApply}
                disabled={applyMutation.isPending || applyMutation.isSuccess}
                className="btn btn-primary mt-2 self-start"
              >
                {applyMutation.isSuccess ? "Candidature envoyée" : "Postuler"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
