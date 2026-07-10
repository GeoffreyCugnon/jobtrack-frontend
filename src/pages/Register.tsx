// SignUpForm.tsx
import { useState } from "react";
import { Link } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

type UserRole = "candidat" | "entreprise";

interface SignUpValues {
    nom: string;
    prenom: string;
    email: string;
    password: string;
}

const initialValues: SignUpValues = {
    nom: "",
    prenom: "",
    email: "",
    password: "",
};

const validationSchema = Yup.object({
    nom: Yup.string().min(2, "Trop court").required("Le nom est requis"),
    prenom: Yup.string().min(2, "Trop court").required("Le prénom est requis"),
    email: Yup.string()
        .email("Adresse e-mail invalide")
        .required("L'adresse e-mail est requise"),
    password: Yup.string()
        .min(8, "8 caractères minimum")
        .required("Le mot de passe est requis"),
});

function getPasswordStrength(password: string): {
    level: number; // 0 à 3
    label: string;
} {
    if (password.length === 0) return { level: 0, label: "" };
    if (password.length < 8) return { level: 1, label: "Faible" };

    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (score >= 2) return { level: 3, label: "Fort" };
    if (score === 1) return { level: 2, label: "Moyen" };
    return { level: 1, label: "Faible" };
}

export default function Register() {
    const [role, setRole] = useState<UserRole>("candidat");

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-bg-main p-4">
                <div className="w-full  rounded-2xl border border-bg-card bg-bg-card/40 p-6">
                    {/* Logo + nom app */}
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs text-txt-body">
                            Logo
                        </div>
                        <span className="font-semibold text-txt-title">
                            nameApp
                        </span>
                    </div>

                    {/* Titres */}
                    <h1 className="text-xl font-semibold text-txt-title">
                        Créer un compte
                    </h1>
                    <p className="mb-6 text-sm text-txt-body">
                        Rejoignez le réseau pro
                    </p>

                    {/* Toggle rôle */}
                    <div className="mb-6 flex gap-2">
                        <button
                            type="button"
                            onClick={() => setRole("candidat")}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                role === "candidat"
                                    ? "bg-primary text-white"
                                    : "border border-bg-card text-txt-body hover:bg-bg-card"
                            }`}
                        >
                            Candidat
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("entreprise")}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                role === "entreprise"
                                    ? "bg-primary text-white"
                                    : "border border-bg-card text-txt-body hover:bg-bg-card"
                            }`}
                        >
                            Entreprise
                        </button>
                    </div>

                    {/* Photo de profil */}
                    <div className="mb-6 flex justify-center">
                        <button
                            type="button"
                            className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-xs text-txt-body hover:bg-accent/20 transition-colors"
                        >
                            photo
                        </button>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => {
                            console.log("Payload inscription :", {
                                ...values,
                                role,
                            });
                            // TODO: appel API (AuthService)
                        }}
                    >
                        {({ values }) => {
                            const strength = getPasswordStrength(values.password);

                            return (
                                <Form className="space-y-4">
                                    {/* Nom / Prénom */}
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <label className="mb-1 block text-xs text-txt-body">
                                                Nom
                                            </label>
                                            <Field
                                                name="nom"
                                                type="text"
                                                placeholder="exemple@mail.fr"
                                                className="w-full rounded-lg border border-bg-card bg-bg-main px-3 py-2 text-sm text-txt-title placeholder:text-txt-body/60 focus:border-primary focus:outline-none"
                                            />
                                            <ErrorMessage
                                                name="nom"
                                                component="p"
                                                className="mt-1 text-xs text-error"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="mb-1 block text-xs text-txt-body">
                                                Prénom
                                            </label>
                                            <Field
                                                name="prenom"
                                                type="text"
                                                placeholder="exemple@mail.fr"
                                                className="w-full rounded-lg border border-bg-card bg-bg-main px-3 py-2 text-sm text-txt-title placeholder:text-txt-body/60 focus:border-primary focus:outline-none"
                                            />
                                            <ErrorMessage
                                                name="prenom"
                                                component="p"
                                                className="mt-1 text-xs text-error"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="mb-1 block text-xs text-txt-body">
                                            Adresse e-mail
                                        </label>
                                        <Field
                                            name="email"
                                            type="email"
                                            placeholder="exemple@mail.fr"
                                            className="w-full rounded-lg border border-bg-card bg-bg-main px-3 py-2 text-sm text-txt-title placeholder:text-txt-body/60 focus:border-primary focus:outline-none"
                                        />
                                        <ErrorMessage
                                            name="email"
                                            component="p"
                                            className="mt-1 text-xs text-error"
                                        />
                                    </div>

                                    {/* Mot de passe */}
                                    <div>
                                        <label className="mb-1 block text-xs text-txt-body">
                                            Mot de passe
                                        </label>
                                        <Field
                                            name="password"
                                            type="password"
                                            placeholder="8 + Caractères"
                                            className="w-full rounded-lg border border-bg-card bg-bg-main px-3 py-2 text-sm text-txt-title placeholder:text-txt-body/60 focus:border-primary focus:outline-none"
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="p"
                                            className="mt-1 text-xs text-error"
                                        />

                                        {/* Barre de force */}
                                        {values.password.length > 0 && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="flex h-1.5 flex-1 gap-1">
                                                    <div
                                                        className={`flex-1 rounded-full ${
                                                            strength.level >= 1
                                                                ? "bg-primary"
                                                                : "bg-bg-card"
                                                        }`}
                                                    />
                                                    <div
                                                        className={`flex-1 rounded-full ${
                                                            strength.level >= 2
                                                                ? "bg-accent"
                                                                : "bg-bg-card"
                                                        }`}
                                                    />
                                                    <div
                                                        className={`flex-1 rounded-full ${
                                                            strength.level >= 3
                                                                ? "bg-secondary"
                                                                : "bg-bg-card"
                                                        }`}
                                                    />
                                                </div>
                                                <span className="text-xs text-txt-body">
                                                    {strength.label}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bouton principal */}
                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                                    >
                                        Créer mon compte
                                    </button>
                                </Form>
                            );
                        }}
                    </Formik>

                    {/* Lien connexion */}
                    <p className="mt-4 text-center text-sm text-txt-body">
                        Déjà un compte ?{" "}
                        <Link to="/login" className="text-primary hover:underline">
                            Se connecter
                        </Link>
                    </p>

                    {/* CGU */}
                    <p className="mt-6 text-center text-xs text-txt-body/70">
                        En vous inscrivant vous acceptez les conditions
                        d'utilisation.
                    </p>
                </div>
            </div>
        </>
    );
}
