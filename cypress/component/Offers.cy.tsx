import { MemoryRouter } from "react-router";
import { Offers } from "../../src/pages/Offers";
import { MenuProvider } from "../../src/context/Menu/MenuContext";
import { mockOffers } from "../../src/data/offerCategories";

function mountOffers() {
  cy.mount(
    <MemoryRouter initialEntries={["/offers"]}>
      <MenuProvider>
        <Offers />
      </MenuProvider>
    </MemoryRouter>,
  );
}

describe("Offers", () => {
  it("affiche l'onglet Recherche actif avec toutes les offres par défaut", () => {
    mountOffers();

    cy.contains("button", "Recherche").should(
      "have.attr",
      "aria-pressed",
      "true",
    );
    cy.contains(`${mockOffers.length} offres trouvées`).should("be.visible");
  });

  it("filtre les offres via la barre de recherche", () => {
    mountOffers();

    cy.get('input[placeholder="Rechercher une offre..."]').type("PixelWorks");

    cy.contains("1 offre trouvée").should("be.visible");
    cy.contains("Développeuse Frontend").should("be.visible");
    cy.contains("Support IT").should("not.exist");
  });

  it("affiche l'état vide pour une catégorie sans offre", () => {
    mountOffers();

    cy.get('[role="tab"][aria-label="Industrie"]').click();

    cy.contains("Aucune offre dans cette catégorie pour l'instant.").should(
      "be.visible",
    );
  });

  it("sauvegarde une offre et la retrouve dans l'onglet Sauvegardées", () => {
    mountOffers();

    cy.get('input[placeholder="Rechercher une offre..."]').type("PixelWorks");
    cy.contains("Développeuse Frontend")
      .closest("div.py-3")
      .find('button[aria-label="Sauvegarder l\'offre"]')
      .click();
    cy.get('input[placeholder="Rechercher une offre..."]').clear();

    cy.contains("button", "Sauvegardées").click();

    cy.contains("1 offre sauvegardée").should("be.visible");
    cy.contains("Développeuse Frontend").should("be.visible");
  });

  it("masque une offre au clic sur la croix", () => {
    mountOffers();

    cy.get('input[placeholder="Rechercher une offre..."]').type("PixelWorks");
    cy.contains("Développeuse Frontend")
      .closest("div.py-3")
      .find('button[aria-label="Masquer cette offre"]')
      .click();

    cy.contains("0 offre trouvée").should("be.visible");
    cy.contains("Développeuse Frontend").should("not.exist");
  });
});
