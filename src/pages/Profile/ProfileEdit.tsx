import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { User } from "@phosphor-icons/react";
import { FormPageLayout } from "../../components/Layout/FormPageLayout";
import { FieldError } from "../../components/Auth/FieldError";
import { INPUT_CLASS, TEXTAREA_CLASS } from "../../constants/styles";
import { profileSchema, type ProfileValues } from "../../schemas/profile.schemas";
import { UserApi } from "../../api/user.api";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import { getUserDisplay } from "../../utils/user-display";
import { logError } from "../../utils/log";

export function ProfileEdit() {
  const navigate = useNavigate();
  const rawUser = useAuthStore((state) => state.user);
  const display = getUserDisplay(rawUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: display.firstName,
      lastName: display.lastName,
      headline: display.headline,
      location: display.location,
      bio: display.bio,
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    try {
      const updated = await UserApi.updateProfile({
        first_name: values.firstName,
        last_name: values.lastName,
        headline: values.headline,
        location: values.location,
        bio: values.bio,
      });
      useAuthStore.getState().setUser(updated);
      useToastStore.getState().addToast("Profil mis à jour", "success");
      navigate("/profile");
    } catch (error) {
      logError("profil/update", error);
      useToastStore
        .getState()
        .addToast("La mise à jour du profil a échoué", "error");
    }
  };

  return (
    <FormPageLayout title="Modifier mon profil" icon={User} backTo="/profile" backLabel="Retour au profil">
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-base-content/70 mb-1 block">
              Prénom
            </span>
            <input
              type="text"
              className={INPUT_CLASS}
              {...register("firstName")}
            />
            <FieldError error={errors.firstName} />
          </label>
          <label className="block">
            <span className="text-sm text-base-content/70 mb-1 block">Nom</span>
            <input type="text" className={INPUT_CLASS} {...register("lastName")} />
            <FieldError error={errors.lastName} />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-base-content/70 mb-1 block">
            Titre (ex. « Développeur Web Junior »)
          </span>
          <input type="text" className={INPUT_CLASS} {...register("headline")} />
          <FieldError error={errors.headline} />
        </label>

        <label className="block">
          <span className="text-sm text-base-content/70 mb-1 block">
            Localisation
          </span>
          <input type="text" className={INPUT_CLASS} {...register("location")} />
          <FieldError error={errors.location} />
        </label>

        <label className="block">
          <span className="text-sm text-base-content/70 mb-1 block">Bio</span>
          <textarea rows={3} className={TEXTAREA_CLASS} {...register("bio")} />
          <FieldError error={errors.bio} />
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
