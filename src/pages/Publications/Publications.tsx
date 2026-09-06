import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { RotateCw } from "lucide-react";
import { Header } from "../../components/Layout/Header";
import { AuthLogo } from "../../components/Auth/AuthLogo";
import PublicationCard from "../../components/Publications/PublicationCard";
import { PublicationsApi } from "../../api/publications.api";
import type { Publication } from "../../types/publication.types";

interface PublicationsProps {
  /**
   * Logo JobTrack en tête du fil : présent sur l'accueil (`/`), absent sur
   * l'onglet "Actus" de l'app (`/publications`) — même composant, deux usages.
   */
  showLogo?: boolean;
}

export function Publications({ showLogo = true }: PublicationsProps) {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const [publications, setPublications] = useState<Publication[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setPublications(await PublicationsApi.getAll());
      setStatus("ready");
    } catch (error) {
      console.error("Failed to load publications", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = query
    ? publications.filter(
        (p) =>
          p.authorName.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query),
      )
    : publications;

  return (
    <div className="flex-1 flex flex-col bg-base-200 pb-6">
      <Header search="feed" />

      {showLogo && (
        <div className="bg-base-100 pt-2">
          <AuthLogo size="lg" />
        </div>
      )}

      {status === "loading" && (
        <p className="p-6 text-center text-sm text-base-content/60">
          Chargement du fil…
        </p>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-3 p-6 text-center">
          <p className="text-sm text-base-content/60">
            Impossible de charger le fil pour le moment.
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="btn btn-sm btn-outline gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      )}

      {status === "ready" && visible.length === 0 && (
        <p className="p-8 text-center text-sm text-base-content/60">
          {query
            ? `Aucune publication pour « ${searchParams.get("q")?.trim()} ».`
            : "Aucune publication pour l'instant."}
        </p>
      )}

      {status === "ready" && visible.length > 0 && (
        <div className="flex flex-col gap-2">
          {visible.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </div>
      )}
    </div>
  );
}
