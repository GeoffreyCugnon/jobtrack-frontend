import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  recoveryPasswordSchema,
  type RecoveryPasswordValues,
} from "../../schemas/auth.schemas";

import { FieldError } from "./FieldError";
import { BTN_FOCUS_RING, INPUT_CLASS } from "../../constants/styles";

interface RecoveryPasswordFormProps {
  onBack: () => void;
}

/**
 * RecoveryPasswordForm
 * Formulaire de demande de réinitialisation du mot de passe.
 *
 * L'utilisateur renseigne son email.
 * Si l'adresse existe, un email contenant un lien de réinitialisation sera envoyé.
 */
export function RecoveryPasswordForm({ onBack }: RecoveryPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoveryPasswordValues>({
    resolver: zodResolver(recoveryPasswordSchema),
  });

  const onSubmit = async (values: RecoveryPasswordValues) => {
    try {
      // TODO : appeler le service API
      // await authService.forgotPassword(values.email);

      console.log("Recovery password :", values);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="block">
        <span className="mb-1 block text-sm text-base-content/70">
          Adresse email
        </span>

        <input
          type="email"
          autoComplete="email"
          placeholder="jean.dupont@email.fr"
          className={INPUT_CLASS}
          {...register("email")}
        />

        <FieldError error={errors.email} />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn btn-primary w-full ${BTN_FOCUS_RING.primary}`}
      >
        {isSubmitting ? "Envoi..." : "Recevoir un lien de réinitialisation"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="block mx-auto text-sm text-base-content/50 hover:text-primary transition-colors"
      >
        Retour à la connexion
      </button>
    </form>
  );
}
