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
- **Phosphor Icons** (`@phosphor-icons/react`) pour les icônes. Import direct avec les **vrais noms Phosphor** : `import { MagnifyingGlass, ChatCircle, DotsThreeVertical } from "@phosphor-icons/react"` (le shim `src/lib/icons.ts` qui réexportait les noms Lucide historiques a été supprimé). Type d'un composant icône = `Icon` (souvent importé `type Icon as IconType`). Alias `@` → `src` (vite + tsconfig). Poids par défaut = `bold` (`IconContext.Provider` dans `main.tsx`, rendu type LinkedIn) ; passer `weight="regular"` / `"fill"` sur une icône précise au besoin (ex. `weight="fill"` pour le cœur sauvegardé).
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
- La nav principale change selon l'auth : `constants/nav.ts` expose `getMainNavItems(isAuthenticated)` (`MAIN_NAV_ITEMS` avec "Réseau" en plus vs `GUEST_NAV_ITEMS`), utilisé par `Header.tsx` (desktop) et `Root.tsx` (nav mobile en bas). `Header.tsx` affiche un bouton "Connexion" vers `/auth` si déconnecté, sinon un lien vers `/app/profile`. Le bouton clair/sombre (`useTheme`/`toggleTheme`, même hook que `ThemeToggle` du `SideMenu`) est ajouté entre la recherche et "Connexion" côté invité — un visiteur non connecté n'a sinon aucun accès au menu (donc à `ThemeToggle`) pour changer de thème.
- `Root.tsx` a une notion de "guest home view" : si non authentifié et sur `/app` ou `/app/dashboard`, affiche `Publications` à la place de l'`Outlet` (aperçu public réutilisant le layout `/app`). `MessagingFab` n'apparaît que si authentifié.
- `SideMenu.tsx` : `handleLogout` (appelle `AuthApi.logout()` puis, succès ou échec, `clearAuth()` + toast + `/auth`) ; le `MenuHeader` affiche l'identité réelle via `useAuthStore().user` (nom = `first_name last_name`, initiales dérivées, email), avec un repli « Invité » / `?` quand personne n'est connecté (le menu reste ouvrable pour un guest, il porte le bouton de fermeture).
- `RecoveryPasswordForm.onSubmit` appelle `AuthApi.forgotPassword(email)` (pattern Zod + react-hook-form + toast, comme `LoginForm`/`SignupForm`), affiche un message générique puis revient à la connexion. Côté Backend : `POST /auth/forgot-password` (voir `Backend/CLAUDE.md`).

**Corrigé depuis le premier audit :** redirect d'échec de refresh (`axios-client.ts`) vers `/auth` (plus `/login`) ; `SignupForm` enchaîne `register` → `login` → `setUser`/`setAccessToken` → toast → `/app/dashboard` ; `POST /auth/logout` existe côté Backend, `AuthApi.logout()` n'est plus un appel mort ; `SideMenu` n'utilise plus le mock `data/currentUser.ts` ; `RecoveryPasswordForm` est branché sur `forgotPassword`.

