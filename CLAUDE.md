# JobTrack — Frontend

Application mobile-first de CRM de recherche d'emploi ("Mon CRM Emploi"). Ce repo est le frontend ; le backend (`../Backend`) est un repo Git **séparé** (NestJS + Prisma), pas un monorepo.

Projet initialement développé à deux, repris en solo par Jeff. En l'absence de relecteur, privilégier des vérifications explicites (lint/build/tests) avant de considérer une tâche terminée plutôt que de compter sur une revue humaine.

## Stack

- React 19, TypeScript ~5.8, Vite 7
- TailwindCSS v4 (`@tailwindcss/vite`) + DaisyUI v5 — thèmes custom `moncrm-dark` / `moncrm-light` définis dans `src/index.css` (pas les thèmes DaisyUI par défaut, `themes: false`)
- React Router v8 (package `react-router` unifié, pas `react-router-dom`)
- Zustand — stores dans `src/store` (`auth.store.ts`, `toast.store.ts`)
- TanStack React Query + axios (`src/utils/axios-client.ts`) pour les appels API
- Zod + react-hook-form + `@hookform/resolvers` pour les formulaires (schémas dans `src/schemas`)
- Lucide React pour les icônes
- Cypress pour les tests e2e/composants

## Architecture & conventions

- Toutes les pages applicatives sont sous `/app`, montées via `pages/Root.tsx` (layout avec `Header`, `SideMenu`, `MessagingPanel`, nav du bas). `Home.tsx` (public, `/`) et `AuthPage.tsx` (public, `/auth`) sont les seules pages hors layout `/app`.
- Dossiers de composants en **PascalCase** (`Dashboard`, `Profile`, `SideMenu`...) ; dossiers utilitaires en lowercase (`constants`, `context`, `schemas`, `services`, `store`, `types`, `utils`). `index.tsx` toujours en minuscule. Ces renommages ont déjà été faits une fois (voir historique Git) — ne pas réintroduire de fichiers en camelCase/lowercase par erreur.
- Les contextes React (`Menu`, `Messaging`, `Theme`) suivent un pattern à 3 fichiers (instance / Provider / hook) pour éviter les conflits de Fast Refresh — reproduire ce pattern pour tout nouveau contexte plutôt qu'un fichier unique.
- Deux conventions de layout coexistent, ne pas les confondre :
  - Pages "liste" : `PageContainer` (`max-w-5xl mx-auto px-4`) + `PageTitle` + `SectionCard`, référence = `src/pages/Dashboard/Dashboard.tsx`.
  - Sous-pages formulaire/détail (`SettingsPassword`, `ProfileEdit`, `CVEdit`...) : conteneur `max-w-2xl`, bouton "Retour", card unique, `<h1>` custom.
- Classes DaisyUI répétées dans les formulaires sont centralisées dans `src/constants/styles.ts` (`INPUT_CLASS`, `TEXTAREA_CLASS`, `BTN_FOCUS_RING`) — les réutiliser plutôt que retaper les combos de classes.
- Tokens DaisyUI uniquement pour la couleur (`base-100/200/300`, `primary`, `error`, `success`...), jamais de couleur Tailwind brute (`text-gray-500`...) — ça casse le rendu dark/light.

## Authentification & état guest/connecté (nouveau)

Un vrai flux d'auth relié au backend a été mis en place :

