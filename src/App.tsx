import { useEffect, useRef, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import Toast from "./components/Overlay/Toast";
import { MenuProvider } from "./context/Menu/MenuContext";
import { AuthApi } from "./api/auth.api";
import { useAuthStore } from "./store/auth.store";

export default function App() {
  // Le store d'auth est en mémoire : au chargement (ou après un refresh), on
  // rejoue le refresh token (cookie httpOnly) pour restaurer la session.
  const [restoring, setRestoring] = useState(true);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // évite le double appel StrictMode en dev
    started.current = true;

    AuthApi.refresh()
      .then(({ accessToken, user }) => {
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setAccessToken(accessToken);
      })
      .catch(() => {
        // Pas de session valide -> on reste en invité.
      })
      .finally(() => setRestoring(false));
  }, []);

  if (restoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <MenuProvider>
      <RouterProvider router={router} />
      <Toast />
    </MenuProvider>
  );
}
