import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Root } from "./pages/Root";
import { Dashboard } from "./pages/Dashboard";
import { Offers } from "./pages/Offers";
import { Network } from "./pages/Network";
import { Documents } from "./pages/Documents/Documents";
import { CVPreview } from "./pages/Documents/CVPreview";
import { CVEdit } from "./pages/Documents/CVEdit";
import { LetterPreview } from "./pages/Documents/LetterPreview";
import { LetterEdit } from "./pages/Documents/LetterEdit";
import { Posts } from "./pages/Posts";
import { Statistics } from "./pages/Statistics";
import { Settings } from "./pages/Settings/Settings";
import { Profile } from "./pages/Profile/Profile";
import { ProfileEdit } from "./pages/Profile/ProfileEdit";
import { ProfileContactEdit } from "./pages/Profile/ProfileContactEdit";
import { ProfileSkillsEdit } from "./pages/Profile/ProfileSkillsEdit";
import { SettingsPassword } from "./pages/Settings/SettingsPassword";
import { SettingsTwoFA } from "./pages/Settings/SettingTwoFa";
import { SettingsHelp } from "./pages/Settings/SettingsHelp";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  {
    path: "/app",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "offers", Component: Offers },
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
      { path: "posts", Component: Posts },
      { path: "statistics", Component: Statistics },
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
