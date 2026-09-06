export interface PublicationComment {
  id: number;
  author: string;
  text: string;
  time: string;
}

// Commentaires mock par id de publication, en attendant `GET /comment`.
export const publicationComments: Record<number, PublicationComment[]> = {
  1: [
    {
      id: 1,
      author: "Marie Lefèvre",
      text: "Le poste a l'air top, télétravail partiel c'est un vrai plus.",
      time: "Il y a 1h",
    },
    {
      id: 2,
      author: "Karim B.",
      text: "Vous avez une fourchette de salaire pour ce poste ?",
      time: "Il y a 40 min",
    },
  ],
  2: [
    {
      id: 1,
      author: "Thomas R.",
      text: "Pas étonné pour React, l'écosystème reste très solide.",
      time: "Il y a 3h",
    },
  ],
};
