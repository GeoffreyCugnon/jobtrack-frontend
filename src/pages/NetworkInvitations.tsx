import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, RotateCw, UserPlus, X } from "lucide-react";

import { Header } from "../components/Layout/Header";
import { Tabs } from "../components/Layout/Tabs";
import { Avatar } from "../components/UI/Avatar";
import { EmptyState } from "../components/Layout/EmptyState";
import {
  ConnectionApi,
  type ConnectionEntry,
} from "../api/connection.api";
import { queryKeys } from "../api/query-keys";
import { useToastStore } from "../store/toast.store";
import {
  memberHeadline,
  memberInitials,
  memberMutualCount,
  memberName,
} from "../utils/member";

type Tab = "received" | "sent";

export function NetworkInvitations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("received");

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.connections.all,
    queryFn: () => ConnectionApi.list(),
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: queryKeys.connections.all });

  const acceptMut = useMutation({
    mutationFn: (userId: string | number) => ConnectionApi.accept(userId),
    onSuccess: () => {
      useToastStore.getState().addToast("Invitation acceptée", "success");
      invalidate();
    },
    onError: () =>
      useToastStore.getState().addToast("Une erreur est survenue", "error"),
  });

  const removeMut = useMutation({
    mutationFn: (userId: string | number) => ConnectionApi.remove(userId),
    onSuccess: invalidate,
    onError: () =>
      useToastStore.getState().addToast("Une erreur est survenue", "error"),
  });

  const busy = acceptMut.isPending || removeMut.isPending;

  const received: ConnectionEntry[] = data?.incoming ?? [];
  const sent: ConnectionEntry[] = data?.outgoing ?? [];
  const list = tab === "received" ? received : sent;

  return (
    <div className="flex-1 flex flex-col bg-base-200">
      <Header />

      <div className="flex items-center gap-3 border-b border-base-200 bg-base-100 px-4 py-4">
        <button
          type="button"
          aria-label="Retour"
          onClick={() => navigate("/network")}
          className="text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-base-content">
          Gestionnaire d'invitations
        </h1>
      </div>

      <div className="border-b border-base-200 bg-base-100 px-4 py-3">
        <Tabs<Tab>
          items={[
            { key: "received", label: `Reçues (${received.length})` },
            { key: "sent", label: `Envoyées (${sent.length})` },
          ]}
          value={tab}
          onChange={setTab}
          variant="onMuted"
        />
      </div>

      {isPending ? (
        <p className="bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Chargement…
        </p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 bg-base-100 p-6 text-center">
          <p className="text-sm text-base-content/60">
            Impossible de charger les invitations.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="btn btn-sm btn-outline gap-2"
          >
            <RotateCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-base-100 p-10">
          <EmptyState
            icon={UserPlus}
            message={
              tab === "received"
                ? "Aucune invitation reçue pour le moment."
                : "Vous n'avez aucune invitation en attente."
            }
          />
        </div>
      ) : (
        <ul className="divide-y divide-base-200 bg-base-100">
          {list.map(({ user }) => (
            <li key={user.id} className="flex items-start gap-3 px-4 py-4">
              <Link to={`/members/${user.id}`} className="shrink-0">
                <Avatar
                  label={memberInitials(user)}
                  avatarUrl={user.avatar_url ?? undefined}
                  size="lg"
                />
              </Link>

              <div className="min-w-0 flex-1 leading-tight">
                <Link
                  to={`/members/${user.id}`}
                  className="line-clamp-1 font-semibold text-base-content hover:underline"
                >
                  {memberName(user)}
                </Link>
                <p className="mt-0.5 line-clamp-2 text-sm text-base-content/70">
                  {memberHeadline(user)}
                </p>
                <p className="mt-1 text-xs text-base-content/50">
                  {memberMutualCount(user)} relations en commun
                </p>
              </div>

              {tab === "received" ? (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label="Ignorer l'invitation"
                    onClick={() => removeMut.mutate(user.id)}
                    disabled={busy}
                    className="btn btn-circle btn-sm btn-outline border-base-300 text-base-content/60"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Accepter l'invitation"
                    onClick={() => acceptMut.mutate(user.id)}
                    disabled={busy}
                    className="btn btn-circle btn-sm btn-outline btn-primary"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => removeMut.mutate(user.id)}
                  disabled={busy}
                  className="btn btn-outline btn-sm shrink-0 rounded-full"
                >
                  Annuler
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
