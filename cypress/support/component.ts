import { mount } from "cypress/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement, type ReactNode } from "react";
import "../../src/index.css";

declare global {
  // Augmentation du namespace global Cypress requise pour typer cy.mount.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

// Toute page montée en test qui utilise React Query a besoin d'un
// `QueryClientProvider`. On en fournit un neuf par montage (cache isolé, pas
// de retry pour que les cas d'erreur soient immédiats).
Cypress.Commands.add("mount", (jsx: ReactNode, options?: Parameters<typeof mount>[1]) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return mount(
    createElement(QueryClientProvider, { client: queryClient }, jsx),
    options,
  );
});
