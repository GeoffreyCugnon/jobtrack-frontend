import { RouterProvider } from "react-router";
import { router } from "./routes";
import Toast from "./components/Overlay/Toast";

export default function App() {
  return (
    <>
    <RouterProvider router={router} />;
    <Toast />
    </>
  )
}
