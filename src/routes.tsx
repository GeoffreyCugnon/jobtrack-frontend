import { createBrowserRouter } from "react-router";
import { AuthPage } from "./pages/AuthPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { Root } from "./pages/Root";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Relances } from "./pages/Dashboard/Relances";
import { Historique } from "./pages/Dashboard/Historique";
import { Candidatures } from "./pages/Dashboard/Candidatures";
import { CandidatureDetail } from "./pages/Dashboard/CandidatureDetail";
import { Entretiens } from "./pages/Dashboard/Entretiens";
import { EntretienDetail } from "./pages/Dashboard/EntretienDetail";
import { Offers } from "./pages/Offers";
import { OfferDetail } from "./pages/OfferDetail";
import { Network } from "./pages/Network";
import { Documents } from "./pages/Documents/Documents";
import { CVPreview } from "./pages/Documents/CVPreview";
import { CVEdit } from "./pages/Documents/CVEdit";
import { LetterPreview } from "./pages/Documents/LetterPreview";
import { LetterEdit } from "./pages/Documents/LetterEdit";
import { Publications } from "./pages/Publications/Publications";
import { PublicationDetail } from "./pages/Publications/PublicationDetail";
import { Statistics } from "./pages/Statistics";
import { Settings } from "./pages/Settings/Settings";
import { Profile } from "./pages/Profile/Profile";
import { ProfileEdit } from "./pages/Profile/ProfileEdit";
import { ProfileContactEdit } from "./pages/Profile/ProfileContactEdit";
import { ProfileSkillsEdit } from "./pages/Profile/ProfileSkillsEdit";
import { SettingsPassword } from "./pages/Settings/SettingsPassword";
import { SettingsTwoFA } from "./pages/Settings/SettingsTwoFA";
import { SettingsHelp } from "./pages/Settings/SettingsHelp";
import { MessagingManage } from "./pages/Messaging/MessagingManage";
import { MessagingPreferences } from "./pages/Messaging/MessagingPreferences";
import { MessagingArchived } from "./pages/Messaging/MessagingArchived";
import { MessagingAwayMessage } from "./pages/Messaging/MessagingAwayMessage";

export const router = createBrowserRouter([
  { path: "/auth", Component: AuthPage },
  { path: "/auth/reset-password", Component: ResetPasswordPage },
  {
    // Layout unique de l'app. Pas de préfixe "/app" : le contexte
    // invité / membre est géré dans `Root` (barre de nav, vue d'accueil,
    // messagerie...) selon `useAuthStore().isAuthenticated`.
    path: "/",
    Component: Root,
    children: [
      // "/" et "/dashboard" pointent sur le même écran ; en invité `Root`
      // affiche `Publications` à la place (vue d'accueil publique).
      { index: true, Component: Dashboard },
      { path: "dashboard", Component: Dashboard },
      { path: "relances", Component: Relances },
      { path: "historique", Component: Historique },
      { path: "candidatures", Component: Candidatures },
      { path: "candidatures/:id", Component: CandidatureDetail },
      { path: "entretiens", Component: Entretiens },
      { path: "entretiens/:id", Component: EntretienDetail },
      { path: "offers", Component: Offers },
      { path: "offers/:id", Component: OfferDetail },
      { path: "network", Component: Network },
      {
        path: "documents",
        children: [
          { index: true, Component: Documents },
          { path: "cv/:id", Component: CVPreview },
          { path: "cv/:id/edit", Component: CVEdit },
          { path: "letters/:id", Component: LetterPreview },
          { path: "letters/:id/edit", Component: LetterEdit },
        ],
      },
      // Onglet "Actus" de l'app : même composant que l'accueil, sans le logo.
      { path: "publications", element: <Publications showLogo={false} /> },
      { path: "publications/:id", Component: PublicationDetail },
      { path: "statistics", Component: Statistics },
      {
        path: "messaging",
        children: [
          { path: "manage", Component: MessagingManage },
          { path: "preferences", Component: MessagingPreferences },
          { path: "archived", Component: MessagingArchived },
          { path: "away-message", Component: MessagingAwayMessage },
        ],
      },
      {
        path: "profile",
        children: [
          { index: true, Component: Profile },
          { path: "edit", Component: ProfileEdit },
          { path: "contact/edit", Component: ProfileContactEdit },
          { path: "skills/edit", Component: ProfileSkillsEdit },
        ],
      },
      {
        path: "settings",
        children: [
          { index: true, Component: Settings },
          { path: "password", Component: SettingsPassword },
          { path: "2fa", Component: SettingsTwoFA },
          { path: "help", Component: SettingsHelp },
        ],
      },
    ],
  },
]);
