import { MemoryRouter, Route, Routes } from "react-router";
import { Documents } from "../../src/pages/Documents/Documents";
import { MenuProvider } from "../../src/context/Menu/MenuContext";
import { useAuthStore } from "../../src/store/auth.store";

const cvItems = [
  {
    id: 1,
    title: "CV principal — Fullstack",
    type: "CV",
    basePath: "cv",
    updatedAt: "01/09/2026",
    updatedAtISO: new Date().toISOString(),
  },
  {
    id: 2,
    title: "CV anglais — Software Engineer",
    type: "CV",
    basePath: "cv",
    updatedAt: "12/08/2026",
    updatedAtISO: new Date().toISOString(),
  },
];
const letterItems = [
  {
    id: 3,
    title: "Lettre — TechCorp",
    type: "LETTRE",
    basePath: "letters",
    updatedAt: "20/08/2026",
    updatedAtISO: new Date().toISOString(),
  },
];

function mountDocuments() {
  useAuthStore.setState({
    isAuthenticated: true,
    user: { id: "1", email: "c@t.dev", first_name: "C", last_name: "T" },
  });
  cy.intercept("GET", "**/document*", { body: [...cvItems, ...letterItems] });
  cy.mount(
    <MemoryRouter initialEntries={["/documents"]}>
      <MenuProvider>
        <Routes>
          <Route path="/documents" element={<Documents />} />
          <Route
            path="/documents/cv/:id"
            element={<div>Prévisualisation CV</div>}
          />
          <Route
            path="/documents/letters/:id"
            element={<div>Prévisualisation lettre</div>}
          />
        </Routes>
      </MenuProvider>
    </MemoryRouter>,
  );
}

describe("Documents", () => {
  afterEach(() => useAuthStore.getState().clearAuth());

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
