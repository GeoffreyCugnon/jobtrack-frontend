import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowClockwise,
  ArrowLeft,
  Buildings,
  PencilSimple,
  Plus,
} from "@phosphor-icons/react";

import { EmptyState } from "../../components/Layout/EmptyState";
import { CompanyDetails } from "../../components/Company/CompanyDetails";
import { CompanyApi } from "../../api/company.api";
import { queryKeys } from "../../api/query-keys";
import { staleTimeByCategory } from "../../api/query-cache";

export function CompanyList() {
  const navigate = useNavigate();

  const {
    data: companies,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.company.mineAll,
    queryFn: () => CompanyApi.getMineAll(),
    staleTime: staleTimeByCategory.company,
  });

  const singleCompany =
    companies && companies.length === 1 ? companies[0] : null;

  return (
    <div className="flex min-h-full shrink-0 flex-col bg-base-100">
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-base-200 bg-base-100 px-4 py-4">
        <button
          type="button"
          aria-label="Retour"
          onClick={() => navigate(-1)}
          className="flex shrink-0 text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-xl font-bold text-base-content">
          {companies && companies.length > 1 ? "Vos entreprises" : "Votre entreprise"}
        </h1>
        {singleCompany && (
          <button
            type="button"
            aria-label="Modifier la fiche"
            title="Modifier la fiche"
            onClick={() => navigate(`/company/${singleCompany.id}/edit`)}
            className="flex shrink-0 text-base-content/70 hover:text-base-content"
          >
            <PencilSimple size={20} />
          </button>
        )}
        <button
          type="button"
          aria-label="Créer une entreprise"
          title="Créer une entreprise"
          onClick={() => navigate("/company/create")}
          className="flex shrink-0 text-base-content/70 hover:text-base-content"
        >
          <Plus size={22} />
        </button>
      </div>

      {isPending ? (
        <p className="px-4 py-8 text-sm text-base-content/60">Chargement…</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <p className="text-sm text-base-content/60">
            Impossible de charger vos entreprises.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="btn btn-sm btn-outline gap-2"
          >
            <ArrowClockwise className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      ) : !companies || companies.length === 0 ? (
        <div className="flex flex-col items-center gap-4 p-10">
          <EmptyState
            icon={Buildings}
            message="Vous n'avez pas encore d'entreprise sur JobTrack."
          />
          <button
            type="button"
            onClick={() => navigate("/company/create")}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Créer une entreprise
          </button>
        </div>
      ) : singleCompany ? (
        <CompanyDetails company={singleCompany} />
      ) : (
        <div className="flex flex-col">
          {companies.map((company) => (
            <button
              key={company.id}
              type="button"
              onClick={() => navigate(`/company/${company.id}`)}
              className="flex flex-col border-b border-base-200 text-left transition-colors hover:bg-base-200/50"
            >
              <div className="h-24 w-full shrink-0 overflow-hidden bg-linear-to-r from-primary to-secondary">
                {company.banner_url && (
                  <img
                    src={company.banner_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-field bg-linear-to-br from-primary to-secondary text-sm font-bold text-primary-content">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    company.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-base-content">
                    {company.name}
                  </h2>
                  {company.business_sector && (
                    <p className="truncate text-sm text-base-content/60">
                      {company.business_sector}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
