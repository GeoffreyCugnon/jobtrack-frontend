import { z } from "zod";

export const recoveryPasswordSchema = z.object({
  email: z.string().trim().email("Veuillez saisir une adresse email valide"),
});

export type RecoveryPasswordValues = z.infer<typeof recoveryPasswordSchema>;
