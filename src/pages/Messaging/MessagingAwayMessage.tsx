import { CalendarDots } from "@phosphor-icons/react";
import { ComingSoonPage } from "../../components/Layout/ComingSoonPage";

export function MessagingAwayMessage() {
  return (
    <ComingSoonPage
      title="Message d'absence"
      description="Signalez votre indisponibilité aux recruteurs qui vous contactent"
      icon={CalendarDots}
    />
  );
}
