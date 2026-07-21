import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Lock } from "lucide-react";
import { Header } from "../../components/Header";
import { FieldError } from "../../components/Auth/FieldError";
import { changePasswordSchema, type ChangePasswordValues } from "../../schemas/settings.schemas";
import { SettingsModal } from "../../components/Settings/SettingsModal";

export function SettingsPassword() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const successModalRef = useRef<HTMLDialogElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });

  //underscore à retier une fois l'appel API effectuer
  const onSubmit = async (_values: ChangePasswordValues) => {
    setServerError(null);
    try {
      // TODO: brancher sur PATCH /user/password
      // await api.patch("/user/password", values);
      successModalRef.current?.showModal();
    } catch (err) {
      setServerError("Une erreur est survenue. Vérifie ton mot de passe actuel.");
    }
  };

  return (
    <>
      <Header title="Mot de passe" />
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
            <Lock size={18} />
          </div>
          <h1 className="text-lg font-semibold">Changer le mot de passe</h1>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block">
            <span className="text-sm text-base-content/70 mb-1 block">
              Mot de passe actuel
            </span>
            <input
              type="password"
              autoComplete="current-password"
              className="input input-bordered border-base-content/20 focus:border-primary w-full"
              {...register("currentPassword")}
            />
            <FieldError message={errors.currentPassword?.message} />
          </label>

          <label className="block">
            <span className="text-sm text-base-content/70 mb-1 block">
              Nouveau mot de passe
            </span>
            <input
              type="password"
              autoComplete="new-password"
              className="input input-bordered border-base-content/20 focus:border-primary w-full"
              {...register("newPassword")}
            />
            <FieldError message={errors.newPassword?.message} />
          </label>

          <label className="block">
            <span className="text-sm text-base-content/70 mb-1 block">
              Confirmer le nouveau mot de passe
            </span>
            <input
              type="password"
              autoComplete="new-password"
              className="input input-bordered border-base-content/20 focus:border-primary w-full"
              {...register("confirmPassword")}
            />
            <FieldError message={errors.confirmPassword?.message} />
          </label>

          {serverError && <p className="text-sm text-error">{serverError}</p>}

          <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
      </div>

      <SettingsModal modalRef={successModalRef} title="Mot de passe mis à jour">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <CheckCircle2 className="text-success" size={40} />
          <p className="text-sm text-base-content/70">
            Ton mot de passe a bien été modifié.
          </p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => navigate("/app/settings")}
          >
            Retour aux paramètres
          </button>
        </div>
      </SettingsModal>
    </>
  );
}