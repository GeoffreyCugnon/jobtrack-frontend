import { MemoryRouter } from "react-router";
import { Offers } from "../../src/pages/Offers";
import { MenuProvider } from "../../src/context/Menu/MenuContext";
import { useAuthStore } from "../../src/store/auth.store";
import { useSavedOffersStore } from "../../src/store/saved-offers.store";
import mockOffers from "../fixtures/offers.json";

// `Offers` charge les offres via `OffersApi.getAll()` (`GET job-offering`) et
// filtre le texte sur `?q=` (la barre de recherche est celle du header, qui
// navigue vers `/offers?q=...`). Plus d'onglets : les offres sauvegardées ont
// leur propre route `/offers/saved`.
function mountOffers(entry = "/offers") {
  useAuthStore.setState({
    isAuthenticated: true,
    user: { id: "1", email: "c@t.dev", first_name: "C", last_name: "T" },
  });
  useSavedOffersStore.setState({ savedIds: [] });
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

  it("affiche toutes les offres par défaut", () => {
    mountOffers();

    cy.contains(`${mockOffers.length} offres trouvées`).should("be.visible");
    cy.contains("a", "Offres sauvegardées").should("be.visible");
  });

  it("filtre les offres via ?q=", () => {
    mountOffers("/offers?q=PixelWorks");

    cy.contains("1 offre trouvée").should("be.visible");
    cy.contains("Développeuse Frontend").should("be.visible");
    cy.contains("Support IT").should("not.exist");
  });

  it("affiche l'état vide pour une catégorie sans offre", () => {
    mountOffers();

    // Ouvre le dropdown "Catégorie" et choisit "Industrie" (absente du mock).
    cy.get('[aria-label="Filtrer par catégorie"]').click();
    cy.contains(".dropdown-content button", "Industrie").click({ force: true });

    cy.contains("Aucune offre dans cette catégorie pour l'instant.").should(
      "be.visible",
    );
  });

  it("sauvegarde une offre : cœur en favori + compteur du lien mis à jour", () => {
    mountOffers("/offers?q=PixelWorks");

    cy.contains("Développeuse Frontend")
      .closest("div.py-3")
      .find('button[aria-label="Sauvegarder l\'offre"]')
      .click();

    cy.contains("Développeuse Frontend")
      .closest("div.py-3")
      .find('button[aria-label="Retirer des favoris"]')
      .should("exist");

    cy.contains("a", "Offres sauvegardées").contains("1").should("be.visible");
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
