import { RouterProvider } from "react-router";
import { router } from "./routes";
import Toast from "./components/Overlay/Toast";
import { MenuProvider } from "./context/Menu/MenuContext";

export default function App() {
  return (
    <MenuProvider>
      <RouterProvider router={router} />
      <Toast />
    </MenuProvider>
  );
}
