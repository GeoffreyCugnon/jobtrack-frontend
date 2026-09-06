import { MemoryRouter } from "react-router";
import { Offers } from "../../src/pages/Offers";
import { MenuProvider } from "../../src/context/Menu/MenuContext";
import { useAuthStore } from "../../src/store/auth.store";
import mockOffers from "../../src/data/mockOffers.json";

// `Offers` charge les offres via `OffersApi.getAll()` (`GET job-offering`) et
// filtre le texte sur `?q=` (la barre de recherche est désormais celle du
// header, qui navigue vers `/offers?q=...`). Ces specs testent la vue
// connectée (onglets Recherche/Sauvegardées, alertes).
function mountOffers(entry = "/offers") {
  useAuthStore.setState({
    isAuthenticated: true,
    user: { id: "1", email: "c@t.dev", first_name: "C", last_name: "T" },
  });
  cy.intercept("GET", "**/job-offering", { body: mockOffers }).as("offers");
  cy.mount(
    <MemoryRouter initialEntries={[entry]}>
      <MenuProvider>
        <Offers />
      </MenuProvider>
    </MemoryRouter>,
  );
  cy.wait("@offers");
}

describe("Offers", () => {
  afterEach(() => useAuthStore.getState().clearAuth());

  it("affiche l'onglet Recherche actif avec toutes les offres par défaut", () => {
    mountOffers();

    cy.contains("button", "Recherche").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    cy.contains(`${mockOffers.length} offres trouvées`).should("be.visible");
  });

  it("filtre les offres via ?q=", () => {
    mountOffers("/offers?q=PixelWorks");

    cy.contains("1 offre trouvée").should("be.visible");
    cy.contains("Développeuse Frontend").should("be.visible");
    cy.contains("Support IT").should("not.exist");
  });

  it("affiche l'état vide pour une catégorie sans offre", () => {
    mountOffers();

    cy.get('[role="tab"][aria-label="Industrie"]').click({ force: true });

    cy.contains("Aucune offre dans cette catégorie pour l'instant.").should(
      "be.visible",
    );
  });

  it("sauvegarde une offre et la retrouve dans l'onglet Sauvegardées", () => {
    mountOffers("/offers?q=PixelWorks");

    cy.contains("Développeuse Frontend")
      .closest("div.py-3")
      .find('button[aria-label="Sauvegarder l\'offre"]')
      .click();

    cy.contains("button", "Sauvegardées").click();

    cy.contains("1 offre sauvegardée").should("be.visible");
    cy.contains("Développeuse Frontend").should("be.visible");
  });

  it("masque une offre au clic sur la croix", () => {
    mountOffers("/offers?q=PixelWorks");

    cy.contains("Développeuse Frontend")
      .closest("div.py-3")
      .find('button[aria-label="Masquer cette offre"]')
      .click();

    cy.contains("0 offre trouvée").should("be.visible");
    cy.contains("Développeuse Frontend").should("not.exist");
  });
});