**Traité depuis l'audit v2 (septembre 2026) :**
- **Reset password complet.** Route publique `/auth/reset-password` → `pages/ResetPasswordPage.tsx` (lit `email`/`token` via `useSearchParams`, message d'erreur + retour `/auth` si absents) → `components/Auth/ResetPasswordForm.tsx` (schéma `resetPasswordSchema`, sur le modèle de `changePasswordSchema`) → `AuthApi.resetPassword({ email, token, newPassword })`. Un `400` est traité comme lien invalide/expiré (toast + retour `/auth`).
- **Rollout `useAuthStore` terminé.** `Dashboard`, `Settings`, `Profile`, `ProfileEdit`, `ProfileContactEdit` passent tous par `getUserDisplay(useAuthStore().user)` (voir `utils/user-display.ts`). `data/currentUser.ts` supprimé. Le test `cypress/component/Dashboard.cy.tsx` seed `useAuthStore` avec un utilisateur de test.
- **`SettingsPassword.tsx`** appelle `UserApi.changePassword()` (`PATCH /auth/password`) ; `400` → message « vérifie ton mot de passe actuel », autre erreur → message générique. La modale de succès ne s'affiche plus qu'après réponse OK.
- **`Settings.tsx`** : `handleDeleteAccount` appelle `UserApi.deleteAccount()` (`DELETE /user/account`), puis `clearAuth()` + toast + `/auth` ; état `isDeleting` pendant l'appel.

**Audit v4 (septembre 2026) — préférences Settings branchées :** le toggle **Notifications** et le select **Langue** de `Settings.tsx` étaient du `useState` local jamais persisté. Ils sont maintenant pilotés par `useAuthStore().user` et sauvegardés via `UserApi.updateNotifications()` (`PATCH /user/settings/notifications`) / `UserApi.updateLanguage()` (`PATCH /user/settings/language`, codes `fr`/`en`/`es`/`de`). Mise à jour optimiste du store + revert & toast d'erreur si l'appel échoue ; contrôles désactivés pour un invité (`rawUser` nul). Le type `User` (`types/user.type.ts`) porte désormais `notifications_enabled?` et `language?` (déjà renvoyés par le Backend dans le user « safe », le type ne les déclarait pas).

**Reste un écart de périmètre à trancher (pas un bug) :** `pages/Profile/Profile.tsx` (+ `ProfileEdit`) portent encore des champs fictifs codés en dur (`MOCK_PROFILE_DETAILS` : titre, bio, localisation, réseaux, disponibilité, type de contrat, salaire) — **aucun n'existe sur le modèle `User` côté Backend**. Seuls nom/email/initiales viennent du vrai utilisateur. À décider consciemment : étoffer `User` (ou un modèle profil dédié) côté Backend, ou assumer que ces sections restent une maquette.

## Offres — intégration API réelle (nouveau)

`pages/Offers.tsx` charge les offres via `useQuery` + `OffersApi.getAll()` (`GET job-offering`, tolérant à une réponse `Offer[]` ou `{ offers: [...] }`). Le filtrage par catégorie, la recherche texte et le tri (par `postedHoursAgo` croissant) restent 100% côté client sur le résultat en cache. Le rejet d'une offre passe par un state local `dismissedIds` (le cache React Query reste la source).

**Catégories d'offres — poussées en base.** La *donnée* des catégories (label, description, `isWorkMode`) vit maintenant dans la table `Job_category` côté Backend, servie par `GET /job-categories`. Le Front la lit via le hook `hooks/useJobCategories.ts` (React Query, `staleTime` 1 h, clé `queryKeys.jobCategories.all`) — partagé par `OfferFilters`, `Offers` (libellé bannière) et `OfferDetail` (libellé fiche). `data/offerCategories.ts` ne garde plus que ce qui n'est pas stockable en base : `getCategoryStyle(key)` → `{ icon, colorClass }` (composant Phosphor + classe Tailwind brute, exception assumée aux tokens DaisyUI). Fixture Cypress : `cypress/fixtures/job-categories.json` (interceptée dans `Offers.cy.tsx`).

**Offres rattachées à leur entreprise (nouveau).** `Offer` porte désormais `companyId`/`companyLogoUrl` (renvoyés par `toOfferDto`, Backend). `OfferDetail.tsx` : le nom de l'entreprise est un lien vers `/company/:companyId` (route publique, cf. section Entreprise) au lieu d'un simple texte. `OfferCard`/`OfferList` : affichent le vrai logo (`companyLogoUrl`) à la place de l'initiale générique quand il existe. Le bandeau récap sticky en bas de `Offers.tsx` (label de catégorie + toggle d'alerte) est réservé aux utilisateurs connectés — une alerte n'a rien à surveiller pour un invité, et le bandeau bleu permanent n'avait pas lieu d'être pour cette vue.

**Audit v3 — code mort supprimé :** le cluster CRUD `components/Network/{Card,CompanyCard,CompanyForm,CompanyList,ContactCard,ContactForm,ContactsList,RelationsSearchInput}` + `schemas/{company,contact}.schemas.ts` + `types/{company,contact}.types.ts` (jamais montés par aucune page) ont été supprimés. `components/Network/` ne contient plus que `PeopleCard.tsx`.

## Page Réseau — mise en relation

`pages/Network.tsx` : plus d'onglets ni de mention « Premium ». Charge `UserApi.getAll()` (suggestions) + `ConnectionApi.list()` (`GET /connection` → `{ connections, incoming, outgoing }`).

