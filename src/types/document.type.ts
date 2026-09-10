// Document (CV / lettre) tel que renvoyé par l'API (`GET /document`), produit
// côté Backend par `document.service.ts#toDto`.
export type DocumentType = "CV" | "LETTRE" | "DIPLOME";

export interface DocumentItem {
  id: number;
  title: string;
  type: DocumentType;
  /** Onglet Front : "cv" | "letters". */
  basePath: "cv" | "letters";
  /** Date de dernière modif déjà formatée (`jj/mm/aaaa`). */
  updatedAt: string;
  updatedAtISO: string;
}
