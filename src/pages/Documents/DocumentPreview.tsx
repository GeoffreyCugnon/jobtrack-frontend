import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FileText, Pencil } from "@phosphor-icons/react";
import { FormPageLayout } from "../../components/Layout/FormPageLayout";
import { DocumentsApi } from "../../api/documents.api";
import { queryKeys } from "../../api/query-keys";
import { BTN_FOCUS_RING } from "../../constants/styles";

/** Aperçu d'un CV / lettre (`/documents/:type/:id`). */
export function DocumentPreview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: item, isPending } = useQuery({
    queryKey: queryKeys.documents.detail(id ?? ""),
    queryFn: () => DocumentsApi.getById(id!),
    enabled: !!id,
  });

  const label = item?.basePath === "letters" ? "de la lettre" : "du CV";

  return (
    <FormPageLayout
      title={isPending ? "Chargement…" : (item?.title ?? "Document introuvable")}
      icon={FileText}
      backTo="/documents"
      backLabel="Retour aux documents"
    >
      {item ? (
        <>
          <div className="-mt-4 mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-base-content/60">
              Modifié le {item.updatedAt}
            </p>
            <button
              type="button"
              onClick={() =>
                navigate(`/documents/${item.basePath}/${item.id}/edit`)
              }
              className={`btn btn-sm btn-secondary gap-1.5 ${BTN_FOCUS_RING.secondary}`}
            >
              <Pencil size={15} />
              Éditer
            </button>
          </div>
          {/* Le modèle Document ne stocke que titre/type : pas de contenu à
              rendre tant qu'il n'y a pas d'upload de fichier. */}
          <div className="flex items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/40 py-24 text-sm text-base-content/40">
            Aperçu {label} à venir
          </div>
        </>
      ) : !isPending ? (
        <p className="text-sm text-base-content/60">
          Ce document n'existe pas ou plus.
        </p>
      ) : null}
    </FormPageLayout>
  );
}
