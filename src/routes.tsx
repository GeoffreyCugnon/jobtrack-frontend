import { createBrowserRouter } from "react-router";
import { Root } from "./pages/root";
import { Dashboard } from "./pages/dashboard";
import { Offers } from "./pages/offers";
import { Network } from "./pages/network";
import { Documents } from "./pages/documents";
import { Posts } from "./pages/posts";
import { Statistics } from "./pages/statistics";
import { Settings } from "./pages/settings";
import { Profile } from "./pages/profile";

export const router = createBrowserRouter([
  {
    path: "/",
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
