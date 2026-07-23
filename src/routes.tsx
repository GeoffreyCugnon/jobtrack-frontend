import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Root } from "./pages/Root";
import { Dashboard } from "./pages/Dashboard";
import { Offers } from "./pages/Offers";
import { Network } from "./pages/Network";
import { Documents } from "./pages/Documents";
import { Posts } from "./pages/Posts";
import { Statistics } from "./pages/Statistics";
import { Settings } from "./pages/Settings/Settings";
import { Profile } from "./pages/Profile";
import { SettingsPassword } from "./pages/Settings/SettingsPassword";
import { SettingsTwoFA } from "./pages/Settings/SettingTwoFa";
import { SettingsHelp } from "./pages/Settings/SettingsHelp";
import CvCard from "./components/Document/CvCards/CvCard";
import LettreCard from "./components/Document/LettreCards/Lettre";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  {
    path: "/app",
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
      { path: "offers", Component: Offers },
      { path: "network", Component: Network },
      { path: "documents", Component: Documents },
      { path: "posts", Component: Posts },
      { path: "statistics", Component: Statistics },
      { path: "settings", Component: Settings },
      { path: "settings/password", Component: SettingsPassword },
      { path: "settings/2fa", Component: SettingsTwoFA },
      { path: "settings/help", Component: SettingsHelp },
      { path: "profile", Component: Profile },
      { path: "CvCard", Component: CvCard },
      { path: "LettreCard", Component: LettreCard },
      ],
  },
]);
