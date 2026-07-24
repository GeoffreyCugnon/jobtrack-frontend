import { useNavigate } from "react-router";
import { FileText, Eye, Pencil, Copy, Trash2 } from "lucide-react";
import type { CvItem } from "./index";
import { BTN_FOCUS_RING } from "../../../constants/styles";

interface CVCardProps {
  item: CvItem;
  onCopyLink: (item: CvItem) => void;
  onDelete: (item: CvItem) => void;
}

export function CVCard({ item, onCopyLink, onDelete }: CVCardProps) {
  const navigate = useNavigate();

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm w-full rounded-box">
      <div className="card-body gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-field bg-primary/10 text-primary">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="card-title text-base">{item.title}</h2>
              <p className="text-sm text-base-content/60">
                Modifié le {item.updatedAt}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Copier le lien"
            onClick={() => onCopyLink(item)}
            className="btn btn-ghost btn-circle btn-sm text-base-content/50 hover:text-secondary hover:bg-secondary/10 shrink-0 -mt-4 -mr-4"
          >
            <Copy size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 card-actions">
          <button
            type="button"
            onClick={() => navigate(`/app/documents/cv/${item.id}`)}
            className={`btn btn-sm btn-primary gap-1.5 w-full ${BTN_FOCUS_RING.primary}`}
          >
            <Eye size={15} />
            Voir
          </button>
          <button
            type="button"
            onClick={() => navigate(`/app/documents/cv/${item.id}/edit`)}
            className={`btn btn-sm btn-secondary gap-1.5 w-full ${BTN_FOCUS_RING.secondary}`}
          >
            <Pencil size={15} />
            Éditer
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className={`btn btn-sm btn-error gap-1.5 w-full ${BTN_FOCUS_RING.error}`}
          >
            <Trash2 size={15} />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