- `api/connection.api.ts` : `ConnectionApi.{list,request,accept,remove}` + `connectionStatusByUser(list)` → `Map<userId, "none"|"pending_out"|"pending_in"|"connected">`. Clé RQ `queryKeys.connections.all`.
- Les mutations (`useMutation`) invalident `queryKeys.connections.all` au succès + toast.
- Section « Invitations reçues » en tête quand `incoming.length > 0` (Accepter / Ignorer).
- Les cartes de suggestion (`PeopleCard`, props `actionLabel` / `actionDisabled`) reflètent l'état ; les personnes déjà en relation ou en attente de ma réponse sont exclues du pool de suggestions.
- `pages/MemberProfile.tsx` : bouton « Se connecter » branché sur la même logique.

Le type d'une offre est **unique** : `src/types/offer.type.ts` (`Offer`). Il était dupliqué à l'identique dans `api/offers.api.ts` (`OfferApiItem`), `data/offerCategories.ts` (`CategoryOffer`, jamais importé) et `components/Offers/OfferList.tsx` — ces copies ont été remplacées par un import de `Offer`. `OffersApi` réexporte `Offer` par commodité.

## Pages Entreprise — multi-entreprises, bannière (nouveau)

`pages/Company/CreateCompany.tsx` (route `/company/create`) — mise en page volontairement différente du pattern `FormPageLayout` habituel : pas de `Header` ni de card, en-tête sticky maison (retour + titre) et champs plein-largeur sans filets entre eux (retirés sur demande), sur design fourni par Jeff à respecter tel quel plutôt qu'à faire rentrer dans le pattern existant.

**Piège layout (résolu) :** le conteneur racine d'une page doit porter `shrink-0` en plus de `min-h-full` quand la page est un enfant direct du conteneur scrollable de `Root.tsx` (`flex-1 flex flex-col overflow-y-auto ... pb-16`). Sans `shrink-0`, un contenu plus long qu'un écran se fait comprimer par le flex parent jusqu'à la valeur de `min-h-full` (qui résout à la hauteur de viewport **moins** le `pb-16` réservé pour la nav mobile fixe) au lieu de grandir pour contenir tout son contenu — le bas de la page (ex. le bouton submit) se retrouve alors visuellement et fonctionnellement sous la nav du bas, même en scrollant à fond. Repéré via un test Playwright (clic intercepté par la nav) plutôt qu'à l'œil.

