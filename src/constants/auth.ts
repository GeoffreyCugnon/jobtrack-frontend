// Déconnexion : `SideMenu` pose ce marqueur (timestamp) puis navigue vers
// `/auth`. `AuthPage` le consomme : on reste `POST_LOGOUT_DELAY_MS` sur `/auth`
// avant de rediriger vers l'accueil ; un rechargement de `/auth` pendant cette
// fenêtre redirige immédiatement. Au-delà de `POST_LOGOUT_STALE_MS`, le
// marqueur est ignoré (visite ultérieure de `/auth`, pas une vraie
// déconnexion) pour ne pas bloquer l'accès au formulaire.
export const POST_LOGOUT_KEY = "jt_postLogout";
export const POST_LOGOUT_DELAY_MS = 5000;
export const POST_LOGOUT_STALE_MS = 15000;
