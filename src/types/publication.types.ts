// Publication telle que renvoyée par l'API (`GET publication`), produite côté
// Backend par `publication.service.ts#toDto`.
export interface Publication {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatarUrl: string | null;
  title: string;
  content: string;
  imageUrl: string | null;
  type: string;
  createdAt: string;
  timeAgo: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}
