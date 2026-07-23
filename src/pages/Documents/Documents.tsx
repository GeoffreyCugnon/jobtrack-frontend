import { useState } from "react";
import { FileText } from "lucide-react";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { Tabs } from "../../components/Layout/Tabs";
import { CVList } from "../../components/Documents/CV";
import { LetterList } from "../../components/Documents/Letter";
import { cvItems, letterItems } from "../../data/documents";

export function Documents() {
  const [activeTab, setActiveTab] = useState<"cv" | "letters">("cv");

  return (
    <>
      <Header />

      <PageContainer className="py-3 space-y-3">
        <PageTitle title="Documents" icon={FileText} />

        <Tabs<"cv" | "letters">
          items={[
            { key: "cv", label: "CV" },
            { key: "letters", label: "Lettres" },
          ]}
          value={activeTab}
          onChange={setActiveTab}
          variant="onPage"
        />

        {activeTab === "cv" ? (
          <CVList items={cvItems} />
        ) : (
          <LetterList items={letterItems} />
        )}
      </PageContainer>
    </>
  );
}
