import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sparkle, X } from "@phosphor-icons/react";

import { FormPageLayout } from "../../components/Layout/FormPageLayout";
import { BTN_FOCUS_RING, INPUT_CLASS } from "../../constants/styles";
import { UserApi } from "../../api/user.api";
import { queryKeys } from "../../api/query-keys";
import { useToastStore } from "../../store/toast.store";
import { logError } from "../../utils/log";

export function ProfileSkillsEdit() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [skills, setSkills] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  const { data: initial = [], isPending } = useQuery({
    queryKey: queryKeys.skills.mine,
    queryFn: () => UserApi.getSkills(),
  });
  useEffect(() => {
    setSkills(initial);
  }, [initial]);

  const save = useMutation({
    mutationFn: (list: string[]) => UserApi.updateSkills(list),
    onSuccess: (saved) => {
      queryClient.setQueryData(queryKeys.skills.mine, saved);
      useToastStore.getState().addToast("Compétences enregistrées", "success");
      navigate("/profile");
    },
    onError: (error) => {
      logError("profil/skills", error);
      useToastStore.getState().addToast("L'enregistrement a échoué", "error");
    },
  });

  const addSkill = () => {
    const value = draft.trim();
    if (!value || skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      setDraft("");
      return;
    }
    setSkills((prev) => [...prev, value]);
    setDraft("");
  };

  const removeSkill = (name: string) =>
    setSkills((prev) => prev.filter((s) => s !== name));

  return (
    <FormPageLayout
      title="Modifier mes compétences"
      icon={Sparkle}
      backTo="/profile"
      backLabel="Retour au profil"
    >
      {isPending ? (
        <p className="text-sm text-base-content/60">Chargement…</p>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <p className="text-sm text-base-content/50">
                Aucune compétence pour l'instant.
              </p>
            ) : (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="badge badge-md bg-primary/10 text-primary border-none font-medium gap-1.5 py-1.5 px-3"
                >
                  {skill}
                  <button
                    type="button"
                    aria-label={`Retirer ${skill}`}
                    onClick={() => removeSkill(skill)}
                    className="hover:text-error"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ajouter une compétence..."
              className={INPUT_CLASS}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <button
              type="button"
              onClick={addSkill}
              className={`btn btn-secondary ${BTN_FOCUS_RING.secondary}`}
            >
              Ajouter
            </button>
          </div>

          <button
            type="button"
            onClick={() => save.mutate(skills)}
            disabled={save.isPending}
            className="btn btn-primary self-start"
          >
            Enregistrer
          </button>
        </div>
      )}
    </FormPageLayout>
  );
}
