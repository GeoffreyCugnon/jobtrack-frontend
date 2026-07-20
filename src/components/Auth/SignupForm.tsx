import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupValues } from "../../schemas/auth.schemas";
import { FieldError } from "./FieldError";

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = (values: SignupValues) => {
    console.log("signup", values);
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
          className="input input-bordered border-base-content/20 focus:border-primary w-full"
          {...register("name")}
        />
        <FieldError error={errors.password} />
      </label>

      <label className="block">
        <span className="text-sm text-base-content/70 mb-1 block">Email</span>
        <input
          type="email"
          autoComplete="email"
          placeholder="jean.dupont@email.fr"
          className="input input-bordered border-base-content/20 focus:border-primary w-full"
          {...register("email")}
        />
        <FieldError error={errors.password} />
      </label>

      <label className="block">
        <span className="text-sm text-base-content/70 mb-1 block">
          Mot de passe
        </span>
        <input
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className="input input-bordered border-base-content/20 focus:border-primary w-full"
          {...register("password")}
        />
        <FieldError error={errors.password} />
      </label>

      <button
        type="submit"
        className="btn btn-primary w-full mt-2 border border-primary-content/20 focus:border-primary-content/40"
      >
        Créer mon compte
      </button>
    </form>
  );
}
