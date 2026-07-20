import { useNavigate } from "react-router";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Header } from "../../components/Header";

export function SettingsHelp() {
  const navigate = useNavigate();

  return (
    <>
      <Header title="Centre d'aide" />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate("/app/settings")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          Retour aux paramètres
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HelpCircle size={18} />
          </div>
          <h1 className="text-lg font-semibold">Comment pouvons-nous t'aider ?</h1>
        </div>

        <p className="text-sm text-base-content/70">
          {/* TODO: FAQ, formulaire de contact, ou lien vers un support externe */}
          Contenu à venir.
        </p>
      </div>
    </>
  );
}