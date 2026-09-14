import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowClockwise, ArrowLeft, PencilSimple } from "@phosphor-icons/react";

import { CompanyDetails } from "../../components/Company/CompanyDetails";
import { CompanyApi } from "../../api/company.api";
import { queryKeys } from "../../api/query-keys";
import { DETAIL_PAGE_GC_TIME, staleTimeByCategory } from "../../api/query-cache";
import { useAuthStore } from "../../store/auth.store";

export function CompanyView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    data: company,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.company.detail(id ?? ""),
    queryFn: () => CompanyApi.getById(id ?? ""),
    enabled: !!id,
    staleTime: staleTimeByCategory.company,
    gcTime: DETAIL_PAGE_GC_TIME,
  });

  // Cette page est publique (accessible depuis une offre d'emploi, elle-même
  // publique) : le crayon d'édition ne doit apparaître que pour le
  // propriétaire de l'entreprise consultée, pas pour n'importe quel visiteur.
  const { data: myCompanies } = useQuery({
    queryKey: queryKeys.company.mineAll,
    queryFn: () => CompanyApi.getMineAll(),
    enabled: isAuthenticated,
    staleTime: staleTimeByCategory.company,
  });
  const isOwner = !!company && !!myCompanies?.some((c) => c.id === company.id);

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
          {company?.name ?? "Entreprise"}
        </h1>
        {isOwner && (
          <button
            type="button"
            aria-label="Modifier la fiche"
            title="Modifier la fiche"
            onClick={() => navigate(`/company/${company.id}/edit`)}
            className="flex shrink-0 text-base-content/70 hover:text-base-content"
          >
            <PencilSimple size={20} />
          </button>
        )}
      </div>

      {isPending ? (
        <p className="px-4 py-8 text-sm text-base-content/60">Chargement…</p>
      ) : isError || !company ? (
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <p className="text-sm text-base-content/60">
            Impossible de charger cette entreprise.
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
      ) : (
        <CompanyDetails company={company} />
      )}
    </div>
  );
}
