import { RecoveryPasswordForm } from "../../src/components/Auth/RecoveryPasswordForm";

describe("RecoveryPasswordForm", () => {
  it("affiche le champ email et les deux boutons", () => {
    const onBack = cy.stub().as("onBack");
    cy.mount(<RecoveryPasswordForm onBack={onBack} />);

    cy.get('input[type="email"]').should("be.visible");
    cy.contains("button", "Recevoir un lien de réinitialisation").should(
      "be.visible",
    );
    cy.contains("button", "Retour à la connexion").should("be.visible");
  });

  it("appelle onBack au clic sur le lien de retour", () => {
    const onBack = cy.stub().as("onBack");
    cy.mount(<RecoveryPasswordForm onBack={onBack} />);

    cy.contains("Retour à la connexion").click();
    cy.get("@onBack").should("have.been.calledOnce");
  });

  it("affiche une erreur sur soumission avec un email invalide", () => {
    cy.mount(<RecoveryPasswordForm onBack={() => {}} />);

    cy.get('input[type="email"]').type("pas-un-email");
    cy.contains("button", "Recevoir un lien de réinitialisation").click();

    cy.get('[role="alert"]')
      .should("be.visible")
      .and("contain.text", "adresse email valide");
  });

  it("soumet le formulaire avec un email valide", () => {
    cy.mount(<RecoveryPasswordForm onBack={() => {}} />);
    cy.window().then((win) => cy.stub(win.console, "log").as("consoleLog"));

    cy.get('input[type="email"]').type("jean.dupont@email.fr");
    cy.contains("button", "Recevoir un lien de réinitialisation").click();

    cy.get('[role="alert"]').should("not.exist");
    cy.get("@consoleLog").should(
      "have.been.calledWith",
      "Recovery password :",
      { email: "jean.dupont@email.fr" },
    );
  });
});
