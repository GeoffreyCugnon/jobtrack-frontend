import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "@/lib/icons";
import { Header } from "../../components/Layout/Header";
import { DocumentsApi } from "../../api/documents.api";
import { queryKeys } from "../../api/query-keys";
import { useToastStore } from "../../store/toast.store";
import { INPUT_CLASS } from "../../constants/styles";

export function CVEdit() {
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

  const rename = useMutation({
    mutationFn: (nextTitle: string) => DocumentsApi.rename(id!, nextTitle),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.documents.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.documents.detail(id ?? ""),
      });
      navigate(`/documents/cv/${id}`);
    },
    onError: () =>
      useToastStore.getState().addToast("L'enregistrement a échoué", "error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = title.trim();
    if (!next || rename.isPending) return;
    rename.mutate(next);
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate(`/documents/cv/${id}`)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          Retour à l'aperçu
        </button>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Pencil size={18} />
              </div>
              <h1 className="text-lg font-semibold">Modifier le CV</h1>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  Titre
                </span>
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
                className="btn btn-primary mt-2"
              >
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
