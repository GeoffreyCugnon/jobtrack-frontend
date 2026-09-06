import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileQuestion, RotateCw, Send } from "lucide-react";
import { Header } from "../../components/Layout/Header";
import { EmptyState } from "../../components/Layout/EmptyState";
import PublicationCard from "../../components/Publications/PublicationCard";
import { PublicationsApi } from "../../api/publications.api";
import { queryKeys } from "../../api/query-keys";
import {
  publicationComments,
  type PublicationComment,
} from "../../data/publicationComments";
import { INPUT_CLASS } from "../../constants/styles";

export function PublicationDetail() {
  const { id } = useParams();
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

  // Fil de commentaires local (mock) : le `POST /comment` n'est pas branché,
  // on repart du jeu de démo à chaque publication chargée.
  const [comments, setComments] = useState<PublicationComment[]>([]);
  useEffect(() => {
    setComments(publication ? (publicationComments[publication.id] ?? []) : []);
  }, [publication]);

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
    if (!text) return;
    // TODO: brancher sur POST /comment
    setComments((prev) => [
      ...prev,
      { id: Date.now(), author: "Vous", text, time: "À l'instant" },
    ]);
    setDraft("");
  };

  return shell(
    <>
      <div className="overflow-hidden rounded-box border border-base-200">
        <PublicationCard publication={publication} linkToDetail={false} />
      </div>

      <section className="mt-4 space-y-3">
        <h2 className="text-sm font-semibold text-base-content/70">
          Commentaires ({comments.length})
        </h2>

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
            disabled={!draft.trim()}
            className="btn btn-primary btn-square"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

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
