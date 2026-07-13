import { z } from "zod";

const email = z.email("Email invalide");
const password = z.string().min(8, "8 caractères minimum");

export const loginSchema = z.object({ email, password });
export const signupSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email,
  password,
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
