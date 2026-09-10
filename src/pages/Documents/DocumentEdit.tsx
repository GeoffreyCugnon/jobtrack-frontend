import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "@phosphor-icons/react";
import { FormPageLayout } from "../../components/Layout/FormPageLayout";
import { DocumentsApi } from "../../api/documents.api";
import { queryKeys } from "../../api/query-keys";
import { useToastStore } from "../../store/toast.store";
import { logError } from "../../utils/log";
import { INPUT_CLASS } from "../../constants/styles";

/** Renommage d'un CV / lettre (`/documents/:type/:id/edit`). */
export function DocumentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");

  const { data: item } = useQuery({
    queryKey: queryKeys.documents.detail(id ?? ""),
    queryFn: () => DocumentsApi.getById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (item) setTitle(item.title);
  }, [item]);

  const backPath = `/documents/${item?.basePath ?? "cv"}/${id}`;

  const rename = useMutation({
    mutationFn: (nextTitle: string) => DocumentsApi.rename(id!, nextTitle),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.documents.detail(id ?? ""),
      });
      navigate(backPath);
    },
    onError: (error) => {
      logError("documents/rename", error);
      useToastStore.getState().addToast("L'enregistrement a échoué", "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = title.trim();
    if (!next || rename.isPending) return;
    rename.mutate(next);
  };

  const title2 = item?.basePath === "letters" ? "la lettre" : "le CV";

  return (
    <FormPageLayout
      title={`Modifier ${title2}`}
      icon={Pencil}
      backTo={backPath}
      backLabel="Retour à l'aperçu"
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <label className="block">
          <span className="text-sm text-base-content/70 mb-1 block">Titre</span>
          <input
            type="text"
            className={INPUT_CLASS}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={rename.isPending}
          className="btn btn-primary mt-2 self-start"
        >
          Enregistrer
        </button>
      </form>
    </FormPageLayout>
  );
}
