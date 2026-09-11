import { useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, X } from "@phosphor-icons/react";

import { Header } from "../components/Layout/Header";
import { Avatar } from "../components/UI/Avatar";
import { PeopleCard } from "../components/Network/PeopleCard";
import { UserApi } from "../api/user.api";
import {
  ConnectionApi,
  connectionStatusByUser,
  type ConnectionEntry,
  type ConnectionStatus,
} from "../api/connection.api";
import { queryKeys } from "../api/query-keys";
import { useAuthStore } from "../store/auth.store";
import { useToastStore } from "../store/toast.store";
import {
  memberHeadline,
  memberInitials,
  memberMutualCount,
  memberName,
  memberSharedCompany,
  memberSharedSkills,
} from "../utils/member";
import type { User } from "../types/user.type";

const PER_SECTION = 4;
// Nombre max d'invitations reçues affichées dans la section dédiée de la page
// (le compteur du header et la pastille « Invitations » donnent le total).
const MAX_INVITATIONS = 5;

const toast = (message: string, type: "info" | "success" | "error" = "info") =>
  useToastStore.getState().addToast(message, type);

function NavRow({
  label,
  count,
  onClick,
}: {
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-base-200 bg-base-100 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-base-200"
    >
      <span className="font-medium text-base-content">
        {label}
        {count ? (
          <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-content">
            {count}
          </span>
        ) : null}
      </span>
      <ArrowRight size={18} className="text-base-content/50" />
    </button>
  );
}

// Rotation du même pool d'utilisateurs pour éviter d'afficher exactement
// les mêmes personnes dans chaque section quand la base est petite.
function rotate<T>(arr: T[], offset: number): T[] {
  if (arr.length === 0) return arr;
  const n = offset % arr.length;
  return arr.slice(n).concat(arr.slice(0, n));
}

interface SectionConfig {
  key: string;
  title: string;
  description?: string;
  hiring?: boolean;
  caption: (user: User, index: number) => string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: "hiring",
    hiring: true,
    title: "Personnes qui recrutent à votre poste",
    caption: (user, index) => memberHeadline(user, index),
  },
  {
    key: "mutual",
    title: "Personnes que vous pourriez connaître",
    description: "D'après vos relations en commun",
    caption: (user) => `${memberMutualCount(user)} relations en commun`,
  },
  {
    key: "activity",
    title: "En fonction de votre activité récente",
    description: "Entreprises et publications que vous suivez",
    caption: (user) => `Suit aussi ${memberSharedCompany(user)}`,
  },
  {
    key: "personalized",
    title: "Suggestions personnalisées",
    description: "Compétences et intitulé de poste en commun",
    caption: (user) =>
      `Compétences communes · ${memberSharedSkills(user).join(", ")}`,
  },
];

const ACTION_LABEL: Record<ConnectionStatus, string> = {
  none: "Se connecter",
  pending_out: "Invitation envoyée",
  pending_in: "Accepter",
  connected: "Relation",
};

