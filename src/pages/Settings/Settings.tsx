import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { UserApi } from "../../api/user.api";
import { useToastStore } from "../../store/toast.store";
import { Bell, Gear, Globe, Info, Lock, Question } from "@phosphor-icons/react";

import SettingsProfileCard from "../../components/Settings/SettingsProfileCard";
import { SettingsSection } from "../../components/Settings/SettingsSection";
import SettingsItem from "../../components/Settings/SettingsItem";
import { SettingsModal } from "../../components/Settings/SettingsModal";
import { Header } from "../../components/Layout/Header";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/Layout/PageTitle";
import { useAuthStore } from "../../store/auth.store";
import { getUserDisplay } from "../../utils/user-display";
import type { User } from "../../types/user.type";
import { INPUT_CLASS } from "../../constants/styles";
import { logError } from "../../utils/log";

/** Langues acceptées par le Backend (`UpdateLanguageDto`), libellé pour l'UI. */
const LANGUAGES: { code: string; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
];

export function Settings() {
  const navigate = useNavigate();


  const rawUser = useAuthStore((state) => state.user);
  const user = getUserDisplay(rawUser);

  // Préférences pilotées directement par le user du store (persistées côté
  // Backend via `PATCH /user/settings/*`), pas par un état local volatile.
  const notifications = rawUser?.notifications_enabled ?? true;
  const language = rawUser?.language ?? "fr";
  const [prefPending, setPrefPending] = useState(false);

  /**
   * Applique une préférence de façon optimiste (maj immédiate du store), puis
   * confirme via l'API ; en cas d'échec, on restaure l'état précédent.
   */
  const savePref = async (
    patch: Partial<Pick<User, "notifications_enabled" | "language">>,
    call: () => Promise<User>,
  ) => {
    if (!rawUser || prefPending) return;
    const previous = rawUser;
    setPrefPending(true);
    useAuthStore.getState().setUser({ ...rawUser, ...patch });
    try {
      const updated = await call();
      useAuthStore.getState().setUser({ ...previous, ...updated });
    } catch (error) {
      logError("settings/preference", error);
      useAuthStore.getState().setUser(previous);
      useToastStore
        .getState()
        .addToast("Impossible d'enregistrer la préférence.", "error");
    } finally {
      setPrefPending(false);
    }
  };

  const aboutModalRef = useRef<HTMLDialogElement>(null);
  const deleteModalRef = useRef<HTMLDialogElement>(null);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await UserApi.deleteAccount();
      useAuthStore.getState().clearAuth();
      useToastStore.getState().addToast("Compte supprimé", "success");
      navigate("/auth");
    } catch (error) {
      logError("settings/delete-account", error);
      useToastStore
        .getState()
        .addToast("La suppression du compte a échoué.", "error");
      setIsDeleting(false);
      deleteModalRef.current?.close();
    }
  };

  return (
    <>
    <div className="flex-1 flex flex-col">
      <Header/>
      <PageContainer className="pt-3 space-y-2 flex-1 flex flex-col">
        <PageTitle
          title="Paramètres"
          description="Gérez votre compte et vos préférences"
          icon={Gear}
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
                  checked={notifications}
                  disabled={!rawUser || prefPending}
                  onChange={(e) => {
                    const next = e.target.checked;
                    void savePref({ notifications_enabled: next }, () =>
                      UserApi.updateNotifications(next),
                    );
                  }}
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
                  value={language}
                  disabled={!rawUser || prefPending}
                  onChange={(e) => {
                    const next = e.target.value;
                    void savePref({ language: next }, () =>
                      UserApi.updateLanguage(next),
                    );
                  }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </SettingsSection>

            <SettingsSection title="Sécurité">
              <SettingsItem
                icon={<Lock size={18} />}
                label="Mot de passe"
                onClick={() => navigate("/settings/password")}
              />
            </SettingsSection>

            <SettingsSection title="Support">
              <SettingsItem
                icon={<Question size={18} />}
                label="Centre d'aide"
                onClick={() => navigate("/settings/help")}
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
              disabled={deleteConfirmText !== "SUPPRIMER" || isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? "Suppression..." : "Supprimer définitivement"}
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