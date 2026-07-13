import { useState } from "react";
import { Link } from "react-router";
import { AuthLogo } from "../components/Auth/AuthLogo";
import { AuthTabs } from "../components/Auth/AuthTabs";
import { LoginForm } from "../components/Auth/LoginForm";
import { SignupForm } from "../components/Auth/SignupForm";

export function Home() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <div className="min-h-screen w-full bg-base-200 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <AuthLogo />

        <div className="bg-base-100 border border-base-200 rounded-box shadow-sm p-6">
          <AuthTabs mode={mode} onChange={setMode} />
          {mode === "login" ? <LoginForm /> : <SignupForm />}
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
  );
}
