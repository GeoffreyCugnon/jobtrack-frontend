import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Buildings, CalendarDots, Newspaper, User, Users, UsersThree, type Icon as IconType } from "@phosphor-icons/react";

import { ConnectionApi } from "../api/connection.api";
import { queryKeys } from "../api/query-keys";
import { staleTimeByCategory } from "../api/query-cache";
import { useToastStore } from "../store/toast.store";

const notify = () =>
  useToastStore.getState().addToast("Bientôt disponible", "info");

function ManageRow({
  icon: Icon,
  label,
  count,
  onClick,
}: {
  icon: IconType;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-b border-base-200 px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-base-200"
    >
      <Icon className="h-6 w-6 shrink-0 text-base-content/80" />
      <span className="flex-1 font-semibold text-base-content">{label}</span>
      {count !== undefined && (
        <span className="badge badge-info badge-sm font-semibold">{count}</span>
      )}
    </button>
  );
}

export function ManageNetwork() {
  const navigate = useNavigate();

  const { data: connections } = useQuery({
    queryKey: queryKeys.connections.all,
    queryFn: () => ConnectionApi.list(),
    staleTime: staleTimeByCategory.connections,
  });

  return (
    <div className="flex-1 flex flex-col bg-base-200">
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-base-200 bg-base-100 px-4 py-4">
        <button
          type="button"
          aria-label="Retour"
          onClick={() => navigate("/network")}
          className="text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-base-content">Gérer mon réseau</h1>
      </div>

      <div className="bg-base-100">
        <ManageRow
          icon={Users}
          label="Relations"
          count={connections?.connections.length}
          onClick={() => navigate("/network/relations")}
        />
        <ManageRow icon={User} label="Suivi et abonnés" onClick={notify} />
        <ManageRow icon={UsersThree} label="Groupes" onClick={notify} />
        <ManageRow icon={CalendarDots} label="Événements" onClick={notify} />
        <ManageRow icon={Buildings} label="Pages" onClick={notify} />
        <ManageRow icon={Newspaper} label="Newsletters" onClick={notify} />
      </div>
    </div>
  );
}
