import { z } from "zod";

// Champs de profil éditables. Alignés sur `UpdateProfileDto` côté Backend
// (`@MaxLength`). Chaîne vide autorisée = champ effacé.
export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est requis").max(100),
  lastName: z.string().trim().min(1, "Le nom est requis").max(100),
  headline: z.string().trim().max(150, "150 caractères maximum"),
  location: z.string().trim().max(150, "150 caractères maximum"),
  bio: z.string().trim().max(2000, "2000 caractères maximum"),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const contactSchema = z.object({
  phone: z.string().trim().max(40, "40 caractères maximum"),
  website: z.string().trim().max(255, "255 caractères maximum"),
  linkedin: z.string().trim().max(255, "255 caractères maximum"),
  github: z.string().trim().max(255, "255 caractères maximum"),
});

export type ContactValues = z.infer<typeof contactSchema>;
