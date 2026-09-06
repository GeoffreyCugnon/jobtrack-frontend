import { useContext } from "react";
import { MessagingContext } from "./messagingContextInstance";

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (!context)
    throw new Error("useMessaging must be used within a MessagingProvider");
  return context;
}

/**
 * Variante non bloquante : renvoie `undefined` hors d'un `MessagingProvider`
 * au lieu de lever. Pour les composants transverses (ex. `Header` /
 * `GlobalSearch`) susceptibles d'être montés isolément (tests, previews).
 */
export function useMessagingOptional() {
  return useContext(MessagingContext);
}
