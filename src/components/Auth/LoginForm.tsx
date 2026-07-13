import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "../../schemas/auth.schemas";
import { FieldError } from "./FieldError";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginValues) => {
    console.log("login", values);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="block">
        <span className="text-sm text-base-content/70 mb-1 block">Email</span>
        <input
          type="email"
          autoComplete="email"
          placeholder="jean.dupont@email.fr"
          className="input input-bordered border-base-content/20 focus:border-primary w-full"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </label>

      <label className="block">
        <span className="text-sm text-base-content/70 mb-1 block">
          Mot de passe
        </span>
        <input
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="input input-bordered border-base-content/20 focus:border-primary w-full"
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </label>

      <button type="submit" className="btn btn-primary w-full mt-2">
        Se connecter
      </button>
    </form>
  );
}
