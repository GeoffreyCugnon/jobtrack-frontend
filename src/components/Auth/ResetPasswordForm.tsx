import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import axios from "axios";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "../../schemas/auth.schemas";
import { FieldError } from "./FieldError";
import { BTN_FOCUS_RING, INPUT_CLASS } from "../../constants/styles";
import { AuthApi } from "../../api/auth.api";
import { useToastStore } from "../../store/toast.store";

interface ResetPasswordFormProps {
  email: string;
  token: string;
}

/**
 * ResetPasswordForm
 * Étape 2 du "mot de passe oublié" : consomme le lien reçu par email
 * (`/auth/reset-password?email=...&token=...`). L'utilisateur saisit son
 * nouveau mot de passe ; en cas de succès le refresh token est invalidé côté
 * Backend, on renvoie donc vers la page de connexion.
 */
export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      await AuthApi.resetPassword({
        email,
        token,
        newPassword: values.newPassword,
      });
      useToastStore
        .getState()
        .addToast(
          "Mot de passe réinitialisé. Vous pouvez vous connecter.",
          "success",
        );
      navigate("/auth");
    } catch (error) {
      const expired =
        axios.isAxiosError(error) && error.response?.status === 400;
      useToastStore
        .getState()
        .addToast(
          expired
            ? "Ce lien de réinitialisation est invalide ou expiré. Refaites une demande."
            : "La réinitialisation a échoué. Réessayez plus tard.",
          "error",
        );
      if (expired) navigate("/auth");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="block">
        <span className="mb-1 block text-sm text-base-content/70">
          Nouveau mot de passe
        </span>
        <input
          type="password"
          autoComplete="new-password"
          className={INPUT_CLASS}
          {...register("newPassword")}
        />
        <FieldError error={errors.newPassword} />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-base-content/70">
          Confirmer le nouveau mot de passe
        </span>
        <input
          type="password"
          autoComplete="new-password"
          className={INPUT_CLASS}
          {...register("confirmPassword")}
        />
        <FieldError error={errors.confirmPassword} />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn btn-primary w-full ${BTN_FOCUS_RING.primary}`}
      >
        {isSubmitting ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </button>
    </form>
  );
}
