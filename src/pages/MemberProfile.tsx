import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileQuestion, Mail, MessageSquare, RotateCw, UserPlus } from "lucide-react";
import { Header } from "../components/Layout/Header";
import { EmptyState } from "../components/Layout/EmptyState";
import { UserApi } from "../api/user.api";
import { queryKeys } from "../api/query-keys";
import { useToastStore } from "../store/toast.store";
import { memberHeadline, memberName } from "../utils/member";

const FALLBACK_AVATAR = "https://api.dicebear.com/9.x/avataaars/svg?seed=jobtrack";

export function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const notify = () =>
    useToastStore.getState().addToast("Bientôt disponible", "info");

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
          <RotateCw className="h-4 w-4" />
          Réessayer
        </button>
      </div>,
    );
  }

  if (!member) {
    return shell(
      <EmptyState icon={FileQuestion} message="Ce profil n'existe pas ou plus." />,
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
          <Mail className="h-4 w-4" />
          {member.email}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={notify}
            className="btn btn-primary btn-sm gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            Se connecter
          </button>
          <button
            type="button"
            onClick={notify}
            className="btn btn-outline btn-sm gap-1.5"
          >
            <MessageSquare className="h-4 w-4" />
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
