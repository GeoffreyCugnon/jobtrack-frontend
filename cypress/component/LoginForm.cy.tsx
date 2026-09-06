import { LoginForm } from "../../src/components/Auth/LoginForm";

describe("LoginForm", () => {
  it("affiche les champs email et mot de passe", () => {
    cy.mount(<LoginForm />);

    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains("button", "Se connecter").should("be.visible");
  });

  it("n'affiche pas le lien mot de passe oublié si aucun callback n'est fourni", () => {
    cy.mount(<LoginForm />);

    cy.contains("Mot de passe oublié ?").should("not.exist");
  });

  it("appelle onForgotPassword au clic sur le lien", () => {
    const onForgotPassword = cy.stub().as("onForgotPassword");
    cy.mount(<LoginForm onForgotPassword={onForgotPassword} />);

    cy.contains("Mot de passe oublié ?").click();
    cy.get("@onForgotPassword").should("have.been.calledOnce");
  });

  it("affiche une erreur par champ sur soumission vide", () => {
    cy.mount(<LoginForm />);

    cy.contains("button", "Se connecter").click();

    cy.get('[role="alert"]').should("have.length", 2);
    cy.contains("Email invalide").should("be.visible");
    cy.contains("une minuscule, une majuscule, un chiffre et un symbole").should(
      "be.visible",
    );
  });

  it("rejette un mot de passe de moins de 8 caractères", () => {
    cy.mount(<LoginForm />);

    cy.get('input[type="email"]').type("jean.dupont@email.fr");
    cy.get('input[type="password"]').type("1234");
    cy.contains("button", "Se connecter").click();

    cy.get('[role="alert"]')
      .should("have.length", 1)
      .and("contain.text", "8 caractères");
  });

  it("n'affiche aucune erreur quand les identifiants sont valides", () => {
    cy.mount(<LoginForm />);

    cy.get('input[type="email"]').type("jean.dupont@email.fr");
    cy.get('input[type="password"]').type("Motdepasse123!");
    cy.contains("button", "Se connecter").click();

    cy.get('[role="alert"]').should("not.exist");
  });
});
