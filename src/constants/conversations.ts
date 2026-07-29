// src/constants/conversations.ts
export interface ConversationMessage {
  id: number;
  from: "me" | "them";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  // Logo d'entreprise ou photo réelle, quand disponible ; sinon fallback
  // dégradé + initiale (cf. composant Avatar).
  avatarUrl?: string;
  messages: ConversationMessage[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "techcorp-rh",
    name: "TechCorp RH",
    lastMessage: "On vous recontacte lundi",
    time: "10:32",
    unread: true,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Bonjour, votre candidature a retenu notre attention.",
        time: "09:58",
      },
      {
        id: 2,
        from: "me",
        text: "Merci beaucoup, je reste disponible pour la suite.",
        time: "10:05",
      },
      { id: 3, from: "them", text: "On vous recontacte lundi", time: "10:32" },
    ],
  },
  {
    id: "sophie-martin",
    name: "Sophie Martin",
    lastMessage: "Merci pour l'entretien !",
    time: "Hier",
    unread: true,
    messages: [
      {
        id: 1,
        from: "them",
        text: "Ravie d'avoir échangé avec vous aujourd'hui.",
        time: "Hier, 16:40",
      },
      {
        id: 2,
        from: "them",
        text: "Merci pour l'entretien !",
        time: "Hier, 16:41",
      },
    ],
  },
  {
    id: "lidl-recrutement",
    name: "Lidl Recrutement",
    lastMessage: "Candidature refusée",
    time: "Lundi",
    messages: [
      {
        id: 1,
        from: "them",
        text: "Après étude de votre profil, nous ne donnerons malheureusement pas suite.",
        time: "Lundi",
      },
      { id: 2, from: "them", text: "Candidature refusée", time: "Lundi" },
    ],
  },
];
