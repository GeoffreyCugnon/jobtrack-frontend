import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "@phosphor-icons/react";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { Tabs } from "../../components/Layout/Tabs";
import { DocumentList } from "../../components/Documents/DocumentList";
import { DocumentsApi } from "../../api/documents.api";
import { queryKeys } from "../../api/query-keys";

export function Documents() {
  const [activeTab, setActiveTab] = useState<"cv" | "letters">("cv");

  const {
    data: documents = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKeys.documents.all,
    queryFn: () => DocumentsApi.list(),
  });

  const items = documents.filter((doc) => doc.basePath === activeTab);

  return (
    <div className="flex-1 flex flex-col">
      <Header />

      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <div className="flex-1 flex flex-col">
          <div className="-mx-4 sm:mx-0 flex-1 flex flex-col">
            <div className="rounded-none sm:rounded-box overflow-hidden">
              <div className="bg-base-200 shadow-sm px-4 py-3">
                <Tabs<"cv" | "letters">
                  items={[
                    { key: "cv", label: "CV" },
                    { key: "letters", label: "Lettres" },
                  ]}
                  value={activeTab}
                  onChange={setActiveTab}
                  variant="onMuted"
                />
              </div>
              <div className="bg-base-100 border-t border-base-200 p-4">
                {isPending ? (
                  <p className="text-sm text-base-content/60">Chargement…</p>
                ) : isError ? (
                  <EmptyState
                    icon={FileText}
                    message="Impossible de charger vos documents pour le moment."
                  />
                ) : items.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    message={
                      activeTab === "cv"
                        ? "Aucun CV pour l'instant, créez le premier !"
                        : "Aucune lettre pour l'instant, créez la première !"
                    }
                  />
                ) : (
                  <div className="-m-4">
                    <DocumentList items={items} basePath={activeTab} />
                  </div>
                )}
              </div>
            </div>

            {/* Même filler que sur Offers/Dashboard, mobile uniquement. */}
            <div className="flex-1 bg-base-100 sm:hidden" />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
