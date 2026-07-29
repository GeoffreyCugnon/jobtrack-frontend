export interface DocumentItem {
  id: string;
  title: string;
  updatedAt: string;
}

export const cvItems: DocumentItem[] = [
  { id: "cv-1", title: "Cv principal-Concepteur Jr", updatedAt: "25/06/2026" },
  { id: "cv-2", title: "Cv Anglais-Fullstack", updatedAt: "12/04/2026" },
];

export const letterItems: DocumentItem[] = [
  {
    id: "letter-1",
    title: "Lettre Motivation Générique",
    updatedAt: "15/05/2026",
  },
  { id: "letter-2", title: "Lettre Tech Startup", updatedAt: "10/05/2026" },
];
