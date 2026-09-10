import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FileText, SquaresFour, Target } from "@phosphor-icons/react";
import { AuthLogo } from "../components/Auth/AuthLogo";
import { AuthTabs } from "../components/Auth/AuthTabs";
import { LoginForm } from "../components/Auth/LoginForm";
import { SignupForm } from "../components/Auth/SignupForm";
import { RecoveryPasswordForm } from "../components/Auth/RecoveryPasswordForm";
import { useAuthStore } from "../store/auth.store";
import {
  POST_LOGOUT_DELAY_MS,
  POST_LOGOUT_KEY,
  POST_LOGOUT_STALE_MS,
} from "../constants/auth";

const HERO_FEATURES = [
  { icon: Target, label: "Centralisez vos candidatures et vos offres suivies" },
  { icon: FileText, label: "Générez CV et lettres de motivation en un clic" },
  {
    icon: SquaresFour,
    label: "Suivez vos relances depuis un tableau de bord clair",
  },
];

const armedKey = `${POST_LOGOUT_KEY}_armed`;
const readStorage = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};
const clearPostLogout = () => {
  try {
    sessionStorage.removeItem(POST_LOGOUT_KEY);
    sessionStorage.removeItem(armedKey);
  } catch {
    /* ignore */
  }
};

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup" | "recovery">("login");
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // true dès que CE montage a armé la temporisation : permet de distinguer
  // un rechargement de la page (nouveau montage, ref repartie à false).
  const armedThisMount = useRef(false);

  // Fenêtre post-déconnexion : on laisse `POST_LOGOUT_DELAY_MS` sur `/auth`
  // puis on renvoie vers l'accueil. Un rechargement de la page pendant la
  // fenêtre renvoie immédiatement.
  useEffect(() => {
    if (isAuthenticated) {
      clearPostLogout();
      return;
    }
    const raw = readStorage(POST_LOGOUT_KEY);
    if (!raw) return;

    // Marqueur périmé (pas une vraie déconnexion récente) : on nettoie sans
    // rediriger, pour ne pas bloquer l'accès au formulaire.
    if (Date.now() - Number(raw) > POST_LOGOUT_STALE_MS) {
      clearPostLogout();
      return;
    }

    if (readStorage(armedKey) === "1" && !armedThisMount.current) {
      // Rechargement de `/auth` pendant la fenêtre -> accueil immédiat.
      clearPostLogout();
      navigate("/", { replace: true });
      return;
    }

    if (readStorage(armedKey) !== "1") {
      try {
        sessionStorage.setItem(armedKey, "1");
      } catch {
        /* ignore */
      }
      armedThisMount.current = true;
    }

    const timer = window.setTimeout(() => {
      clearPostLogout();
      navigate("/", { replace: true });
    }, POST_LOGOUT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-full bg-base-200 lg:flex">
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
            JobTrack centralise vos candidatures, vos documents et vos relances
            dans un seul espace.
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
              to="/"
              className="text-sm text-base-content/50 hover:text-primary transition-colors"
            >
              Retour à l'accueil →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
