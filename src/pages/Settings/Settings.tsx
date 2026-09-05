import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Globe,
  Lock,
  ShieldCheck,
  HelpCircle,
  Info,
  Settings as SettingsIcon,
} from "lucide-react";
import SettingsProfileCard from "../../components/Settings/SettingsProfileCard";
import { SettingsSection } from "../../components/Settings/SettingsSection";
import SettingsItem from "../../components/Settings/SettingsItem";
import { SettingsModal } from "../../components/Settings/SettingsModal";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { currentUser } from "../../data/currentUser";
import { INPUT_CLASS } from "../../constants/styles";

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

  const user = currentUser;

  const aboutModalRef = useRef<HTMLDialogElement>(null);
  const deleteModalRef = useRef<HTMLDialogElement>(null);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleDeleteAccount = () => {
    // TODO: brancher sur DELETE /user/account
    deleteModalRef.current?.close();
  };

  return (
    <>
    <div className="flex-1 flex flex-col">
      <Header/>
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Paramètres"
          description="Gérez votre compte et vos préférences"
          icon={SettingsIcon}
        />

        <div className="-mx-4 sm:mx-0">
          <div className="flex flex-col divide-y divide-base-300">
            <SettingsProfileCard
              name={user.name}
              email={user.email}
              onEdit={() => {}}
            />

            <SettingsSection title="Préférences">
              {/* Ligne Notifications — inline */}
              <div className="flex w-full items-center justify-between bg-base-100 px-4 py-4 border-b border-base-200 last:border-b-0">
                <span className="flex items-center gap-3">
                  <span className="text-base-content/60">
                    <Bell size={18} />
                  </span>
                  <span className="font-medium text-base-content">
                    <span className="sm:hidden">Notifications</span>
                    <span className="hidden sm:inline">
                      Recevoir les notifications
                    </span>
                  </span>
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={settings.notifications}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      notifications: e.target.checked,
                    }))
                  }
                />
              </div>

              {/* Ligne Langue — inline, dropdown natif stylisé */}
              <div className="flex w-full items-center justify-between bg-base-100 px-4 py-4 border-b border-base-200 last:border-b-0">
                <span className="flex items-center gap-3">
                  <span className="text-base-content/60">
                    <Globe size={18} />
                  </span>
                  <span className="font-medium text-base-content">
                    Langue
                  </span>
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
          </div>
        </div>

        <button
          onClick={() => deleteModalRef.current?.showModal()}
          className="btn btn-error btn-soft w-full mt-6"
        >
          Supprimer mon compte
        </button>
      </PageContainer>
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
            className={INPUT_CLASS}
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