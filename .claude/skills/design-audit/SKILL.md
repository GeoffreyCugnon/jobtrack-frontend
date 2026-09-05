---
name: design-audit
description: Audit JobTrack pages against the Dashboard design-system reference (structure, clickable cards/rows, badges, empty states, "voir tout" links, theme tokens, mobile touch targets) and flag stray console.log/console.error. Use when asked to harmonize pages with the Dashboard, run a design-system audit, or check UI consistency across src/pages.
---

# Design audit — JobTrack (React + TS + Tailwind v4 + DaisyUI v5 + Lucide)

Contexte : `src/pages/Dashboard` (surtout `Dashboard.tsx`) sert de référence de design
system pour tout `src/pages/`. Ce skill compare une ou plusieurs pages à cette
référence et restitue un état des lieux — **il ne modifie jamais de code tant
que l'étape 1 n'a pas été validée par l'utilisateur.**

## Portée

Par défaut, audite toutes les pages sous `src/pages/` qui utilisent le layout
principal (`Root.tsx` → `Header` / `SideMenu` / bottom nav), en excluant `Home.tsx`
(page publique, hors layout `/app`). Si des arguments nomment des pages précises
(ex: `Offers, Network`), limiter l'audit à celles-ci.

## Référence : ce qu'implémente réellement le Dashboard

Ne pas partir d'une version idéalisée des patterns — relire les fichiers
ci-dessous à chaque audit (ils peuvent évoluer) :

- `src/components/Layout/PageContainer.tsx` — `max-w-5xl mx-auto px-4`
- `src/components/Layout/PageTitle.tsx` — titre + description + icône Lucide
- `src/components/Layout/SectionCard.tsx` — bandeau `bg-base-200`, repliable ou
  non (`collapsible={false}` sur les pages de type dashboard), `headerTo`/`onAdd`
  mutuellement exclusifs pour l'action du header
- `src/components/Layout/EmptyState.tsx` — icône Lucide + message engageant
  (jamais "Aucune donnée")
- `src/components/Layout/ComingSoonPage.tsx` — pattern "section pas encore
  construite" déjà factorisé (Header+PageTitle+EmptyState) ; utilisé par les
  pages Messaging — toute page "à venir" doit le réutiliser au lieu de
  dupliquer le JSX
- `src/components/Dashboard/StatsCards/StatCard.tsx` — card cliquable : chevron
  `ChevronRight` visible seulement `lg:hidden` (mobile), et sur desktop
  l'unique indice devient le `:hover`. **Nuance à garder en tête** : ça
  contredit littéralement "jamais hover-only" si on l'applique strictement au
  desktop — signaler cette tension dans les points à arbitrer plutôt que de la
  either généraliser ou la corriger sans validation.
- `src/components/Dashboard/UrgentTasks/TaskRow.tsx` — ligne cliquable :
  badge de statut à GAUCHE, icône de type + chevron (`lg:hidden`) à DROITE
- `src/components/Dashboard/RecentEvents/EventRow.tsx` — ligne NON cliquable :
  icône à GAUCHE, purement informative (ne pas la prendre comme modèle de
  ligne interactive)
- `src/components/Settings/SettingsItem.tsx` — variante la plus proche de
  "icône à gauche indicative + chevron à droite seul indicateur", avec
  `active:bg-base-300` pour le feedback tactile
- Il existe une **deuxième convention de layout**, distincte de
  `PageContainer`/`PageTitle`, pour les sous-pages formulaire/détail
  (`SettingsPassword`, `SettingsTwoFA`, `ProfileEdit`, `CVEdit`, `LetterEdit`,
  etc.) : conteneur `max-w-2xl`, bouton "Retour", card unique, `<h1>` custom.
  Ne pas la confondre avec la référence "page liste" du Dashboard — vérifier
  auprès de l'utilisateur si elle doit elle aussi être documentée/généralisée
  ou si c'est un pattern volontairement différent.

## Étape 1 — Audit (à restituer avant toute modification)

