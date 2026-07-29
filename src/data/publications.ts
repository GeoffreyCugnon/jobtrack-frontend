import type { Publication } from "../types/publication";

const publications: Publication[] = [
  {
    id: 1,

    author: "TechCorp Recrutement",

    date: "Il y a 2h",

    description:
      "🚀 Nous recherchons activement un Développeur Full Stack Junior pour rejoindre notre équipe innovation à Sophia Antipolis. Contrat CDI, télétravail partiel possible.",

    tags: ["CDI", "Sophia", "Télétravail"],

    likes: 24,

    comments: 8,
  },

  {
    id: 2,

    author: "Veille Tech",

    date: "Il y a 5h",

    description:
      "📊 Tendances 2026 : React reste dominant dans l'écosystème frontend avec 67 % d'adoption. TypeScript continue sa croissance avec 85 % des nouveaux projets.",

    tags: ["Veille", "Tech", "Tendances"],

    likes: 17,

    comments: 5,
  },
];

export default publications;
