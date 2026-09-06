import type { ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { SignupForm } from "../../src/components/Auth/SignupForm";

// `SignupForm` utilise `useNavigate` : il doit être monté dans un routeur.
const mount = (ui: ReactNode) => cy.mount(<MemoryRouter>{ui}</MemoryRouter>);

describe("SignupForm", () => {
  it("affiche les champs nom, email et mot de passe", () => {
    mount(<SignupForm />);

    cy.get('input[type="text"]').should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("button", "Créer mon compte").should("be.visible");
  });

  it("affiche une erreur par champ sur soumission vide", () => {
    mount(<SignupForm />);

    cy.contains("button", "Créer mon compte").click();

    cy.get('[role="alert"]').should("have.length", 3);
    cy.contains("Nom trop court").should("be.visible");
    cy.contains("Email invalide").should("be.visible");
    cy.contains("une minuscule, une majuscule, un chiffre et un symbole").should(
      "be.visible",
    );
  });

  it("rejette un nom d'une seule lettre", () => {
    mount(<SignupForm />);

    cy.get('input[type="text"]').type("J");
    cy.get('input[type="email"]').type("jean.dupont@email.fr");
    cy.get('input[type="password"]').type("Motdepasse123!");
    cy.contains("button", "Créer mon compte").click();

    cy.get('[role="alert"]')
      .should("have.length", 1)
      .and("contain.text", "Nom trop court");
  });

  it("n'affiche aucune erreur quand toutes les valeurs sont valides", () => {
    mount(<SignupForm />);

    cy.get('input[type="text"]').type("Jean Dupont");
    cy.get('input[type="email"]').type("jean.dupont@email.fr");
    cy.get('input[type="password"]').type("Motdepasse123!");
    cy.contains("button", "Créer mon compte").click();

    cy.get('[role="alert"]').should("not.exist");
  });
});
