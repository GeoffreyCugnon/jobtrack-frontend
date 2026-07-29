import { Users, Construction } from "lucide-react";
import { EmptyState } from "../components/Layout/EmptyState";
import { Header } from "../components/Layout/Header";
import { PageContainer } from "../components/Layout/PageContainer";
import { PageTitle } from "../components/Layout/PageTitle";

export function Network() {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Réseau"
          description="Vos contacts et relations professionnelles"
          icon={Users}
        />
        <EmptyState
          icon={Construction}
          message="Cette section arrive bientôt !"
        />
      </PageContainer>
    </div>
  );
}
