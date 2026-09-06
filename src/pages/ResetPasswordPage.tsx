import { Link, useSearchParams } from "react-router";
import { AuthLogo } from "../components/Auth/AuthLogo";
import { ResetPasswordForm } from "../components/Auth/ResetPasswordForm";

/**
 * Page publique `/auth/reset-password` — cible du lien envoyé par
 * `POST /auth/forgot-password` (Backend), qui construit une URL de la forme
 * `/auth/reset-password?email=...&token=...`. Sans ces deux query params la
 * page n'a rien à consommer : on affiche un message et un retour vers `/auth`.
 */
export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const hasValidLink = email !== "" && token !== "";

  return (
    <div className="min-h-screen w-full bg-base-200 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <AuthLogo size="lg" />

        <div className="bg-base-100 border border-base-200 rounded-box shadow-sm p-6 lg:shadow-xl lg:shadow-base-300/40">
          <h2 className="text-lg font-semibold mb-6 text-center">
            Choisir un nouveau mot de passe
          </h2>

          {hasValidLink ? (
            <ResetPasswordForm email={email} token={token} />
          ) : (
            <p className="text-sm text-base-content/70 text-center">
              Ce lien de réinitialisation est incomplet ou invalide. Relancez
              une demande depuis la page de connexion.
            </p>
          )}
        </div>

        <div className="mt-8 text-center border-t border-base-content/10 pt-4">
          <Link
            to="/auth"
            className="text-sm text-base-content/50 hover:text-primary transition-colors"
          >
            Retour à la connexion →
          </Link>
        </div>
      </div>
    </div>
  );
}
