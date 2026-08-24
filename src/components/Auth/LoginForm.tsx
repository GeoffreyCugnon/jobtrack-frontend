import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "../../schemas/auth.schemas";
import { FieldError } from "./FieldError";
import { BTN_FOCUS_RING, INPUT_CLASS } from "../../constants/styles";

interface LoginFormProps {
  onForgotPassword?: () => void;
}

/**
 * LoginForm
 * Formulaire de connexion : email + mot de passe.
 * Validation gérée par react-hook-form + un schéma Zod (loginSchema),
 * via zodResolver qui fait le pont entre les deux.
 */
export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const {
    register, // permet de "brancher" un input non-contrôlé au formulaire
    handleSubmit, // wrapper qui valide les données avant d'appeler onSubmit
    formState: { errors }, // erreurs de validation par champ (générées par Zod)
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  // Handler appelé uniquement si la validation Zod passe.
  // TODO: remplacer le console.log par l'appel réel au service d'auth
  // (probablement dans services/ vu ta convention de dossiers)
  const onSubmit = (values: LoginValues) => {
    console.log("login", values);
  };

  return (
    // noValidate désactive la validation native du navigateur (bulles HTML5)
    // pour laisser Zod/react-hook-form gérer entièrement l'affichage des erreurs
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Champ Email */}
      <label className="block">
        <span className="text-sm text-base-content/70 mb-1 block">Email</span>
        <input
          type="email"
          autoComplete="email" // aide au remplissage auto + gestionnaires de mots de passe
          placeholder="jean.dupont@email.fr"
          className={INPUT_CLASS}
          {...register("email")} // connecte ce champ à react-hook-form sous la clé "email"
        />
        {/* Affiche le message d'erreur Zod pour ce champ, si présent */}
        <FieldError error={errors.email} />
      </label>

      {/* Champ Mot de passe */}
      <label className="block">
        <span className="text-sm text-base-content/70 mb-1 block">
          Mot de passe
        </span>
        <input
          type="password"
          autoComplete="current-password" // suggère au navigateur un mdp déjà connu (≠ "new-password")
          placeholder="••••••••"
          className={INPUT_CLASS}
          {...register("password")}
        />
        <FieldError error={errors.password} />
      </label>

      {onForgotPassword && (
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-base-content/50 hover:text-primary transition-colors"
        >
          Mot de passe oublié ?
        </button>
      )}

      <button
        type="submit"
        className={`btn btn-primary w-full mt-2 ${BTN_FOCUS_RING.primary}`}
      >
        Se connecter
      </button>
    </form>
  );
}
