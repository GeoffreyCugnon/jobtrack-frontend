import { z } from "zod";

// "www.test.fr" -> "https://www.test.fr" : personne ne tape le schéma au
// clavier, donc on le complète avant de vérifier/envoyer l'URL plutôt que
// d'obliger à le saisir. Exporté pour que `CreateCompany`/`EditCompany`
// envoient la même valeur normalisée au Backend (qui, lui, exige un schéma).
export function withScheme(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function isValidWebsite(value: string): boolean {
  return z.string().url().safeParse(withScheme(value)).success;
}

export const createCompanySchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis"),
  business_sector: z
    .string()
    .min(1, "Le secteur d'activité est requis")
    .max(150, "150 caractères maximum"),
  size: z
    .enum(["1-10", "11-50", "51-200", "201-500", "500+"])
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .max(255, "255 caractères maximum")
    .refine(isValidWebsite, { message: "URL invalide" })
    .optional()
    .or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  description: z
    .string()
    .max(2000, "2000 caractères maximum")
    .optional()
    .or(z.literal("")),
});

export type CreateCompanyValues = z.infer<typeof createCompanySchema>;
