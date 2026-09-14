import { Link, useNavigate } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowClockwise, ArrowLeft, Users } from "@phosphor-icons/react";

import { Avatar } from "../components/UI/Avatar";
import { EmptyState } from "../components/Layout/EmptyState";
import { ConnectionApi } from "../api/connection.api";
import { queryKeys } from "../api/query-keys";
import { staleTimeByCategory } from "../api/query-cache";
import { useToastStore } from "../store/toast.store";
import { memberInitials, memberName } from "../utils/member";

export function NetworkRelations() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.connections.all,
    queryFn: () => ConnectionApi.list(),
    staleTime: staleTimeByCategory.connections,
  });

  const removeMut = useMutation({
    mutationFn: (userId: string | number) => ConnectionApi.remove(userId),
    onSuccess: () => {
      useToastStore.getState().addToast("Relation retirée", "info");
      void queryClient.invalidateQueries({
        queryKey: queryKeys.connections.all,
      });
    },
    onError: () =>
      useToastStore.getState().addToast("Une erreur est survenue", "error"),
  });

  const relations = data?.connections ?? [];

  return (
    <div className="flex-1 flex flex-col bg-base-200">
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-base-200 bg-base-100 px-4 py-4">
        <button
          type="button"
          aria-label="Retour"
          onClick={() => navigate("/network/manage")}
          className="text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-base-content">
          Relations
          {relations.length > 0 && (
            <span className="ml-2 text-base font-semibold text-base-content/50">
              {relations.length}
            </span>
          )}
        </h1>
      </div>

      {isPending ? (
        <p className="bg-base-100 px-4 py-8 text-sm text-base-content/60">
          Chargement…
        </p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 bg-base-100 p-6 text-center">
          <p className="text-sm text-base-content/60">
            Impossible de charger vos relations.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="btn btn-sm btn-outline gap-2"
          >
            <ArrowClockwise className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      ) : relations.length === 0 ? (
        <div className="bg-base-100 p-10">
          <EmptyState
            icon={Users}
            message="Vous n'avez pas encore de relation. Connectez-vous à des membres depuis la page Réseau."
          />
        </div>
      ) : (
        <ul className="divide-y divide-base-200 bg-base-100">
          {relations.map(({ user }) => (
            <li key={user.id} className="flex items-center gap-3 px-4 py-3">
              <Link to={`/members/${user.id}`} className="shrink-0">
                <Avatar
                  label={memberInitials(user)}
                  avatarUrl={user.avatar_url ?? undefined}
                  size="md"
                />
              </Link>
              <Link
                to={`/members/${user.id}`}
                className="min-w-0 flex-1 leading-tight"
              >
                <p className="line-clamp-1 font-semibold text-base-content">
                  {memberName(user)}
                </p>
                <p className="line-clamp-1 text-xs text-base-content/60">
                  {user.email}
                </p>
              </Link>
              <button
                type="button"
                onClick={() => removeMut.mutate(user.id)}
                disabled={removeMut.isPending}
                className="btn btn-outline btn-sm rounded-full"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
