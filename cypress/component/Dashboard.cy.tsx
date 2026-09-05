import { MemoryRouter, Route, Routes } from "react-router";
import { Dashboard } from "../../src/pages/Dashboard/Dashboard";
import { MenuProvider } from "../../src/context/Menu/MenuContext";
import { currentUser } from "../../src/data/currentUser";
import {
  dashboardStats,
  dashboardTodayTasks,
  dashboardUpcomingTasks,
  dashboardRecentEvents,
} from "../../src/data/dashboard";

// Doit rester synchro avec SEEN_EVENTS_KEY dans Dashboard.tsx (non exporté).
const SEEN_EVENTS_KEY = "dashboard-seen-event-ids";

function mountDashboard() {
  cy.mount(
    <MemoryRouter initialEntries={["/app"]}>
      <MenuProvider>
        <Routes>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/historique" element={<div>Historique complet</div>} />
        </Routes>
      </MenuProvider>
    </MemoryRouter>,
  );
}

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("affiche le nom et les initiales de l'utilisateur", () => {
    mountDashboard();

    cy.contains(`Bonjour ${currentUser.firstName} !`).should("be.visible");
    cy.contains(currentUser.initials).should("be.visible");
  });

  it("affiche les stats rapides avec leurs valeurs", () => {
    mountDashboard();

    dashboardStats.forEach((stat) => {
      cy.contains(stat.label)
        .closest("a")
        .should("contain.text", String(stat.count));
    });
  });

  it("affiche les tâches du jour et à venir", () => {
    mountDashboard();

    const [todayTask] = dashboardTodayTasks;
    const [upcomingTask] = dashboardUpcomingTasks;

    cy.contains("Aujourd'hui").should("be.visible");
    cy.contains(`Relancer ${todayTask.company} (${todayTask.role})`).should(
      "be.visible",
    );

    cy.contains("À venir").should("be.visible");
    cy.contains(upcomingTask.text as string).should("be.visible");
  });

  it("affiche les derniers événements non vus", () => {
    mountDashboard();

    dashboardRecentEvents.forEach((event) => {
      cy.contains(event.text).should("be.visible");
    });
  });

  it("affiche l'état vide quand tous les événements ont déjà été vus", () => {
    localStorage.setItem(
      SEEN_EVENTS_KEY,
      JSON.stringify(dashboardRecentEvents.map((event) => event.id)),
    );

    mountDashboard();

    cy.contains("Rien de nouveau pour l'instant, revenez plus tard !").should(
      "be.visible",
    );
    dashboardRecentEvents.forEach((event) => {
      cy.contains(event.text).should("not.exist");
    });
  });

  it("marque les événements comme vus et navigue vers l'historique au clic sur Voir tout", () => {
    mountDashboard();

    cy.contains("Voir tout").click();

    cy.contains("Historique complet").should("be.visible");
    cy.window()
      .its("localStorage")
      .invoke("getItem", SEEN_EVENTS_KEY)
      .should(
        "eq",
        JSON.stringify(dashboardRecentEvents.map((event) => event.id)),
      );
  });
});