Pour chaque page dans la portée, produire :

1. **Respecté** — quels patterns du Dashboard sont déjà en place (citer les
   composants réutilisés : `PageContainer`, `PageTitle`, `SectionCard`,
   `EmptyState`, chevron, badges, etc.)
2. **Manquant / différent** — écarts concrets, avec fichier + ce qui cloche
   (ex: empty state fait main au lieu de `EmptyState`, couleur Tailwind brute
   au lieu d'un token DaisyUI, indice de clic hover-only, etc.)
3. **À arbitrer** — tout ce qui ne rentre pas naturellement dans les patterns
   (page sans équivalent "détail" comme une liste de cards jamais cliquées
   nulle part, layout structurellement différent type feed social, collision
   entre boutons d'action existants et l'ajout d'un chevron, etc.) : **signaler,
   ne jamais trancher seul.**

Vérifier systématiquement, pour chaque page auditée :

- **Structure** : `Header` + `PageContainer` + `PageTitle` (titre + description
  + icône), sections en bandeau `SectionCard`
- **Cards cliquables** : indice visuel permanent (pas hover-only), chevron en
  coin, `active:` au tap, zone tactile ≥ 44px
- **Listes d'items cliquables** : toute la ligne cliquable, icône de type non
  interactive, `ChevronRight` seul indicateur, regroupement par
  catégorie/échéance si pertinent
- **Badges de statut** : réutilisation du système `badge badge-*` DaisyUI —
  jamais de pastille de couleur brute (`bg-error`/`bg-success` en dot) à la
  place ; `error` réservé aux urgences réelles
- **États vides** : composant `EmptyState` partagé, ton engageant, jamais
  "Aucune donnée"
- **Liens "Voir tout" conditionnels** : affichés seulement si le total dépasse
  la limite affichée, sauf si la destination contient structurellement plus
  de contenu qu'un simple filtre (ex: historique complet)
- **Thème & tokens** : uniquement des tokens DaisyUI (`base-100/200/300`,
  `primary`, `error`, `success`, etc.), jamais de couleur Tailwind brute
  (`text-gray-500`, `from-blue-500`...) — ces dernières cassent le rendu
  dark/light
- **Mobile-first / tactile** : aucun indice d'interactivité qui dépende
  uniquement du `:hover`
- **Réutilisation** : un pattern qui se répète sans être encore factorisé doit
  être signalé comme candidat à l'extraction, pas dupliqué silencieusement

### Vérification console.log / console.error

En plus des patterns visuels, grep `src/` pour
`console\.(log|warn|error|debug|info)` et lister chaque occurrence
(fichier:ligne). Pour chacune, préciser :

- si c'est un reliquat de debug (`console.log("login", values)`, TODO oublié) →
  à signaler pour suppression
- si c'est un vrai traitement d'erreur voulu (ex: un `catch` qui logue avant de
  remonter une erreur utilisateur) → à signaler mais pas nécessairement à
  supprimer, juste à confirmer

Inclure ce résultat dans la restitution de l'étape 1, même si ce n'est pas un
écart de design system à proprement parler.

## Étape 2 — Implémentation (seulement après arbitrage explicite)

Ne commencer qu'après que l'utilisateur a tranché les points de l'étape 1.
Contraintes à respecter :

- Réutiliser les composants déjà factorisés (`PageContainer`, `EmptyState`,
  badges, patterns de card) plutôt que dupliquer ; extraire en composant
  partagé si un pattern se répète sans l'être encore
- Ne pas casser les fonctionnalités spécifiques déjà en place — harmonisation
  visuelle/UX, pas refonte fonctionnelle
- Conventions du projet : composants en PascalCase, `index.tsx` en minuscule,
  dossiers utilitaires en lowercase
- `tsc -b`, `npm run lint` et `npm run build` doivent passer sans erreur ni
  warning après implémentation
- Tester chaque page modifiée en mobile/desktop × clair/sombre avant de
  considérer la tâche terminée
