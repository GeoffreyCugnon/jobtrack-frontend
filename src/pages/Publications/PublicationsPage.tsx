import Header from "../../components/layout/Header";
import TrendingTopics from "../../components/trending/TrendingTopics";
import BottomNavbar from "../../components/layout/BottomNavbar";
import PublicationCard from "../../components/publication/PublicationCard";

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

        <BottomNavbar />
      </div>
    </div>
  );
}
