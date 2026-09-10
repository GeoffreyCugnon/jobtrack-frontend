import { MemoryRouter, Route, Routes } from "react-router";
import { Dashboard } from "../../src/pages/Dashboard/Dashboard";
import { MenuProvider } from "../../src/context/Menu/MenuContext";
import { useAuthStore } from "../../src/store/auth.store";

const testUser = {
  id: "1",
  email: "junior@dev.fr",
  first_name: "Geoffrey",
  last_name: "Cugnon",
};

const stats = {
  activeApplications: 4,
  upcomingInterviews: 2,
  availableOffers: 30,
};

// « Activité récente » est dérivée des candidatures (une ligne par candidature).
const applications = [
  {
    id: 11,
    jobOfferingId: 1,
    company: "TechCorp",
    role: "Développeuse Fullstack",
    status: "PENDING",
    statusLabel: "En attente",
    hasUpcomingInterview: false,
    interviewsCount: 0,
    appliedDate: "01/09/2026",
    createdAt: new Date().toISOString(),
  },
  {
    id: 12,
    jobOfferingId: 2,
    company: "CloudNine",
    role: "Ingénieur DevOps",
    status: "ACCEPTED",
    statusLabel: "Acceptée",
    hasUpcomingInterview: false,
    interviewsCount: 0,
    appliedDate: "28/08/2026",
    createdAt: new Date().toISOString(),
  },
];

const interviews = [
  {
    id: 21,
    applicationId: 11,
    company: "TechCorp",
    role: "Développeuse Fullstack",
    interviewType: "VISIO",
    mode: "visio",
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    date: "mar. 15 sept. 14:00",
    isUpcoming: true,
    notes: null,
    visioLink: "https://meet.example.com/x",
    location: null,
  },
];

function mountDashboard() {
  cy.intercept("GET", "**/dashboard/stats", { body: stats });
  cy.intercept("GET", "**/application", { body: applications });
  cy.intercept("GET", "**/interview", { body: interviews });
  cy.mount(
    <MemoryRouter initialEntries={["/"]}>
      <MenuProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MenuProvider>
    </MemoryRouter>,
  );
}

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: testUser, isAuthenticated: true });
  });

  afterEach(() => {
    useAuthStore.getState().clearAuth();
  });

  it("affiche le nom et les initiales de l'utilisateur", () => {
    mountDashboard();

    cy.contains(`Bonjour ${testUser.first_name} !`).should("be.visible");
    cy.contains("GC").should("be.visible");
  });

  it("affiche les stats rapides avec les compteurs de l'API", () => {
    mountDashboard();

    // Le libellé de StatCard est scindé sur deux lignes (<br/>) : on cible la
    // tuile par son lien et on vérifie le compteur + le 1er mot du libellé.
    cy.get('a[href="/candidatures"]')
      .should("contain.text", String(stats.activeApplications))
      .and("contain.text", "Candidatures");
    cy.get('a[href="/entretiens"]')
      .should("contain.text", String(stats.upcomingInterviews))
      .and("contain.text", "Entretiens");
    cy.get('a[href="/offers"]')
      .should("contain.text", String(stats.availableOffers))
      .and("contain.text", "Offres");
  });

  it("affiche les entretiens à venir dans « Prochaines actions »", () => {
    mountDashboard();

    cy.contains("À venir").should("be.visible");
    cy.contains(`Entretien — ${interviews[0].company}`).should("be.visible");
  });

  it("affiche l'activité récente dérivée des candidatures", () => {
    mountDashboard();

    cy.contains("Activité récente").should("be.visible");
    applications.forEach((application) => {
      cy.contains(
        `Candidature — ${application.role} chez ${application.company}`,
      ).should("be.visible");
    });
  });
});
