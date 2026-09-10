import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowClockwise, ArrowLeft, ChatText, Check, Envelope, FileDashed, UserPlus } from "@phosphor-icons/react";
import { Header } from "../components/Layout/Header";
import { EmptyState } from "../components/Layout/EmptyState";
import { UserApi } from "../api/user.api";
import {
  ConnectionApi,
  connectionStatusByUser,
  type ConnectionStatus,
} from "../api/connection.api";
import { queryKeys } from "../api/query-keys";
import { useToastStore } from "../store/toast.store";
import { memberHeadline, memberName } from "../utils/member";
import { useMessaging } from "../context/Messaging/useMessaging";

const FALLBACK_AVATAR = "https://randomuser.me/api/portraits/lego/5.jpg";

const CONNECT_LABEL: Record<ConnectionStatus, string> = {
  none: "Se connecter",
  pending_out: "Invitation envoyée",
  pending_in: "Accepter l'invitation",
  connected: "En relation",
};

export function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { startConversation, openConversation } = useMessaging();
  const [isStartingConversation, setIsStartingConversation] = useState(false);

  const {
    data: member,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.users.detail(id ?? ""),
    queryFn: () => UserApi.getById(id!),
    enabled: !!id,
  });

  const { data: connections } = useQuery({
    queryKey: queryKeys.connections.all,
    queryFn: () => ConnectionApi.list(),
  });

  const connectStatus: ConnectionStatus =
    member && connections
      ? (connectionStatusByUser(connections).get(member.id) ?? "none")
      : "none";

  const connectMut = useMutation({
    mutationFn: (action: "request" | "accept") =>
      action === "request"
        ? ConnectionApi.request(member!.id)
        : ConnectionApi.accept(member!.id),
    onSuccess: (_data, action) => {
      useToastStore
        .getState()
        .addToast(
          action === "request" ? "Invitation envoyée" : "Invitation acceptée",
          "success",
        );
      void queryClient.invalidateQueries({
        queryKey: queryKeys.connections.all,
      });
    },
    onError: () =>
      useToastStore
        .getState()
        .addToast("Une erreur est survenue", "error"),
  });

  // Ouvre (ou retrouve) la conversation avec ce membre auprès de
  // MS-Messagerie, puis referme cette page pour afficher le panneau de
  // messagerie (monté au niveau de `Root`, pas de cette page).
  const handleMessage = async () => {
    if (!member) return;
    setIsStartingConversation(true);
    try {
      const conversationId = await startConversation(String(member.id));
      navigate("/");
      openConversation(conversationId);
    } catch {
      useToastStore
        .getState()
        .addToast("Impossible d'ouvrir la conversation", "error");
    } finally {
      setIsStartingConversation(false);
    }
  };

  const shell = (children: React.ReactNode) => (
    <div className="flex-1 flex flex-col bg-base-200 pb-6">
      <Header />
      <div className="p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-3 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        {children}
      </div>
    </div>
  );

  if (isPending) {
    return shell(
      <p className="p-6 text-center text-sm text-base-content/60">
        Chargement…
      </p>,
    );
  }

  if (isError) {
    return shell(
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-sm text-base-content/60">
          Impossible de charger ce profil.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="btn btn-sm btn-outline gap-2"
        >
          <ArrowClockwise className="h-4 w-4" />
          Réessayer
        </button>
      </div>,
    );
  }

  if (!member) {
    return shell(
      <EmptyState icon={FileDashed} message="Ce profil n'existe pas ou plus." />,
    );
  }

  return shell(
    <div className="overflow-hidden rounded-box border border-base-200 bg-base-100">
      <div className="h-28 bg-linear-to-r from-primary to-secondary" />

      <div className="px-4 pb-5">
        <div className="-mt-12 mb-3 h-24 w-24 overflow-hidden rounded-full bg-base-300 ring-4 ring-base-100 shadow-md">
          <img
            src={member.avatar_url || FALLBACK_AVATAR}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <h1 className="text-xl font-bold text-base-content">
          {memberName(member)}
        </h1>
        <p className="text-sm text-base-content/70">{memberHeadline(member)}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-base-content/60">
          <Envelope className="h-4 w-4" />
          {member.email}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              if (connectStatus === "none") connectMut.mutate("request");
              else if (connectStatus === "pending_in")
                connectMut.mutate("accept");
            }}
            disabled={
              connectMut.isPending ||
              connectStatus === "pending_out" ||
              connectStatus === "connected"
            }
            className="btn btn-primary btn-sm gap-1.5"
          >
            {connectStatus === "pending_in" ? (
              <Check className="h-4 w-4" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            {CONNECT_LABEL[connectStatus]}
          </button>
          <button
            type="button"
            onClick={() => void handleMessage()}
            disabled={isStartingConversation}
            className="btn btn-outline btn-sm gap-1.5"
          >
            <ChatText className="h-4 w-4" />
            Message
          </button>
        </div>

        <div className="mt-5 border-t border-base-200 pt-4">
          <h2 className="mb-1 text-sm font-semibold text-base-content/70">
            À propos
          </h2>
          <p className="text-sm text-base-content/60">
            Ce membre n'a pas encore renseigné de présentation.
          </p>
        </div>
      </div>

      <div className="border-t border-base-200 px-4 py-3 text-center">
        <Link
          to="/network"
          className="text-sm font-medium text-primary hover:underline"
        >
          Voir d'autres membres
        </Link>
      </div>
    </div>,
  );
}