- `pages/AuthPage.tsx` (route `/auth`, hors layout `/app`) bascule entre `LoginForm`, `SignupForm` et `RecoveryPasswordForm` (composants dans `src/components/Auth/`).
- `api/auth.api.ts` (`AuthApi`) : `register`, `login`, `refresh`, `forgotPassword` (statiques) et `logout` (méthode d'instance). `login`/`register`/`forgotPassword` passent par le client axios partagé ; `refresh` fait un appel axios brut avec `withCredentials: true` (cookie httpOnly, cf. Backend).
- `store/auth.store.ts` (Zustand, `useAuthStore`) : `user`, `accessToken`, `isAuthenticated` (dérivé automatiquement à `!!token` dans `setAccessToken`), `clearAuth()`.
- `utils/axios-client.ts` : intercepteur de requête qui injecte `Authorization: Bearer <accessToken>` depuis le store ; intercepteur de réponse qui (a) affiche un toast et retente plus tard sur un `429` (lit `retry-after`), et (b) sur un `401`, tente un `AuthApi.refresh()` silencieux puis rejoue la requête originale (garde `_retry` pour éviter la boucle infinie) — si le refresh échoue, `clearAuth()` puis redirection dure.
- La nav principale change selon l'auth : `constants/nav.ts` expose `getMainNavItems(isAuthenticated)` (`MAIN_NAV_ITEMS` avec "Réseau" en plus vs `GUEST_NAV_ITEMS`), utilisé par `Header.tsx` (desktop) et `Root.tsx` (nav mobile en bas). `Header.tsx` affiche un bouton "Connexion" vers `/auth` si déconnecté, sinon un lien vers `/app/profile`.
- `Root.tsx` a une notion de "guest home view" : si non authentifié et sur `/app` ou `/app/dashboard`, affiche `Publications` à la place de l'`Outlet` (aperçu public réutilisant le layout `/app`). `MessagingFab` n'apparaît que si authentifié.
- `SideMenu.tsx` : `handleLogout` (appelle `AuthApi.logout()` puis, succès ou échec, `clearAuth()` + toast + `/auth`) ; le `MenuHeader` affiche l'identité réelle via `useAuthStore().user` (nom = `first_name last_name`, initiales dérivées, email), avec un repli « Invité » / `?` quand personne n'est connecté (le menu reste ouvrable pour un guest, il porte le bouton de fermeture).
- `RecoveryPasswordForm.onSubmit` appelle `AuthApi.forgotPassword(email)` (pattern Zod + react-hook-form + toast, comme `LoginForm`/`SignupForm`), affiche un message générique puis revient à la connexion. Côté Backend : `POST /auth/forgot-password` (voir `Backend/CLAUDE.md`). **Limitation** : aucun service d'email n'est configuré — le lien de réinitialisation est écrit dans les logs serveur en dev, et il n'existe pas encore de page front « saisir le nouveau mot de passe » (l'endpoint `POST /auth/reset-password` existe mais n'est utilisable qu'en direct pour l'instant).

**Corrigé depuis le premier audit :** redirect d'échec de refresh (`axios-client.ts`) vers `/auth` (plus `/login`) ; `SignupForm` enchaîne `register` → `login` → `setUser`/`setAccessToken` → toast → `/app/dashboard` ; `POST /auth/logout` existe côté Backend, `AuthApi.logout()` n'est plus un appel mort ; `SideMenu` n'utilise plus le mock `data/currentUser.ts` ; `RecoveryPasswordForm` est branché.

## Offres — intégration API réelle (nouveau)

`pages/Offers.tsx` charge maintenant les offres via `OffersApi.getAll()` (`GET job-offering`, tolérant à une réponse `Offer[]` ou `{ offers: [...] }`) dans un `useEffect`, avec un état `loading`. Le filtrage par catégorie, la recherche texte et le tri (par `postedHoursAgo` croissant) restent 100% côté client sur le résultat déjà chargé. `data/offerCategories.ts` ne contient plus que les métadonnées de catégories (label/icône/couleur) affichées par `OfferCategorySelector`/`OfferCategoryBanner`.

Le type d'une offre est **unique** : `src/types/offer.type.ts` (`Offer`). Il était dupliqué à l'identique dans `api/offers.api.ts` (`OfferApiItem`), `data/offerCategories.ts` (`CategoryOffer`, jamais importé) et `components/Offers/OfferList.tsx` — ces copies ont été remplacées par un import de `Offer`. `OffersApi` réexporte `Offer` par commodité.

## Skill existante à réutiliser

`.claude/skills/design-audit/SKILL.md` contient déjà un audit détaillé des patterns UI du Dashboard (cards cliquables, badges, empty states, liens "voir tout", tokens de thème). L'invoquer pour toute demande d'harmonisation ou de cohérence visuelle entre pages plutôt que de redériver les règles ici — ce fichier `CLAUDE.md` ne les duplique pas volontairement.

## Tests & build — piège Windows/Electron

Cypress **doit** être lancé via les scripts npm (`npm run cy:open`, `npm run cy:run`, `npm run cy:component`), jamais via `npx cypress` directement : ces scripts passent par `scripts/run-cypress.cjs`, qui supprime `ELECTRON_RUN_AS_NODE` de l'environnement. Sans ça, Cypress se comporte mal car il détecte juste la *présence* de cette variable (peu importe sa valeur), ce qui arrive quand les commandes sont lancées depuis un environnement basé sur Electron.

- `npm run lint`, `tsc -b` (via `npm run build`) doivent passer sans erreur ni warning avant de considérer une tâche terminée.
- Serveur de dev sur `http://localhost:5173` (fallback `5174` si le port est pris) — c'est la `baseUrl` Cypress.

## Workflow Git

Projet solo désormais, plus de suivi par tickets (l'ancienne convention YouTrack `GC/CRM-XX` était liée au projet d'équipe CRM, abandonnée ici).

- Dépôt hébergé sur `gp_assassin-script/jobtrack/frontend` (GitLab self-hosted, `git.alt-tools.tech`) — remote `origin`. L'ancien dépôt d'équipe reste accessible en lecture via le remote `crm`.
- Commits réguliers désormais, plutôt qu'uniquement à des points stables validés — ne pas hésiter à committer souvent en cours de tâche.
- Voir aussi le `CLAUDE.md` à la racine de `JobTrack/` pour le workflow partagé entre les deux repos (lancement de Claude Code, skills/settings communs).

## Préférences de travail

- Éléments pleine largeur, éviter les cards-wrapper qui réduisent l'espace horizontal disponible.
- Réutiliser les composants partagés plutôt que dupliquer de la logique.
- Affordances visuelles permanentes (mobile-first) — jamais d'indice d'interactivité qui dépend uniquement du `:hover`.
- Valider les changements UI par capture d'écran (mobile/desktop × clair/sombre) avant de considérer une page terminée.
- Signaler explicitement les contrastes insuffisants ou excessifs plutôt que de trancher seul.
