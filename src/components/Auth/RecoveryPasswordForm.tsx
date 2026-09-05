import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  recoveryPasswordSchema,
  type RecoveryPasswordValues,
} from "../../schemas/auth.schemas";

import { FieldError } from "./FieldError";
import { BTN_FOCUS_RING, INPUT_CLASS } from "../../constants/styles";
import { AuthApi } from "../../api/auth.api";
import { useToastStore } from "../../store/toast.store";

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
      await AuthApi.forgotPassword(values.email);
      useToastStore
        .getState()
        .addToast(
          "Si un compte existe pour cette adresse, un lien de réinitialisation vient d’être envoyé.",
          "success",
        );
      onBack();
    } catch (error) {
      console.error("Forgot password failed", error);
      useToastStore
        .getState()
        .addToast(
          "Impossible d’envoyer le lien de réinitialisation.",
          "error",
        );
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
