import { Header } from "../../components/Layout/Header";
import TrendingTopics from "../../components/Trending/TrendingTopics";
import PublicationCard from "../../components/Publication/PublicationCard";

import publications from "../../data/publications";

export default function PublicationsPage() {
  return (
    <div className="bg-base-200 h-screen flex justify-center">
      <div className="w-full max-w-md bg-base-100 flex flex-col">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <TrendingTopics />

          {publications.map((publication) => (
            <PublicationCard key={publication.id} publication={publication} />
          ))}
        </main>
      </div>
    </div>
  );
}
