import { z } from "zod";

export const contactSchema = z.object({
    companyId: z.number({ message: "Entreprise requise" }),
    name: z.string().min(1, "Nom requis"),
    jobTitle: z.string().min(1, "Fonction requise"),
    email: z.string().email("Email invalide"),
    phone: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
