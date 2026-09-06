import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Header } from "../components/Layout/Header";
import { Tabs } from "../components/Layout/Tabs";
import { PeopleCard } from "../components/Network/PeopleCard";
import { UserApi } from "../api/user.api";
import { useAuthStore } from "../store/auth.store";
import { useToastStore } from "../store/toast.store";
import type { User } from "../types/user.type";

function NavRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-base-200 bg-base-100 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-base-200"
    >
      <span className="font-medium text-base-content">{label}</span>
      <ArrowRight size={18} className="text-base-content/50" />
    </button>
  );
}

const notify = () =>
  useToastStore.getState().addToast("Bientôt disponible", "info");

export function Network() {
  const [tab, setTab] = useState<"grow" | "reconnect">("grow");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);

  const [people, setPeople] = useState<User[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus("ready");
      setPeople([]);
      return;
    }
    let cancelled = false;
    setStatus("loading");
    UserApi.getAll()
      .then((users) => {
        if (cancelled) return;
        setPeople(
          users.filter((u) => String(u.id) !== String(currentUser?.id)),
        );
        setStatus("ready");
      })
      .catch((error) => {
        console.error("Failed to load network suggestions", error);
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, currentUser?.id]);

  return (
    <div className="flex-1 flex flex-col bg-base-200 pb-6">
      <Header />

      <div className="border-b border-base-200 bg-base-100 px-4 pt-3 pb-3">
        <Tabs
          items={[
            { key: "grow", label: "Développer" },
            { key: "reconnect", label: "Reprendre contact" },
          ]}
          value={tab}
          onChange={setTab}
          variant="onMuted"
        />
      </div>

      {tab === "reconnect" ? (
        <p className="p-8 text-center text-sm text-base-content/60">
          Bientôt : reprenez contact avec vos relations inactives.
        </p>
      ) : (
        <>
          <div className="mt-2 bg-base-100">
            <NavRow label="Invitations" onClick={notify} />
            <NavRow label="Gérer mon réseau" onClick={notify} />
          </div>

          <section className="mt-2 bg-base-100 px-4 py-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-warning">
              <span className="inline-block h-2.5 w-2.5 rounded-sm bg-warning" />
              Premium
            </p>
            <h2 className="mt-1 text-lg font-bold text-base-content">
              Personnes qui recrutent à votre poste
            </h2>

            {!isAuthenticated ? (
              <p className="py-6 text-sm text-base-content/60">
                Connectez-vous pour voir des suggestions.
              </p>
            ) : status === "loading" ? (
              <p className="py-6 text-sm text-base-content/60">Chargement…</p>
            ) : status === "error" ? (
              <p className="py-6 text-sm text-base-content/60">
                Impossible de charger les suggestions.
              </p>
            ) : people.length === 0 ? (
              <p className="py-6 text-sm text-base-content/60">
                Aucune suggestion pour l'instant.
              </p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3">
                {people.slice(0, 12).map((user, index) => (
                  <PeopleCard
                    key={user.id}
                    user={user}
                    index={index}
                    onAction={notify}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
