export interface CandidatureItem {
  id: number;
  company: string;
  role: string;
  status: "En attente" | "Entretien prévu";
  appliedDate: string;
}

export const candidatureItems: CandidatureItem[] = [
  {
    id: 1,
    company: "TechCorp",
    role: "Dev Fullstack Jr",
    status: "En attente",
    appliedDate: "12/07/2026",
  },
  {
    id: 2,
    company: "InnovA",
    role: "Concepteur Appli",
    status: "Entretien prévu",
    appliedDate: "08/07/2026",
  },
  {
    id: 3,
    company: "StartUp Sophia",
    role: "Dev React",
    status: "En attente",
    appliedDate: "15/07/2026",
  },
];
