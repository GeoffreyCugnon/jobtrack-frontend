import { useSearchParams } from "react-router";
import { Header } from "../../components/Layout/Header";
import { AuthLogo } from "../../components/Auth/AuthLogo";
import PublicationCard from "../../components/Publications/PublicationCard";

import publications from "../../data/publications";

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

  const visiblePublications = query
    ? publications.filter(
        (publication) =>
          publication.author.toLowerCase().includes(query) ||
          publication.description.toLowerCase().includes(query) ||
          publication.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    : publications;

  return (
    <div className="bg-base-200 h-screen flex justify-center">
      <div className="w-full max-w-md bg-base-100 flex flex-col">
        <Header search="feed" />

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {showLogo && <AuthLogo size="lg" />}

          {visiblePublications.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/60">
              Aucune actu pour «&nbsp;{searchParams.get("q")?.trim()}&nbsp;».
            </p>
          ) : (
            visiblePublications.map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))
          )}
        </main>
      </div>
    </div>
  );
}
