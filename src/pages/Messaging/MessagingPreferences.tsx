import { SlidersHorizontal } from "lucide-react";
import { ComingSoonPage } from "../../components/Layout/ComingSoonPage";

export function MessagingPreferences() {
  return (
    <ComingSoonPage
      title="Préférences de messagerie"
      description="Notifications et paramètres liés à la messagerie"
      icon={SlidersHorizontal}
    />
  );
}
