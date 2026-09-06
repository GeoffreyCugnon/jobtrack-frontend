import { z } from "zod";
import { passwordSchema } from "./password.schema";

const email = z.email("Email invalide");

export const loginSchema = z.object({ email, password: passwordSchema });
export const signupSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email,
  password: passwordSchema,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;

export const recoveryPasswordSchema = z.object({
  email: z.string().trim().email("Veuillez saisir une adresse email valide"),
});

export type RecoveryPasswordValues = z.infer<typeof recoveryPasswordSchema>;

// Étape 2 du "mot de passe oublié" : l'email et le token viennent des query
// params de l'URL générée par le Backend, seuls les deux champs mot de passe
// sont saisis ici. Même forme que `changePasswordSchema` côté Settings.
export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, "Merci de confirmer le nouveau mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
