import { useState } from "react";
import { FileText } from "@/lib/icons";
import { EmptyState } from "../../components/Layout/EmptyState";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { Tabs } from "../../components/Layout/Tabs";
import { DocumentList } from "../../components/Documents/DocumentList";
import { cvItems, letterItems } from "../../data/documents";

export function Documents() {
  const [activeTab, setActiveTab] = useState<"cv" | "letters">("cv");
  const items = activeTab === "cv" ? cvItems : letterItems;

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
                {items.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    message={
                      activeTab === "cv"
                        ? "Aucun CV pour l'instant, créez le premier !"
                        : "Aucune lettre pour l'instant, créez la première !"
                    }
                  />
                ) : activeTab === "cv" ? (
                  <div className="-m-4">
                    <DocumentList items={cvItems} basePath="cv" />
                  </div>
                ) : (
                  <div className="-m-4">
                    <DocumentList items={letterItems} basePath="letters" />
                  </div>
                )}
              </div>
            </div>

            {/* Même filler que sur Offers/Dashboard, mobile uniquement : au
                delà de sm, la carte garde ses coins arrondis (rounded-box)
                et un filler plein-largeur juste en dessous casserait cet
                arrondi avec un bord droit collé dessus. */}
            <div className="flex-1 bg-base-100 sm:hidden" />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
