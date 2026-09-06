import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { signupSchema, type SignupValues } from "../../schemas/auth.schemas";
import { FieldError } from "./FieldError";
import { BTN_FOCUS_RING, INPUT_CLASS } from "../../constants/styles";
import { AuthApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";

export function SignupForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupValues) => {
    const fullName = values.name.trim();
    const parts = fullName.split(/\s+/).filter(Boolean);

    const first_name = parts[0] ?? "";
    const last_name = parts.slice(1).join(" ") || "User";

    try {
      await AuthApi.register({
        first_name,
        last_name,
        email: values.email,
        password: values.password,
      });

      const loginResponse = await AuthApi.login({
        email: values.email,
        password: values.password,
      });

      useAuthStore.getState().setUser(loginResponse.user);
      useAuthStore.getState().setAccessToken(loginResponse.accessToken);
      useToastStore.getState().addToast("Compte créé et connecté", "success");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup failed", error);
      useToastStore
        .getState()
        .addToast("Impossible de créer le compte", "error");
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="block">
        <span className="text-sm text-base-content/70 mb-1 block">
          Nom complet
        </span>
        <input
          type="text"
          autoComplete="name"
          placeholder="Jean Dupont"
          className={INPUT_CLASS}
          {...register("name")}
        />
        <FieldError error={errors.name} />
      </label>

      <label className="block">
        <span className="text-sm text-base-content/70 mb-1 block">Email</span>
        <input
          type="email"
          autoComplete="email"
          placeholder="jean.dupont@email.fr"
          className={INPUT_CLASS}
          {...register("email")}
        />
        <FieldError error={errors.email} />
      </label>

      <label className="block">
        <span className="text-sm text-base-content/70 mb-1 block">
          Mot de passe
        </span>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={INPUT_CLASS}
          {...register("password")}
        />
        <FieldError error={errors.password} />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn btn-primary w-full mt-2 ${BTN_FOCUS_RING.primary}`}
      >
        {isSubmitting ? "Création..." : "Créer mon compte"}
      </button>
    </form>
  );
}
