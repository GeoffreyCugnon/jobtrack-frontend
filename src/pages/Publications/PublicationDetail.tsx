import { useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, FileQuestion, Send } from "lucide-react";
import { Header } from "../../components/Layout/Header";
import { EmptyState } from "../../components/Layout/EmptyState";
import PublicationCard from "../../components/Publications/PublicationCard";
import publications from "../../data/publications";
import {
  publicationComments,
  type PublicationComment,
} from "../../data/publicationComments";
import { INPUT_CLASS } from "../../constants/styles";

export function PublicationDetail() {
  const { id } = useParams();
  const publication = publications.find((p) => String(p.id) === id);

  const [comments, setComments] = useState<PublicationComment[]>(
    () => (publication ? (publicationComments[publication.id] ?? []) : []),
  );
  const [draft, setDraft] = useState("");

  const shell = (children: React.ReactNode) => (
    <div className="bg-base-200 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-base-100 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <Link
            to="/publications"
            className="flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
          >
            <ArrowLeft size={16} />
            Retour aux actus
          </Link>
          {children}
        </main>
      </div>
    </div>
  );

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
      <PublicationCard publication={publication} linkToDetail={false} />

      <section className="space-y-3">
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
