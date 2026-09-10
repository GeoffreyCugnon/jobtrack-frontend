import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/Theme/ThemeContext";
import { IconContext } from "@phosphor-icons/react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Une offre / un fil / un profil ne changent pas à la seconde : on
      // évite un refetch à chaque remontage ou focus de fenêtre.
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // L'intercepteur axios gère déjà le rejeu 401 (refresh token) ; une
      // seule nouvelle tentative suffit pour un aléa réseau.
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Poids par défaut des icônes Phosphor (rendu type LinkedIn/Artdeco). */}
      <IconContext.Provider value={{ weight: "bold" }}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </IconContext.Provider>
    </QueryClientProvider>
  </StrictMode>,
);
