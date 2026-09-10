import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { Contact as ContactIcon } from "@/lib/icons";
import { FormPageLayout } from "../../components/Layout/FormPageLayout";
import { FieldError } from "../../components/Auth/FieldError";
import { INPUT_CLASS } from "../../constants/styles";
import { contactSchema, type ContactValues } from "../../schemas/profile.schemas";
import { UserApi } from "../../api/user.api";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import { getUserDisplay } from "../../utils/user-display";
import { logError } from "../../utils/log";

export function ProfileContactEdit() {
  const navigate = useNavigate();
  const rawUser = useAuthStore((state) => state.user);
  const display = getUserDisplay(rawUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: display.phone,
      website: display.website,
      linkedin: display.linkedin,
      github: display.github,
    },
  });

  const onSubmit = async (values: ContactValues) => {
    try {
      const updated = await UserApi.updateProfile(values);
      useAuthStore.getState().setUser(updated);
      useToastStore.getState().addToast("Contacts mis à jour", "success");
      navigate("/profile");
    } catch (error) {
      logError("profil/contact", error);
      useToastStore
        .getState()
        .addToast("La mise à jour des contacts a échoué", "error");
    }
  };

  return (
    <FormPageLayout
      title="Modifier mes contacts"
      icon={ContactIcon}
      backTo="/profile"
      backLabel="Retour au profil"
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label className="block">
          <span className="text-sm text-base-content/70 mb-1 block">Email</span>
          <input
            type="email"
            className={`${INPUT_CLASS} opacity-60`}
            value={display.email}
            readOnly
          />
          <span className="text-xs text-base-content/50 mt-1 block">
            L'adresse email est liée à la connexion et ne se modifie pas ici.
          </span>
        </label>

        <label className="block">
          <span className="text-sm text-base-content/70 mb-1 block">
            Téléphone
          </span>
          <input type="tel" className={INPUT_CLASS} {...register("phone")} />
          <FieldError error={errors.phone} />
        </label>

        <label className="block">
          <span className="text-sm text-base-content/70 mb-1 block">
            Site web
          </span>
          <input type="text" className={INPUT_CLASS} {...register("website")} />
          <FieldError error={errors.website} />
        </label>

        <label className="block">
          <span className="text-sm text-base-content/70 mb-1 block">
            LinkedIn
          </span>
          <input type="text" className={INPUT_CLASS} {...register("linkedin")} />
          <FieldError error={errors.linkedin} />
        </label>

        <label className="block">
          <span className="text-sm text-base-content/70 mb-1 block">GitHub</span>
          <input type="text" className={INPUT_CLASS} {...register("github")} />
          <FieldError error={errors.github} />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary mt-2"
        >
          Enregistrer
        </button>
      </form>
    </FormPageLayout>
  );
}
