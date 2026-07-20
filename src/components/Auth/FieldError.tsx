import type {
  FieldError as RHFFieldError,
  Merge,
  FieldErrorsImpl,
} from "react-hook-form";

type FieldErrorProps = {
  error?: RHFFieldError | Merge<RHFFieldError, FieldErrorsImpl> | string;
};

/**
 * FieldError
 * Affiche un message d'erreur de validation sous un champ de formulaire.
 * Accepte soit une string directe, soit l'objet d'erreur brut de react-hook-form
 * (errors.email, errors.password, etc.) — évite d'avoir à écrire
 * `message={errors.email?.message}` partout.
 */
export function FieldError({ error }: FieldErrorProps) {
  const message =
    typeof error === "string" ? error : (error?.message as string | undefined);

  if (!message) return null;

  return (
    <p className="text-xs text-error mt-1" role="alert">
      {message}
    </p>
  );
}
