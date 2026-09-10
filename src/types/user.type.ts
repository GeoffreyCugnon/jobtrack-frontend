export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  /** Avatar par défaut généré à la création du compte (cf. Backend). */
  avatar_url?: string | null;
  /** Bannière de profil choisie par l'utilisateur — `null` = dégradé par défaut. */
  banner_url?: string | null;
  /** Préférence compte — `User.notifications_enabled` côté Backend. */
  notifications_enabled?: boolean;
  /** Langue de l'interface — `User.language` côté Backend (`fr`/`en`/`es`/`de`). */
  language?: string;
};
