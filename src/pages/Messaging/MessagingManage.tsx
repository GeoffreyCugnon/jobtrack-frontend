import { ListChecks } from "@/lib/icons";
import { ComingSoonPage } from "../../components/Layout/ComingSoonPage";

export function MessagingManage() {
  return (
    <ComingSoonPage
      title="Gérer les conversations"
      description="Archivage et suppression multiple des conversations"
      icon={ListChecks}
    />
  );
}
