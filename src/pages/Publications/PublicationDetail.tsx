import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileQuestion, RotateCw, Send } from "@/lib/icons";
import { Header } from "../../components/Layout/Header";
import { EmptyState } from "../../components/Layout/EmptyState";
import PublicationCard from "../../components/Publications/PublicationCard";
import { PublicationsApi } from "../../api/publications.api";
import { CommentsApi } from "../../api/comments.api";
import { queryKeys } from "../../api/query-keys";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import { INPUT_CLASS } from "../../constants/styles";

export function PublicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [draft, setDraft] = useState("");

  const {
    data: publication,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.publications.detail(id ?? ""),
    queryFn: () => PublicationsApi.getById(id!),
    enabled: !!id,
  });

  const { data: comments = [] } = useQuery({
    queryKey: queryKeys.comments.byPublication(publication?.id ?? ""),
    queryFn: () => CommentsApi.listByPublication(publication!.id),
    enabled: !!publication,
  });

  const addComment = useMutation({
    mutationFn: (content: string) =>
      CommentsApi.create({ publicationId: publication!.id, content }),
    onSuccess: () => {
      setDraft("");
      void queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byPublication(publication!.id),
      });
    },
    onError: () =>
      useToastStore
        .getState()
        .addToast("Échec de l'envoi du commentaire", "error"),
  });

  const shell = (children: React.ReactNode) => (
    <div className="flex-1 flex flex-col bg-base-200 pb-6">
      <Header />
      <div className="p-4">
        <Link
          to="/publications"
          className="mb-3 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          Retour aux actus
        </Link>
        {children}
      </div>
    </div>
  );

  if (isPending) {
    return shell(
      <p className="p-6 text-center text-sm text-base-content/60">
        Chargement…
      </p>,
    );
  }

  if (isError) {
    return shell(
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-sm text-base-content/60">
          Impossible de charger cette publication.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="btn btn-sm btn-outline gap-2"
        >
          <RotateCw className="h-4 w-4" />
          Réessayer
        </button>
      </div>,
    );
  }

  if (!publication) {
    return shell(
      <EmptyState
        icon={FileQuestion}
        message="Cette publication n'existe pas ou plus."
      />,
    );
  }

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || addComment.isPending) return;
    addComment.mutate(text);
  };

  return shell(
    <>
      <div className="overflow-hidden rounded-box border border-base-200">
        <PublicationCard
          publication={publication}
          linkToDetail={false}
          onHide={() => navigate("/publications")}
        />
      </div>

      <section className="mt-4 space-y-3">
        <h2 className="text-sm font-semibold text-base-content/70">
          Commentaires ({comments.length})
        </h2>

        {isAuthenticated ? (
          <form onSubmit={submitComment} className="flex items-start gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Écrire un commentaire..."
              className={INPUT_CLASS}
            />
            <button
              type="submit"
              aria-label="Publier le commentaire"
              disabled={!draft.trim() || addComment.isPending}
              className="btn btn-primary btn-square"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <p className="rounded-box border border-base-200 bg-base-100 p-3 text-sm text-base-content/60">
            <Link to="/auth" className="link link-primary">
              Connectez-vous
            </Link>{" "}
            pour laisser un commentaire.
          </p>
        )}

        {comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-base-content/50">
            Aucun commentaire pour l'instant. Soyez le premier à réagir.
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="rounded-box border border-base-200 bg-base-100 p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{comment.author}</span>
                  <span className="text-xs text-base-content/50">
                    {comment.time}
                  </span>
                </div>
                <p className="mt-1 text-sm text-base-content/80">
                  {comment.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>,
  );
}
