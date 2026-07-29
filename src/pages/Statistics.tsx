import { BarChart3, Construction } from "lucide-react";
import { EmptyState } from "../components/Layout/EmptyState";
import { Header } from "../components/Layout/Header";
import { PageContainer } from "../components/Layout/PageContainer";
import { PageTitle } from "../components/Layout/PageTitle";

export function Statistics() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Statistiques"
          description="Suivez la progression de votre recherche d'emploi"
          icon={BarChart3}
        />
        <EmptyState
          icon={Construction}
          message="Cette section arrive bientôt !"
        />
      </PageContainer>
    </div>
  );
}
