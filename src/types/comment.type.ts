// Commentaire d'actu tel que renvoyé par l'API (`GET /comment?publicationId=`),
// produit côté Backend par `comment.service.ts#toDto`.
export interface PublicationComment {
  id: number;
  publicationId: number;
  parentCommentId: number | null;
  authorId: number;
  author: string;
  authorAvatarUrl: string | null;
  text: string;
  createdAt: string;
  /** Ancienneté déjà formatée (« Il y a 3 min »). */
  time: string;
}
