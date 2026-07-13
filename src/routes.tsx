import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Root } from "./pages/Root";
import { Dashboard } from "./pages/Dashboard";
import { Offers } from "./pages/Offers";
import { Network } from "./pages/Network";
import { Documents } from "./pages/Documents";
import { Posts } from "./pages/Posts";
import { Statistics } from "./pages/Statistics";
import { Settings } from "./pages/Settings";
import { Profile } from "./pages/Profile";

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
      { path: "profile", Component: Profile },
    ],
  },
]);
