import { AuthTabs } from "../../src/components/Auth/AuthTabs";

describe("AuthTabs", () => {
  it("affiche les deux onglets", () => {
    cy.mount(<AuthTabs mode="login" onChange={() => {}} />);

    cy.contains("button", "Se connecter").should("be.visible");
    cy.contains("button", "S'inscrire").should("be.visible");
  });

  it("marque l'onglet correspondant à mode comme actif", () => {
    cy.mount(<AuthTabs mode="signup" onChange={() => {}} />);

    cy.contains("button", "Se connecter").should(
      "have.attr",
      "aria-pressed",
      "false",
    );
    cy.contains("button", "S'inscrire").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
  });

  it("appelle onChange avec la clé de l'onglet cliqué", () => {
    const onChange = cy.stub().as("onChange");
    cy.mount(<AuthTabs mode="login" onChange={onChange} />);

    cy.contains("button", "S'inscrire").click();
    cy.get("@onChange").should("have.been.calledWith", "signup");
  });
});
