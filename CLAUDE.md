# JobTrack — Frontend

Application mobile-first de CRM de recherche d'emploi ("Mon CRM Emploi"). Ce repo est le frontend ; le backend (`../Backend`) est un repo Git **séparé** (NestJS + Prisma), pas un monorepo.

Projet initialement développé à deux, repris en solo par Jeff. En l'absence de relecteur, privilégier des vérifications explicites (lint/build/tests) avant de considérer une tâche terminée plutôt que de compter sur une revue humaine.

## Stack

- React 19, TypeScript ~5.8, Vite 7
- TailwindCSS v4 (`@tailwindcss/vite`) + DaisyUI v5 — thèmes custom `moncrm-dark` / `moncrm-light` définis dans `src/index.css` (pas les thèmes DaisyUI par défaut, `themes: false`)
- React Router v8 (package `react-router` unifié, pas `react-router-dom`)
- Zustand — stores dans `src/store` (`auth.store.ts`, `toast.store.ts`)
- TanStack React Query + axios (`src/utils/axios-client.ts`) pour les appels API. **React Query est la couche de fetch des pages API** depuis l'audit v3 (`Network`, `Offers`, `OfferDetail`, `Publications`, `PublicationDetail`, `MemberProfile`) — plus de `useEffect` + `useState` manuels. `QueryClient` configuré dans `main.tsx` (`staleTime` 30 s, pas de `refetchOnWindowFocus`, `retry: 1`). Clés centralisées dans `src/api/query-keys.ts`. Pour une nouvelle page qui charge des données : `useQuery`, pas de fetch à la main. `cy.mount` (`cypress/support/component.ts`) enveloppe déjà un `QueryClientProvider`.
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
- Tokens DaisyUI uniquement pour la couleur (`base-100/200/300`, `primary`, `error`, `success`...), jamais de couleur Tailwind brute (`text-gray-500`...) — ça casse le rendu dark/light. La violation relevée par l'audit v2 (`PublicationCard.tsx`) a été corrigée en `text-base-content/60`.

## Authentification & état guest/connecté (nouveau)

Un vrai flux d'auth relié au backend a été mis en place :

