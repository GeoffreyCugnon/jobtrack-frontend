import { SignupForm } from "../../src/components/Auth/SignupForm";

describe("SignupForm", () => {
  it("affiche les champs nom, email et mot de passe", () => {
    cy.mount(<SignupForm />);

    cy.get('input[type="text"]').should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("button", "Créer mon compte").should("be.visible");
  });

  it("affiche une erreur par champ sur soumission vide", () => {
    cy.mount(<SignupForm />);

    cy.contains("button", "Créer mon compte").click();

    cy.get('[role="alert"]').should("have.length", 3);
    cy.contains("Nom trop court").should("be.visible");
    cy.contains("Email invalide").should("be.visible");
    cy.contains("Le mot de passe doit contenir au moins 8 caractères").should(
      "be.visible",
    );
  });

  it("rejette un nom d'une seule lettre", () => {
    cy.mount(<SignupForm />);

    cy.get('input[type="text"]').type("J");
    cy.get('input[type="email"]').type("jean.dupont@email.fr");
    cy.get('input[type="password"]').type("motdepasse123");
    cy.contains("button", "Créer mon compte").click();

    cy.get('[role="alert"]')
      .should("have.length", 1)
      .and("contain.text", "Nom trop court");
  });

  it("soumet le formulaire quand toutes les valeurs sont valides", () => {
    cy.mount(<SignupForm />);
    cy.window().then((win) => cy.stub(win.console, "log").as("consoleLog"));

    cy.get('input[type="text"]').type("Jean Dupont");
    cy.get('input[type="email"]').type("jean.dupont@email.fr");
    cy.get('input[type="password"]').type("motdepasse123");
    cy.contains("button", "Créer mon compte").click();

    cy.get('[role="alert"]').should("not.exist");
    cy.get("@consoleLog").should("have.been.calledWith", "signup", {
      name: "Jean Dupont",
      email: "jean.dupont@email.fr",
      password: "motdepasse123",
    });
  });
});
