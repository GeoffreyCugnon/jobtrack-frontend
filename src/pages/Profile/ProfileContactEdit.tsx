import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Contact as ContactIcon } from "lucide-react";
import { Header } from "../../components/Layout/Header";
import { INPUT_CLASS } from "../../constants/styles";
import { useAuthStore } from "../../store/auth.store";
import { getUserDisplay } from "../../utils/user-display";

export function ProfileContactEdit() {
  const navigate = useNavigate();
  const { email } = getUserDisplay(useAuthStore((state) => state.user));
  const [values, setValues] = useState({
    email,
    phone: "+33 6 12 34 56 78",
    website: "geoffreycugnon.dev",
    linkedin: "linkedin.com/in/gcugnon",
    github: "github.com/github",
  });

  const handleChange =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: brancher sur PATCH /user/contact
    navigate("/profile");
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate("/profile")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          Retour au profil
        </button>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ContactIcon size={18} />
              </div>
              <h1 className="text-lg font-semibold">Modifier mes contacts</h1>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  Email
                </span>
                <input
                  type="email"
                  className={INPUT_CLASS}
                  value={values.email}
                  onChange={handleChange("email")}
                />
              </label>

              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  Téléphone
                </span>
                <input
                  type="tel"
                  className={INPUT_CLASS}
                  value={values.phone}
                  onChange={handleChange("phone")}
                />
              </label>

              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  Site web
                </span>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={values.website}
                  onChange={handleChange("website")}
                />
              </label>

              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  LinkedIn
                </span>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={values.linkedin}
                  onChange={handleChange("linkedin")}
                />
              </label>

              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  GitHub
                </span>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={values.github}
                  onChange={handleChange("github")}
                />
              </label>

              <button type="submit" className="btn btn-primary mt-2">
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