- `pages/AuthPage.tsx` (route `/auth`, hors layout `/app`) bascule entre `LoginForm`, `SignupForm` et `RecoveryPasswordForm` (composants dans `src/components/Auth/`).
- `api/auth.api.ts` (`AuthApi`) : `register`, `login`, `refresh`, `forgotPassword`, `resetPassword`, `logout` — **toutes statiques** (l'ancienne `logout` méthode d'instance a été alignée). `login`/`register`/`forgotPassword`/`resetPassword` passent par le client axios partagé ; `refresh` fait un appel axios brut avec `withCredentials: true` (cookie httpOnly, cf. Backend).
- `api/user.api.ts` (`UserApi`, statique) : `changePassword()` → `PATCH /auth/password`, `deleteAccount()` → `DELETE /user/account` (204). Les deux endpoints sont protégés par `AuthGuard` (token injecté par l'intercepteur axios).
- `utils/user-display.ts` (`getUserDisplay(user)`) : dérive `{ firstName, lastName, name, initials, email }` depuis `useAuthStore().user`, avec replis « Invité » / « ? ». Source unique réutilisée par `SideMenu`, `Dashboard`, `Settings`, `Profile`, `ProfileEdit`, `ProfileContactEdit` — l'ancien mock `data/currentUser.ts` a été supprimé.
- `store/auth.store.ts` (Zustand, `useAuthStore`) : `user`, `accessToken`, `isAuthenticated` (dérivé automatiquement à `!!token` dans `setAccessToken`), `clearAuth()`.
- `utils/axios-client.ts` : intercepteur de requête qui injecte `Authorization: Bearer <accessToken>` depuis le store ; intercepteur de réponse qui (a) affiche un toast et retente plus tard sur un `429` (lit `retry-after`), et (b) sur un `401`, tente un `AuthApi.refresh()` silencieux puis rejoue la requête originale (garde `_retry` pour éviter la boucle infinie) — si le refresh échoue, `clearAuth()` puis redirection dure.
- La nav principale change selon l'auth : `constants/nav.ts` expose `getMainNavItems(isAuthenticated)` (`MAIN_NAV_ITEMS` avec "Réseau" en plus vs `GUEST_NAV_ITEMS`), utilisé par `Header.tsx` (desktop) et `Root.tsx` (nav mobile en bas). `Header.tsx` affiche un bouton "Connexion" vers `/auth` si déconnecté, sinon un lien vers `/app/profile`.
- `Root.tsx` a une notion de "guest home view" : si non authentifié et sur `/app` ou `/app/dashboard`, affiche `Publications` à la place de l'`Outlet` (aperçu public réutilisant le layout `/app`). `MessagingFab` n'apparaît que si authentifié.
- `SideMenu.tsx` : `handleLogout` (appelle `AuthApi.logout()` puis, succès ou échec, `clearAuth()` + toast + `/auth`) ; le `MenuHeader` affiche l'identité réelle via `useAuthStore().user` (nom = `first_name last_name`, initiales dérivées, email), avec un repli « Invité » / `?` quand personne n'est connecté (le menu reste ouvrable pour un guest, il porte le bouton de fermeture).
- `RecoveryPasswordForm.onSubmit` appelle `AuthApi.forgotPassword(email)` (pattern Zod + react-hook-form + toast, comme `LoginForm`/`SignupForm`), affiche un message générique puis revient à la connexion. Côté Backend : `POST /auth/forgot-password` (voir `Backend/CLAUDE.md`).

**Corrigé depuis le premier audit :** redirect d'échec de refresh (`axios-client.ts`) vers `/auth` (plus `/login`) ; `SignupForm` enchaîne `register` → `login` → `setUser`/`setAccessToken` → toast → `/app/dashboard` ; `POST /auth/logout` existe côté Backend, `AuthApi.logout()` n'est plus un appel mort ; `SideMenu` n'utilise plus le mock `data/currentUser.ts` ; `RecoveryPasswordForm` est branché sur `forgotPassword`.

**Traité depuis l'audit v2 (septembre 2026) :**
- **Reset password complet.** Route publique `/auth/reset-password` → `pages/ResetPasswordPage.tsx` (lit `email`/`token` via `useSearchParams`, message d'erreur + retour `/auth` si absents) → `components/Auth/ResetPasswordForm.tsx` (schéma `resetPasswordSchema`, sur le modèle de `changePasswordSchema`) → `AuthApi.resetPassword({ email, token, newPassword })`. Un `400` est traité comme lien invalide/expiré (toast + retour `/auth`).
- **Rollout `useAuthStore` terminé.** `Dashboard`, `Settings`, `Profile`, `ProfileEdit`, `ProfileContactEdit` passent tous par `getUserDisplay(useAuthStore().user)` (voir `utils/user-display.ts`). `data/currentUser.ts` supprimé. Le test `cypress/component/Dashboard.cy.tsx` seed `useAuthStore` avec un utilisateur de test.
- **`SettingsPassword.tsx`** appelle `UserApi.changePassword()` (`PATCH /auth/password`) ; `400` → message « vérifie ton mot de passe actuel », autre erreur → message générique. La modale de succès ne s'affiche plus qu'après réponse OK.
- **`Settings.tsx`** : `handleDeleteAccount` appelle `UserApi.deleteAccount()` (`DELETE /user/account`), puis `clearAuth()` + toast + `/auth` ; état `isDeleting` pendant l'appel.

**Reste un écart de périmètre à trancher (pas un bug) :** `pages/Profile/Profile.tsx` (+ `ProfileEdit`) portent encore des champs fictifs codés en dur (`MOCK_PROFILE_DETAILS` : titre, bio, localisation, réseaux, disponibilité, type de contrat, salaire) — **aucun n'existe sur le modèle `User` côté Backend**. Seuls nom/email/initiales viennent du vrai utilisateur. À décider consciemment : étoffer `User` (ou un modèle profil dédié) côté Backend, ou assumer que ces sections restent une maquette.

## Offres — intégration API réelle (nouveau)

`pages/Offers.tsx` charge les offres via `useQuery` + `OffersApi.getAll()` (`GET job-offering`, tolérant à une réponse `Offer[]` ou `{ offers: [...] }`). Le filtrage par catégorie, la recherche texte et le tri (par `postedHoursAgo` croissant) restent 100% côté client sur le résultat en cache. Le rejet d'une offre passe par un state local `dismissedIds` (le cache React Query reste la source). `data/offerCategories.ts` ne contient plus que les métadonnées de catégories (label/icône/couleur) affichées par `OfferCategorySelector`/`OfferCategoryBanner`.

**Audit v3 — code mort supprimé :** le cluster CRUD `components/Network/{Card,CompanyCard,CompanyForm,CompanyList,ContactCard,ContactForm,ContactsList,RelationsSearchInput}` + `schemas/{company,contact}.schemas.ts` + `types/{company,contact}.types.ts` (jamais montés par aucune page) ont été supprimés. `components/Network/` ne contient plus que `PeopleCard.tsx`.

## Page Réseau — mise en relation

`pages/Network.tsx` : plus d'onglets ni de mention « Premium ». Charge `UserApi.getAll()` (suggestions) + `ConnectionApi.list()` (`GET /connection` → `{ connections, incoming, outgoing }`).

- `api/connection.api.ts` : `ConnectionApi.{list,request,accept,remove}` + `connectionStatusByUser(list)` → `Map<userId, "none"|"pending_out"|"pending_in"|"connected">`. Clé RQ `queryKeys.connections.all`.
- Les mutations (`useMutation`) invalident `queryKeys.connections.all` au succès + toast.
- Section « Invitations reçues » en tête quand `incoming.length > 0` (Accepter / Ignorer).
- Les cartes de suggestion (`PeopleCard`, props `actionLabel` / `actionDisabled`) reflètent l'état ; les personnes déjà en relation ou en attente de ma réponse sont exclues du pool de suggestions.
- `pages/MemberProfile.tsx` : bouton « Se connecter » branché sur la même logique.

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
