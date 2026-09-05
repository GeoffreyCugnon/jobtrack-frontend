import { mount } from "cypress/react";
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

Cypress.Commands.add("mount", mount);
