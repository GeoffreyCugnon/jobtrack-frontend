import { HelpCircle } from "@/lib/icons";
import { FormPageLayout } from "../../components/Layout/FormPageLayout";

const FAQ: { q: string; a: string }[] = [
  {
    q: "Comment suivre mes candidatures ?",
    a: "Depuis « Offres », ouvrez une offre puis postulez : elle apparaît dans « Candidatures actives » avec son statut. Chaque entretien planifié la fait passer en « Entretien prévu ».",
  },
  {
    q: "Où gérer mes CV et lettres ?",
    a: "Onglet « Documents ». Vous pouvez créer, renommer et supprimer vos CV et lettres. L'aperçu du fichier arrivera avec l'upload de documents.",
  },
  {
    q: "Comment modifier mon profil public ?",
    a: "« Mon profil » → « Modifier ». Le titre, la localisation, la bio, les contacts et les compétences sont visibles par les recruteurs.",
  },
  {
    q: "Je ne reçois pas l'email de réinitialisation de mot de passe.",
    a: "Vérifiez vos indésirables. En environnement de démo, le lien de réinitialisation est écrit dans les logs du serveur.",
  },
];

export function SettingsHelp() {
  return (
    <FormPageLayout
      title="Centre d'aide"
      icon={HelpCircle}
      backTo="/settings"
      backLabel="Retour aux paramètres"
    >
      <div className="divide-y divide-base-200">
        {FAQ.map(({ q, a }) => (
          <div key={q} className="py-3 first:pt-0 last:pb-0">
            <p className="text-sm font-semibold text-base-content">{q}</p>
            <p className="mt-1 text-sm text-base-content/70">{a}</p>
          </div>
        ))}
      </div>
    </FormPageLayout>
  );
}
