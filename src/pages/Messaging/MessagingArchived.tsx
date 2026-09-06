// Adapté depuis "boîte de réception des demandes de messages" (pattern
// LinkedIn) : JobTrack n'a pas de notion de contact tiers/demande de mise en
// relation, toutes les conversations viennent de recruteurs déjà identifiés.
// La page qui a du sens dans ce contexte est plutôt la liste des
// conversations archivées (cf. action "Archiver" sur chaque conversation).
import { Archive } from "@/lib/icons";
import { ComingSoonPage } from "../../components/Layout/ComingSoonPage";

export function MessagingArchived() {
  return (
    <ComingSoonPage
      title="Messages archivés"
      description="Retrouvez les conversations que vous avez archivées"
      icon={Archive}
    />
  );
}
