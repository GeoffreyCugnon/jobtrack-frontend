# JobTrack — Frontend

Application mobile-first de CRM de recherche d'emploi : suivi des candidatures, entretiens, documents, offres d'emploi, réseau professionnel et messagerie.

Ce repo est le frontend. Il consomme deux services indépendants :
- **Backend** (`../Backend`, NestJS + Prisma/MySQL) — API principale (auth, offres, candidatures, entreprises, réseau…).
- **MS-Messagerie** (`../Microservices/messagerie`, NestJS + Prisma/PostgreSQL + Socket.IO) — messagerie temps réel, contactée directement par le Frontend avec un jeton dédié fourni par le Backend.

## Stack

- React 19, TypeScript ~5.8, Vite 7
- TailwindCSS v4 + DaisyUI v5 (thèmes custom `moncrm-dark` / `moncrm-light`)
- React Router v8 (`react-router`)
- Zustand (état global : auth, toasts, offres sauvegardées)
- TanStack React Query + axios (couche de fetch de toutes les pages qui chargent des données API)
- Zod + react-hook-form pour les formulaires
- Phosphor Icons
- Cypress (tests e2e et composants)

## Prérequis

- Node.js LTS
- Le Backend (`../Backend`) lancé en local pour des réponses API réelles
- Optionnel : MS-Messagerie (`../Microservices/messagerie`) pour la messagerie

## Installation & lancement

```bash
npm install
npm run dev
```

Serveur de dev sur `http://localhost:5173` (fallback `5174` si le port est pris).

Variables d'environnement attendues (`.env`) : notamment `VITE_MESSAGING_API_URL` (URL de MS-Messagerie).

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — `tsc -b` puis build Vite
- `npm run lint` — ESLint
- `npm run preview` — prévisualisation du build de production
- `npm run cy:open` / `cy:run` / `cy:component` / `cy:component:run` — Cypress (e2e / composants). **Toujours passer par ces scripts npm**, jamais `npx cypress` directement : ils suppriment `ELECTRON_RUN_AS_NODE` de l'environnement, nécessaire pour que Cypress fonctionne correctement quand les commandes sont lancées depuis un environnement basé sur Electron (VS Code, etc.).

`npm run lint` et `npm run build` doivent passer sans erreur ni warning avant de considérer une tâche terminée.

## Organisation du code

- `src/pages/` — pages applicatives (Dashboard, Offers, Publications, Company, Profile, Settings, Network, Documents…), montées via `pages/Root.tsx`
- `src/components/` — composants partagés, dossiers en PascalCase
- `src/store/` — stores Zustand (`auth.store.ts`, `toast.store.ts`, `saved-offers.store.ts`)
- `src/api/` — appels API (axios + React Query), clés de cache dans `api/query-keys.ts`
- `src/schemas/` — schémas Zod des formulaires
- `src/services/messaging-client.ts` — seul point d'accès à MS-Messagerie
- `src/context/` — contextes React (Menu, Messaging, Theme)

## Projet

Projet solo (Jeff), repris après un développement initial à deux. Plus de suivi par tickets — commits réguliers.

Pour les conventions détaillées (architecture, patterns UI, points d'attention, historique des choix techniques), voir [`CLAUDE.md`](./CLAUDE.md) et [`JobTrack/CLAUDE.md`](../CLAUDE.md) (workflow partagé avec le Backend).