export function Network() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { data: users, isPending, isError } = useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => UserApi.getAll(),
    enabled: isAuthenticated,
  });

  const { data: connections } = useQuery({
    queryKey: queryKeys.connections.all,
    queryFn: () => ConnectionApi.list(),
    enabled: isAuthenticated,
  });

  const statusByUser = connections
    ? connectionStatusByUser(connections)
    : undefined;
  const incoming: ConnectionEntry[] = connections?.incoming ?? [];

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.connections.all });
  };

  const requestMut = useMutation({
    mutationFn: (userId: User["id"]) => ConnectionApi.request(userId),
    onSuccess: () => {
      toast("Invitation envoyée", "success");
      invalidate();
    },
    onError: () => toast("Impossible d'envoyer l'invitation", "error"),
  });

  const acceptMut = useMutation({
    mutationFn: (userId: User["id"]) => ConnectionApi.accept(userId),
    onSuccess: () => {
      toast("Invitation acceptée", "success");
      invalidate();
    },
    onError: () => toast("Impossible d'accepter l'invitation", "error"),
  });

  const removeMut = useMutation({
    mutationFn: (userId: User["id"]) => ConnectionApi.remove(userId),
    onSuccess: () => invalidate(),
    onError: () => toast("Une erreur est survenue", "error"),
  });

  const busy =
    requestMut.isPending || acceptMut.isPending || removeMut.isPending;

  // Suggestions : on exclut soi-même, ainsi que les personnes déjà en
  // relation ou dont l'invitation est en attente de MA réponse (traitées
  // dans la section « Invitations reçues »).
  const people = (users ?? []).filter((u) => {
    if (String(u.id) === String(currentUser?.id)) return false;
    const st = statusByUser?.get(u.id);
    return st !== "connected" && st !== "pending_in";
  });

  function cardAction(user: User) {
    const status = statusByUser?.get(user.id) ?? "none";
    return {
      actionLabel: ACTION_LABEL[status],
      actionDisabled: busy || status === "pending_out",
      onAction: () => {
        if (status === "none") requestMut.mutate(user.id);
        else if (status === "pending_in") acceptMut.mutate(user.id);
      },
    };
  }

  return (
    <div className="flex-1 flex flex-col bg-base-200 pb-6">
      <Header />

      <div className="mt-2 bg-base-100">
        <NavRow
          label="Invitations"
          count={incoming.length}
          onClick={() => navigate("/network/invitations")}
        />
        <NavRow
          label="Gérer mon réseau"
          count={connections?.connections.length}
          onClick={() => navigate("/network/manage")}
        />
      </div>

      {incoming.length > 0 && (
        <section className="mt-2 bg-base-100 px-4 py-4">
          <h2 className="text-lg font-bold text-base-content">
            Invitations reçues ({incoming.length})
          </h2>
          {/* Liste plate des invitations en attente : pas de sous-groupe
              « Vérifiés » / « Relations en commun » comme sur LinkedIn. */}
          <ul className="mt-3 divide-y divide-base-200">
            {incoming.slice(0, MAX_INVITATIONS).map(({ user }) => (
              <li key={user.id} className="flex items-center gap-3 py-3">
                <Avatar
                  label={memberInitials(user)}
                  avatarUrl={user.avatar_url ?? undefined}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-semibold text-base-content">
                    {memberName(user)}
                  </p>
                  <p className="line-clamp-1 text-xs text-base-content/60">
                    {user.email}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Accepter l'invitation"
                  onClick={() => acceptMut.mutate(user.id)}
                  disabled={busy}
                  className="btn btn-primary btn-sm gap-1"
                >
                  <Check className="h-4 w-4" />
                  Accepter
                </button>
                <button
                  type="button"
                  aria-label="Ignorer l'invitation"
                  onClick={() => removeMut.mutate(user.id)}
                  disabled={busy}
                  className="btn btn-ghost btn-sm btn-square"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          {incoming.length > MAX_INVITATIONS && (
            <button
              type="button"
              onClick={() => navigate("/network/invitations")}
              className="mt-3 flex items-center gap-1 text-sm font-semibold text-link hover:underline"
            >
              Voir les {incoming.length} invitations
              <ArrowRight size={16} />
            </button>
          )}
        </section>
      )}

      {!isAuthenticated ? (
        <p className="mt-2 bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Connectez-vous pour voir des suggestions.
        </p>
      ) : isPending ? (
        <p className="mt-2 bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Chargement…
        </p>
      ) : isError ? (
        <p className="mt-2 bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Impossible de charger les suggestions.
        </p>
      ) : people.length === 0 ? (
        <p className="mt-2 bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Aucune suggestion pour l'instant.
        </p>
      ) : (
        SECTIONS.map((config, i) => {
          const slice = rotate(people, i * PER_SECTION).slice(0, PER_SECTION);
          if (slice.length === 0) return null;
          return (
            <section key={config.key} className="mt-2 bg-base-100">
              <div className="px-4 pt-4">
                <h2 className="text-lg font-bold text-base-content">
                  {config.title}
                </h2>
                {config.description && (
                  <p className="mt-0.5 text-sm text-base-content/60">
                    {config.description}
                  </p>
                )}

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {slice.map((user, index) => (
                    <PeopleCard
                      key={user.id}
                      user={user}
                      index={index}
                      hiring={Boolean(config.hiring)}
                      caption={config.caption(user, index)}
                      {...cardAction(user)}
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => toast("Bientôt disponible")}
                className="mt-4 flex w-full items-center justify-center gap-1.5 border-t border-base-200 px-4 py-3 text-sm font-semibold text-link transition-colors hover:bg-base-200"
              >
                Tout afficher
                <ArrowRight size={16} />
              </button>
            </section>
          );
        })
      )}
    </div>
  );
}
