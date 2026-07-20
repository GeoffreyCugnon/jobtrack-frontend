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
