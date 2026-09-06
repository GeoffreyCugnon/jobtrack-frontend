import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ShieldCheck } from "@/lib/icons";
import { Header } from "../../components/Layout/Header";
import { INPUT_CLASS } from "../../constants/styles";

type Step = "intro" | "qrcode" | "verify" | "recovery";

export function SettingsTwoFA() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("intro");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  // TODO: viendra de GET /user/2fa/setup (qrCodeUrl + secret)
  const qrCodeUrl = null;
  // TODO: viendra de POST /user/2fa/enable une fois le code vérifié
  const recoveryCodes: string[] = [];

  const handleStart = () => {
    // TODO: appeler POST /user/2fa/setup pour générer le QR code
    setStep("qrcode");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError("Le code doit contenir 6 chiffres.");
      return;
    }

    try {
      // TODO: brancher sur POST /user/2fa/verify avec { code }
      setStep("recovery");
    } catch {
      setError("Code invalide, réessaie.");
    }
  };

  return (
    <>
      <Header/>
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate("/settings")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          Retour aux paramètres
        </button>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck size={18} />
              </div>
              <h1 className="text-lg font-semibold">Authentification à deux facteurs</h1>
            </div>

            {step === "intro" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-base-content/70">
                  Ajoute une couche de sécurité supplémentaire à ton compte en exigeant un
                  code généré par une application (Google Authenticator, Authy...) en plus
                  de ton mot de passe.
                </p>
                <button onClick={handleStart} className="btn btn-primary self-start">
                  Activer la 2FA
                </button>
              </div>
            )}

            {step === "qrcode" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-base-content/70">
                  Scanne ce QR code avec ton application d'authentification.
                </p>
                <div className="flex h-48 w-48 items-center justify-center self-center rounded-box border border-base-200 bg-base-200/40 text-xs text-base-content/40">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR code 2FA" />
                  ) : (
                    "QR code à venir"
                  )}
                </div>
                <button
                  onClick={() => setStep("verify")}
                  className="btn btn-primary self-start"
                >
                  J'ai scanné le code
                </button>
              </div>
            )}

            {step === "verify" && (
              <form onSubmit={handleVerify} className="flex flex-col gap-4">
                <label className="form-control">
                  <span className="label-text mb-1">Code à 6 chiffres</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    className={`${INPUT_CLASS} tracking-widest`}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                  />
                </label>
                {error && <p className="text-sm text-error">{error}</p>}
                <button type="submit" className="btn btn-primary self-start">
                  Vérifier et activer
                </button>
              </form>
            )}

            {step === "recovery" && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-base-content/70">
                  2FA activée. Conserve ces codes de récupération dans un endroit sûr — ils
                  te permettront de récupérer ton compte si tu perds l'accès à ton
                  application d'authentification.
                </p>
                <div className="rounded-box border border-base-200 bg-base-200/40 p-4 font-mono text-sm">
                  {recoveryCodes.length > 0 ? (
                    recoveryCodes.map((c) => <div key={c}>{c}</div>)
                  ) : (
                    <span className="text-base-content/40">Codes à venir</span>
                  )}
                </div>
                <button
                  onClick={() => navigate("/settings")}
                  className="btn btn-primary self-start"
                >
                  Terminer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}