**Un utilisateur peut gérer plusieurs entreprises** (le Backend ne bloque plus la création d'une seconde, cf. `Backend/CLAUDE.md`) :

- `api/company.api.ts` (`CompanyApi.create()` → `POST /company`, `CompanyApi.getMineAll()` → `GET /company/mine/all`, `CompanyApi.getById()` → `GET /company/:id`, `CompanyApi.update()` → `PATCH /company/:id`) — `create`/`update` protégés par `AuthGuard` (+ vérification de propriété sur `update`) ; `getById`/`getMineAll` lisent des routes publiques ou protégées selon le cas, cf. Backend. `schemas/company.schemas.ts` (`createCompanySchema`, réutilisé tel quel pour l'édition) + `constants/company.ts` (`COMPANY_SIZE_OPTIONS`). Clés RQ `queryKeys.company.mineAll` et `.detail(id)`.
- **`components/Company/CompanyFormFields.tsx`** : champs du formulaire (bannière, logo, nom, secteur, taille, site web, localisation, description) partagés entre `CreateCompany` et `EditCompany`. Logo : `utils/image.ts#fileToAvatarDataUrl` (recadrage carré 256px, même contrat que l'avatar utilisateur) ; bannière : `fileToBannerDataUrl` (recadrage « cover » 1200×420, même contrat que `User.banner_url`).
- **`components/Company/CompanyDetails.tsx`** : contenu détaillé d'une fiche (bannière, logo, à propos, taille/site/localisation) — extrait pour être partagé entre `CompanyView` et `CompanyList` (voir plus bas), évite de dupliquer ce bloc.
- **`pages/Company/CreateCompany.tsx`** (route `/company/create`) : après création, affiche l'état « Entreprise créée » avec un bouton « Voir la fiche » vers `/company/:id`. Invalide `queryKeys.company.mineAll`.
- **`pages/Company/CompanyList.tsx`** (route `/company`, index) : liste toutes les entreprises de l'utilisateur (`getMineAll`) avec bannière + logo + nom + secteur, chaque ligne cliquable vers `/company/:id`, bouton « + » dans l'en-tête pour créer une entreprise. **Cas particulier à une seule entreprise** : plutôt qu'une liste à un seul élément, la page affiche directement `CompanyDetails` (titre « Votre entreprise » au singulier, crayon d'édition dans l'en-tête) — évite un clic inutile. Titre « Vos entreprises » (pluriel) seulement à partir de 2. État vide → `EmptyState` + bouton vers `/company/create`.
- **`pages/Company/CompanyView.tsx`** (route `/company/:id`) : fiche d'une entreprise par id via `CompanyApi.getById()` — **route publique** (consultable par un invité depuis une offre d'emploi, cf. section Offres) : le crayon d'édition dans l'en-tête n'apparaît que si l'entreprise consultée fait partie de `queryKeys.company.mineAll` du visiteur connecté (sinon 403 silencieux côté Backend de toute façon, mais l'UI ne doit pas laisser croire que c'est possible). Plus de bouton « Créer une autre entreprise » sur cette page — l'action de création vit sur `CompanyList`.
- **`pages/Company/EditCompany.tsx`** (route `/company/:id/edit`) : charge `CompanyApi.getById(id)`, ne monte le formulaire (`EditCompanyForm`, composant interne) qu'une fois les données arrivées. `onSubmit` envoie tous les champs via `CompanyApi.update()`, invalide `queryKeys.company.mineAll` + `.detail(id)`, toast puis retour à `/company/:id`.
- **`SideMenu.tsx`** : l'entrée sous le trait (au-dessus de « Documents ») interroge `queryKeys.company.mineAll` et affiche « Créer une entreprise » (0 entreprise) / « Votre entreprise » (1) / « Vos entreprises » (2+), toujours vers `/company` dès qu'il y en a au moins une (la page décide elle-même si elle montre le détail ou la liste).

## Messagerie — intégration MS-Messagerie (nouveau)

La messagerie (`context/Messaging/`, `components/Messaging/`) parlait uniquement à des données mock (`constants/conversations.ts`, désormais neutralisé) jusqu'à l'intégration du micro-service dédié `../../MS-Messagerie` (NestJS + Prisma + PostgreSQL, dépôt indépendant, port `3001` en dev).

- **Connexion directe** Frontend ↔ MS-Messagerie (REST + WebSocket), pas de proxy par le Backend JobTrack : celui-ci se limite à émettre un JWT dédié (`GET /auth/messaging-token`, voir `Backend/CLAUDE.md`). `VITE_MESSAGING_API_URL` (`.env`) pointe vers cette instance.
- `src/services/messaging-client.ts` : seul point d'accès à MS-Messagerie. Un client axios dédié (jeton mis en cache mémoire, rafraîchi via `MessagingApi.getToken()` sur 401) + une connexion Socket.IO partagée (`connectMessagingSocket`/`disconnectMessagingSocket`), reconnectée automatiquement avec un jeton frais sur un `disconnect` de raison `"io server disconnect"` (déconnexion volontaire du serveur — jeton expiré/invalide côté `AppAuthGuard` de MS-Messagerie).
- `src/api/messaging.api.ts` (`MessagingApi.getToken()`) : seul appel qui transite par le Backend JobTrack (`api`, client axios existant) pour cette fonctionnalité.
- `src/types/messaging.type.ts` : DTO bruts de MS-Messagerie (`MessagingConversationDto`/`MessagingMessageDto`/`MessagingMessagePageDto`) + types consommés par les composants (`Conversation`/`ConversationMessage`, `unreadMessageCount`) — ces deux derniers reprenaient à l'origine la forme de l'ancien mock pour que `ConversationItem`/`ConversationThread`/`MessagingFab`/`Header` n'aient **pas** eu à changer (l'ajout présence / « en train d'écrire » / en-têtes d'auteur les a fait évoluer depuis, cf. plus bas ; `Conversation.online` a été ajouté).
- `MessagingContext` (`MessagingProvider`) reste la source unique de l'état messagerie pour toute l'app (ouverture/fermeture du panneau, conversation active) et porte désormais aussi les données réelles : `useQuery` (`queryKeys.messaging.conversations`) pour l'aperçu (une requête `GET /conversations` + par conversation `GET .../messages?limit=1` pour le dernier message et `UserApi.getById` pour le profil de l'autre participant), `useQuery` (`queryKeys.messaging.thread`) pour le fil complet de la conversation ouverte. Les événements WebSocket (`message:new`/`message:read`) invalident/mettent à jour le cache React Query.
- **Livraison temps réel hors conversation ouverte.** `message:new` de MS-Messagerie n'est diffusé que dans la room `conversation:<id>` (qu'on ne rejoint qu'en ouvrant le fil) : un destinataire qui n'a pas la conversation ouverte (a fortiori une conversation neuve) ne la voyait jamais apparaître sans reload. MS-Messagerie fait maintenant rejoindre chaque socket à une room perso `user:<id>` et pousse un `conversation:updated { conversationId }` (léger) aux deux participants à chaque `message.created` / lecture. Le Provider écoute `conversation:updated` (+ `conversation:read`) → invalide `queryKeys.messaging.conversations` (donc `unreadConversationIds`, le badge Header et le `MessagingFab`) et le fil concerné. `refetchOnWindowFocus: true` sur la query conversations en filet si le socket est tombé.
- **`unreadCount` par conversation.** `GET /conversations` renvoie `unreadCount` (messages reçus non lus, un `groupBy` côté MS-Messagerie). `Conversation.unreadCount` le porte, `unread` en dérive (`> 0`), `unreadMessageCount()` le renvoie directement (repli sur l'heuristique « messages entrants en fin de fil » si absent). À l'ouverture d'une conversation, `markConversationRead()` → `PATCH /conversations/:id/messages/read` (bulk) au lieu de marquer seul le dernier message.
- `MessagingFab` (fab mobile, qui pointe vers UNE personne) affiche l'avatar du participant (`targetConversation.avatarUrl`, repli initiale puis icône) au lieu de l'icône générique ; la barre desktop (ouvre la liste) garde `MessageCircle`.
- `MemberProfile.tsx` : le bouton "Message" (auparavant un toast "Bientôt disponible") appelle désormais `startConversation(member.id)` puis `openConversation(id)` — point d'entrée réel pour démarrer une conversation. Le flow de composition depuis le panneau (icône crayon de `MessagingHeader`) reste un TODO non implémenté (ticket séparé, nécessite un sélecteur de contact).
- **Hors périmètre côté MS-Messagerie** (voir son README) : pas d'archivage/suppression de conversation, pas de "marquer non lu" persistant. `MessagingPanel` garde donc un archivage/suppression **purement local** à la liste affichée (comme avant l'intégration), et `setConversationUnread(id, true)` (marquer non lu) est une surcharge locale cosmétique (`forcedUnreadIds` dans le Provider) — seul `unread: false` (marquer lu) est réellement persisté (`PATCH /conversations/:id/messages/read`, bulk).
- `package.json` : dépendance `socket.io-client` ajoutée (alignée sur la version `socket.io` du micro-service, `^4.8.1`).

