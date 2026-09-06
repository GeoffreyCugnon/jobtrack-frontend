import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, UserRound } from "@/lib/icons";
import { Header } from "../../components/Layout/Header";
import { INPUT_CLASS, TEXTAREA_CLASS } from "../../constants/styles";
import { useAuthStore } from "../../store/auth.store";
import { getUserDisplay } from "../../utils/user-display";

export function ProfileEdit() {
  const navigate = useNavigate();
  const { firstName, lastName } = getUserDisplay(
    useAuthStore((state) => state.user),
  );
  const [values, setValues] = useState({
    firstName,
    lastName,
    title: "Développeur Web Junior",
    location: "Paris, France",
    bio: "Développeur web passionné en reconversion, spécialisé React et Node.js. À la recherche d'opportunités en startup ou scale-up pour contribuer à des projets ambitieux.",
    availability: "Disponible immédiatement",
    jobType: "CDI · Freelance",
    salary: "35-45k€",
  });

  const handleChange =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: brancher sur PATCH /user/profile
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
                <UserRound size={18} />
              </div>
              <h1 className="text-lg font-semibold">Modifier mon profil</h1>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm text-base-content/70 mb-1 block">
                    Prénom
                  </span>
                  <input
                    type="text"
                    className={INPUT_CLASS}
                    value={values.firstName}
                    onChange={handleChange("firstName")}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-base-content/70 mb-1 block">
                    Nom
                  </span>
                  <input
                    type="text"
                    className={INPUT_CLASS}
                    value={values.lastName}
                    onChange={handleChange("lastName")}
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  Titre
                </span>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={values.title}
                  onChange={handleChange("title")}
                />
              </label>

              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  Localisation
                </span>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={values.location}
                  onChange={handleChange("location")}
                />
              </label>

              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  Bio
                </span>
                <textarea
                  rows={3}
                  className={TEXTAREA_CLASS}
                  value={values.bio}
                  onChange={handleChange("bio")}
                />
              </label>

              <label className="block">
                <span className="text-sm text-base-content/70 mb-1 block">
                  Disponibilité
                </span>
                <input
                  type="text"
                  className={INPUT_CLASS}
                  value={values.availability}
                  onChange={handleChange("availability")}
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm text-base-content/70 mb-1 block">
                    Type de contrat
                  </span>
                  <input
                    type="text"
                    className={INPUT_CLASS}
                    value={values.jobType}
                    onChange={handleChange("jobType")}
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-base-content/70 mb-1 block">
                    Salaire
                  </span>
                  <input
                    type="text"
                    className={INPUT_CLASS}
                    value={values.salary}
                    onChange={handleChange("salary")}
                  />
                </label>
              </div>

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
