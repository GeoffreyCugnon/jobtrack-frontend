import { useState } from "react";
import { Link } from "react-router";
import { FileText, LayoutDashboard, Target } from "lucide-react";
import { AuthLogo } from "../components/Auth/AuthLogo";
import { AuthTabs } from "../components/Auth/AuthTabs";
import { LoginForm } from "../components/Auth/LoginForm";
import { SignupForm } from "../components/Auth/SignupForm";
import { RecoveryPasswordForm } from "../components/Auth/RecoveryPasswordForm";

const HERO_FEATURES = [
  { icon: Target, label: "Centralisez vos candidatures et vos offres suivies" },
  { icon: FileText, label: "Générez CV et lettres de motivation en un clic" },
  { icon: LayoutDashboard, label: "Suivez vos relances depuis un tableau de bord clair" },
];

export function Home() {
  const [mode, setMode] = useState<"login" | "signup" | "recovery">("login");

  return (
    <div className="min-h-screen w-full bg-base-200 lg:flex">
      {/* Panneau de présentation, visible uniquement en desktop */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between relative overflow-hidden bg-linear-to-br from-primary via-primary to-secondary text-primary-content p-12 xl:p-16">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-content/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-secondary/30 blur-3xl" />

        <p className="relative text-xl font-extrabold tracking-tight">
          Job<span className="text-primary-content/70">Track</span>
        </p>

        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Pilotez votre recherche d'emploi comme un pro.
          </h1>
          <p className="text-primary-content/80 text-lg">
            JobTrack centralise vos candidatures, vos documents et vos relances dans un seul espace.
          </p>

          <ul className="mt-10 space-y-4">
            {HERO_FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-content/15 shrink-0">
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-primary-content/90">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-primary-content/50">
          © {new Date().getFullYear()} JobTrack — Career Navigator
        </p>
      </div>

      {/* Colonne d'authentification */}
      <div className="flex flex-col items-center justify-center px-4 py-8 min-h-screen lg:w-1/2 lg:px-12 lg:py-16">
        <div className="w-full max-w-sm">
          <AuthLogo size="lg" />

          <div className="bg-base-100 border border-base-200 rounded-box shadow-sm p-6 lg:shadow-xl lg:shadow-base-300/40">
            {mode === "recovery" ? (
              <>
                <h2 className="text-lg font-semibold mb-6 text-center">
                  Mot de passe oublié ?
                </h2>
                <RecoveryPasswordForm onBack={() => setMode("login")} />
              </>
            ) : (
              <>
                <AuthTabs mode={mode} onChange={setMode} />
                {mode === "login" ? (
                  <LoginForm onForgotPassword={() => setMode("recovery")} />
                ) : (
                  <SignupForm />
                )}
              </>
            )}
          </div>

          <div className="mt-8 text-center border-t border-base-content/10 pt-4">
            <Link
              to="/app"
              className="text-sm text-base-content/50 hover:text-primary transition-colors"
            >
              Accès provisoire au dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
