// Identité mock de l'utilisateur connecté, en attendant l'intégration d'un
// vrai backend d'auth. Source unique pour éviter que SideMenu/Settings/
// Dashboard/Profile n'affichent chacun une valeur différente.
export const currentUser = {
  firstName: "Geoffrey",
  lastName: "Cugnon",
  name: "Geoffrey Cugnon",
  initials: "GC",
  email: "junior@dev.fr",
};
