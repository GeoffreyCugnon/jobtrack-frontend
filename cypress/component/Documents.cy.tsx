import { MemoryRouter, Route, Routes } from "react-router";
import { Documents } from "../../src/pages/Documents/Documents";
import { MenuProvider } from "../../src/context/Menu/MenuContext";
import { cvItems, letterItems } from "../../src/data/documents";

function mountDocuments() {
  cy.mount(
    <MemoryRouter initialEntries={["/app/documents"]}>
      <MenuProvider>
        <Routes>
          <Route path="/app/documents" element={<Documents />} />
          <Route
            path="/app/documents/cv/:id"
            element={<div>Prévisualisation CV</div>}
          />
          <Route
            path="/app/documents/letters/:id"
            element={<div>Prévisualisation lettre</div>}
          />
        </Routes>
      </MenuProvider>
    </MemoryRouter>,
  );
}

describe("Documents", () => {
  it("affiche l'onglet CV actif par défaut avec la liste des CV", () => {
    mountDocuments();

    cy.contains("button", "CV").should("have.attr", "aria-pressed", "true");
    cvItems.forEach((item) => {
      cy.contains(item.title).should("be.visible");
    });
    letterItems.forEach((item) => {
      cy.contains(item.title).should("not.exist");
    });
  });

  it("bascule vers l'onglet Lettres au clic", () => {
    mountDocuments();

    cy.contains("button", "Lettres").click();

    cy.contains("button", "Lettres").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    letterItems.forEach((item) => {
      cy.contains(item.title).should("be.visible");
    });
    cvItems.forEach((item) => {
      cy.contains(item.title).should("not.exist");
    });
  });

  it("navigue vers la prévisualisation au clic sur un document", () => {
    mountDocuments();

    cy.contains(cvItems[0].title).click();

    cy.contains("Prévisualisation CV").should("be.visible");
  });

  it("ouvre la boîte de dialogue de suppression avec le titre du document", () => {
    mountDocuments();

    cy.contains(cvItems[0].title)
      .closest("div[role='button']")
      .find('button[aria-label="Supprimer"]')
      .click();

    cy.contains("Supprimer ce document ?").should("be.visible");
    cy.contains(`« ${cvItems[0].title} »`).should("be.visible");
  });
});
