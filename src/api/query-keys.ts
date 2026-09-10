/**
 * Fabrique de clés React Query — une seule source pour les `queryKey`, afin de
 * pouvoir invalider proprement (`queryClient.invalidateQueries`) quand des
 * mutations seront branchées (postuler, commenter, se connecter à un membre…).
 */
export const queryKeys = {
  offers: {
    all: ["offers"] as const,
    detail: (id: string | number) => ["offers", "detail", String(id)] as const,
  },
  publications: {
    all: ["publications"] as const,
    detail: (id: string | number) =>
      ["publications", "detail", String(id)] as const,
  },
  users: {
    all: ["users"] as const,
    detail: (id: string | number) => ["users", "detail", String(id)] as const,
  },
  connections: {
    all: ["connections"] as const,
  },
  applications: {
    all: ["applications"] as const,
    detail: (id: string | number) =>
      ["applications", "detail", String(id)] as const,
  },
  interviews: {
    all: ["interviews"] as const,
    detail: (id: string | number) =>
      ["interviews", "detail", String(id)] as const,
  },
  comments: {
    byPublication: (id: string | number) =>
      ["comments", "publication", String(id)] as const,
  },
  documents: {
    all: ["documents"] as const,
    detail: (id: string | number) =>
      ["documents", "detail", String(id)] as const,
  },
  dashboard: {
    stats: ["dashboard", "stats"] as const,
  },
  messaging: {
    /** Aperçu des conversations de l'utilisateur (liste + badges non lus). */
    conversations: ["messaging", "conversations"] as const,
    /** Fil complet d'une conversation (chargé à l'ouverture). */
    thread: (conversationId: string) =>
      ["messaging", "thread", conversationId] as const,
  },
} as const;
