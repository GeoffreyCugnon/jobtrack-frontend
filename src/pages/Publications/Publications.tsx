import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowClockwise } from "@phosphor-icons/react";
import { Header } from "../../components/Layout/Header";
import PublicationCard from "../../components/Publications/PublicationCard";
import { PublicationsApi } from "../../api/publications.api";
import { queryKeys } from "../../api/query-keys";

export function Publications() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const {
    data: publications = [],
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.publications.all,
    queryFn: () => PublicationsApi.getAll(),
  });

  const visible = query
    ? publications.filter(
        (p) =>
          p.authorName.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query),
      )
    : publications;

  return (
    <div className="flex-1 flex flex-col bg-base-100 pb-6">
      <Header search="feed" />

      {isPending && (
        <p className="p-6 text-center text-sm text-base-content/60">
          Chargement du fil…
        </p>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <p className="text-sm text-base-content/60">
            Impossible de charger le fil pour le moment.
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
      )}

      {!isPending && !isError && visible.length === 0 && (
        <p className="p-8 text-center text-sm text-base-content/60">
          {query
            ? `Aucune publication pour « ${searchParams.get("q")?.trim()} ».`
            : "Aucune publication pour l'instant."}
        </p>
      )}

      {!isPending && !isError && visible.length > 0 && (
        <div className="divide-y divide-base-200">
          {visible.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </div>
      )}
    </div>
  );
}
