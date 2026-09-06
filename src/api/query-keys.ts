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
} as const;
