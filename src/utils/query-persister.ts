import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import type { Persister } from "@tanstack/react-query-persist-client";
import type { Query } from "@tanstack/react-query";
import { get, set, del } from "idb-keyval";
import { queryKeys } from "@/api/query-keys";

/**
 * Persistance du cache React Query sur IndexedDB (idb-keyval) : réaffiche
 * l'état précédent instantanément après un cold-boot mobile (onglet tué en
 * arrière-plan par l'OS) pendant qu'un refetch silencieux a lieu en fond.
 * Clé IndexedDB dédiée (`jobtrack-query-cache`) — n'entre pas en collision
 * avec les usages `localStorage` existants (`theme`, `jt_session`,
 * `jobtrack-saved-offers`), stockage différent de toute façon.
 */
export const queryPersister: Persister = createAsyncStoragePersister({
  key: "jobtrack-query-cache",
  storage: {
    getItem: async (key) => (await get(key)) ?? null,
    setItem: async (key, value) => {
      await set(key, value);
    },
    removeItem: async (key) => {
      await del(key);
    },
  },
});

/** Un cache persistant plus vieux que ça est ignoré au lieu d'être réhydraté. */
export const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24; // 24h

/**
 * La messagerie ne doit jamais toucher le disque. Comparaison sur le premier
 * segment de la clé (`queryKeys.messaging.*` vaut `["messaging", ...]`)
 * plutôt qu'un `includes` sur une string, pour rester fiable si une autre clé
 * venait à contenir le mot "messaging" ailleurs qu'en tête.
 *
 * `status === "success"` reprend le filtre par défaut de React Query
 * (`defaultShouldDehydrateQuery`), qu'on écrase sinon entièrement en
 * fournissant `shouldDehydrateQuery` : une query encore `pending` au moment
 * de la sauvegarde embarque sa promesse en vol (`query.promise`), qui devient
 * `{}` après le `JSON.stringify` du persister et fait planter la
 * réhydratation au chargement suivant (`{}.then is not a function`).
 */
export function shouldDehydrateQuery(query: Query): boolean {
  return (
    query.state.status === "success" &&
    query.queryKey[0] !== queryKeys.messaging.conversations[0]
  );
}