**Présence, « en train d'écrire » et en-têtes d'auteur (nouveau) :**
- `messaging-client.ts` expose `emitTyping(conversationId, typing)` (émet `typing:start` / `typing:stop`) et `queryPresence()` (redemande un `presence:snapshot`).
- `MessagingContext` écoute `presence` / `presence:snapshot` (→ `onlineUserIds`, reporté sur `Conversation.online` pour l'autre participant) et `typing` (→ `typingConversationIds`, avec un minuteur d'expiration de 6 s si le `typing:stop` se perd). Nouvelles entrées du contexte : `typingConversationIds`, `setTyping`. Snapshot rejoué via `queryPresence()` après attachement des listeners.
- `Avatar` accepte `online?: boolean` : pastille verte / grise en bas à droite, **absente si `undefined`** (comportement inchangé pour MenuHeader / PeopleCard / etc.). `ConversationItem` la passe (`conv.online`).
- `ConversationThread` :
  - en-tête de fil : pastille de présence sur l'avatar + libellé « En ligne / Hors ligne » ;
  - **messages groupés par salve** — un en-tête (avatar `sm` + nom + heure) s'affiche une seule fois en tête d'une suite de messages consécutifs du même auteur (`me.name` via `getUserDisplay(useAuthStore().user)` pour soi, `conversation.name` sinon). L'heure de chaque message est portée par cet en-tête (plus de timestamp sous chaque bulle) ;
  - indicateur « … est en train d'écrire » sous le fil ;
  - émission de `typing` sur la frappe : `typing:start` throttlé à 1 / 3 s, `typing:stop` après 2,5 s d'inactivité, à l'envoi et à la fermeture / au changement de fil.
- MS-Messagerie : présence **en mémoire du process** (pas de backend Redis → pas de présence globale en multi-instance) ; pas de « dernière connexion ». Voir `Microservices/messagerie/CLAUDE.md` §0 septies.
- `MessagingRestApi.getConversations()` : adapté à la réponse paginée `{ items, nextCursor }` de MS-Messagerie (la liste n'est pas paginée côté UI, on ne garde que `items`).

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
