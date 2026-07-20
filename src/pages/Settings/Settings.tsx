import React, { useRef, useState } from "react";
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

  // état local — à remplacer par contexte user / un futur GET /user/settings
  const [settings, setSettings] = useState<UserSettings>({
    notifications: true,
    language: "Français",
  });
  const [twoFA] = useState(false);

  const user = { name: "Geoffrey Cugnon", email: "junior@dev.fr" };

  // refs pour les modales daisyUI
  const notificationsModalRef = useRef<HTMLDialogElement>(null);
  const languageModalRef = useRef<HTMLDialogElement>(null);
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
      <Header title="Paramètres" />
      <div className="max-w-5xl px-4 py-6">
        <ProfileCard name={user.name} email={user.email} onEdit={() => {}} />

        <SettingsSection title="Préférences">
          <SettingsItem
            icon={<Bell size={18} />}
            label="Notifications"
            value={settings.notifications ? "Activées" : "Désactivées"}
            onClick={() => notificationsModalRef.current?.showModal()}
          />
        
          <SettingsItem
            icon={<Globe size={18} />}
            label="Langue"
            value={settings.language}
            onClick={() => languageModalRef.current?.showModal()}
          />
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

      <SettingsModal modalRef={notificationsModalRef} title="Notifications">
        <label className="flex cursor-pointer items-center justify-between">
          <span>Recevoir les notifications</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={settings.notifications}
            onChange={(e) =>
              setSettings((s) => ({ ...s, notifications: e.target.checked }))
            }
          />
        </label>
      </SettingsModal>

      <SettingsModal modalRef={languageModalRef} title="Langue">
        <select
          className="select select-bordered w-full"
          value={settings.language}
          onChange={(e) => setSettings((s) => ({ ...s, language: e.target.value }))}
        >
          <option>Français</option>
          <option>English</option>
          <option>Español</option>
        </select>
      </SettingsModal>

      <SettingsModal modalRef={aboutModalRef} title="À propos">
        <p className="text-sm text-base-content/70">Version 1.0.0</p>
      </SettingsModal>

      {/* Modale suppression de compte — reste inline, logique de confirmation propre */}
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