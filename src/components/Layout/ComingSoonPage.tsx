import { Construction, type LucideIcon } from "lucide-react";
import { Header } from "./Header";
import { PageContainer } from "./PageContainer";
import { PageTitle } from "./PageTitle";
import { EmptyState } from "./EmptyState";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

// Même structure que Network/Posts/Statistics pour les sections pas encore
// construites : header + titre + état vide "arrive bientôt".
export function ComingSoonPage({ title, description, icon }: ComingSoonPageProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle title={title} description={description} icon={icon} />
        <EmptyState icon={Construction} message="Cette section arrive bientôt !" />
      </PageContainer>
    </div>
  );
}
