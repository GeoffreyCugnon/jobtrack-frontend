export interface EntretienItem {
  id: number;
  company: string;
  role: string;
  date: string;
  mode: "visio" | "presentiel";
  location?: string;
  visioLink?: string;
}

export const entretienItems: EntretienItem[] = [
  {
    id: 1,
    company: "TechCorp",
    role: "Entretien RH",
    date: "Demain 14h",
    mode: "visio",
    visioLink: "https://meet.example.com/techcorp-rh",
  },
  {
    id: 2,
    company: "InnovA",
    role: "Entretien technique",
    date: "Vendredi 10h",
    mode: "presentiel",
    location: "12 rue de la Tech, 06560 Sophia Antipolis",
  },
  {
    id: 3,
    company: "StartUp Sophia",
    role: "Entretien final",
    date: "Lundi 9h",
    mode: "visio",
    visioLink: "https://meet.example.com/sophia-final",
  },
];
