import { z } from "zod";

// Doit rester aligné sur le Backend : `@IsStrongPassword({ minLength: 8,
// minUppercase: 1, minNumbers: 1, minSymbols: 1 })` (+ `minLowercase: 1` par
// défaut) sur `CreateUserDto` et `LoginDto`. Sans ça un mot de passe passe le
// front puis se fait rejeter en 400 au register/login.
const STRONG_PASSWORD_MESSAGE =
  "8 caractères min., avec au moins une minuscule, une majuscule, un chiffre et un symbole";

// Un seul `.regex` (lookaheads) -> une seule erreur affichée à la fois.
export const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    STRONG_PASSWORD_MESSAGE,
  );
