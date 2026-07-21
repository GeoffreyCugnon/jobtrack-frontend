import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Bell, Globe, Lock, ShieldCheck, HelpCircle, Info } from "lucide-react";
import ProfileCard from "../../components/Settings/SettingsProfilCard";
import { SettingsSection } from "../../components/Settings/SettingsSection";
import SettingsItem from "../../components/Settings/SettingsItem";
import { SettingsModal } from "../../components/Settings/SettingsModal";
import { Header } from "../../components/Header";

interface UserSettings {
  notifications: boolean;
  language: string;
}

export function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    language: "Français",
  });
  const [twoFA] = useState(false);

  const user = { name: "Geoffrey Cugnon", email: "junior@dev.fr" };

  const aboutModalRef = useRef<HTMLDialogElement>(null);
  const deleteModalRef = useRef<HTMLDialogElement>(null);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleDeleteAccount = () => {
    // TODO: brancher sur DELETE /user/account
    console.log("Compte supprimé");
    deleteModalRef.current?.close();
  };

  return (
    <>
      <Header/>
      <div className="max-w-5xl px-4 py-6">
        <ProfileCard name={user.name} email={user.email} onEdit={() => {}} />

        <SettingsSection title="Préférences">
          {/* Ligne Notifications — inline */}
          <div className="flex w-full items-center justify-between bg-base-100 px-4 py-4 border-b border-base-200 last:border-b-0">
            <span className="flex items-center gap-3">
              <span className="text-base-content/60">
                <Bell size={18} />
              </span>
              <span className="font-medium text-base-content">
                <span className="sm:hidden">Notifications</span>
                <span className="hidden sm:inline">Recevoir les notifications</span>
              </span>
            </span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={settings.notifications}
              onChange={(e) =>
                setSettings((s) => ({ ...s, notifications: e.target.checked }))
              }
            />
          </div>

          {/* Ligne Langue — inline, dropdown natif stylisé */}
          <div className="flex w-full items-center justify-between bg-base-100 px-4 py-4 border-b border-base-200 last:border-b-0">
            <span className="flex items-center gap-3">
              <span className="text-base-content/60">
                <Globe size={18} />
              </span>
              <span className="font-medium text-base-content">Langue</span>
            </span>
            <select
              className="select select-ghost select-md w-auto px-10 text-right font-normal text-base-content/50 focus:outline-none"
              value={settings.language}
              onChange={(e) =>
                setSettings((s) => ({ ...s, language: e.target.value }))
              }
            >
              <option>Français</option>
              <option>English</option>
              <option>Deutsch</option>
              <option>Español</option>
            </select>
          </div>
        </SettingsSection>

        <SettingsSection title="Sécurité">
          <SettingsItem
            icon={<Lock size={18} />}
            label="Mot de passe"
            onClick={() => navigate("/app/settings/password")}
          />
          <SettingsItem
            icon={<ShieldCheck size={18} />}
            label="Authentification 2FA"
            value={twoFA ? "Activée" : "Désactivée"}
            onClick={() => navigate("/app/settings/2fa")}
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            icon={<HelpCircle size={18} />}
            label="Centre d'aide"
            onClick={() => navigate("/app/settings/help")}
          />
          <SettingsItem
            icon={<Info size={18} />}
            label="À propos"
            value="Version 1.0.0"
            onClick={() => aboutModalRef.current?.showModal()}
          />
        </SettingsSection>

        <button
          onClick={() => deleteModalRef.current?.showModal()}
          className="w-full rounded-2xl border border-error/20 bg-error/5 px-4 py-4 text-center font-medium text-error transition-colors hover:bg-error/10"
        >
          Supprimer mon compte
        </button>
      </div>

      <SettingsModal modalRef={aboutModalRef} title="À propos">
        <p className="text-sm text-base-content/70">Version 1.0.0</p>
      </SettingsModal>

      <dialog ref={deleteModalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold text-error">Supprimer votre compte ?</h3>
          <p className="py-4 text-sm text-base-content/70">
            Cette action est irréversible. Toutes vos données seront définitivement
            supprimées. Tape <span className="font-semibold">SUPPRIMER</span> pour
            confirmer.
          </p>
          <input
            type="text"
            className="input input-bordered w-full"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="SUPPRIMER"
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setDeleteConfirmText("")}>
                Annuler
              </button>
            </form>
            <button
              className="btn btn-error"
              disabled={deleteConfirmText !== "SUPPRIMER"}
              onClick={handleDeleteAccount}
            >
              Supprimer définitivement
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}