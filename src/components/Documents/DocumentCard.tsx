import { useNavigate } from "react-router";
import { FileText, Pencil, Copy, Trash2 } from "@/lib/icons";
import type { DocumentItem } from "../../types/document.type";

interface DocumentCardProps {
  item: DocumentItem;
  basePath: "cv" | "letters";
  onCopyLink: (item: DocumentItem) => void;
  onDelete: (item: DocumentItem) => void;
}

export function DocumentCard({ item, basePath, onCopyLink, onDelete }: DocumentCardProps) {
  const navigate = useNavigate();

  // Les 3 icônes d'action sont de vrais boutons imbriqués dans la rangée :
  // chaque handler stoppe la propagation pour ne pas déclencher le clic
  // "Voir" porté par la rangée elle-même.
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/documents/${basePath}/${item.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/documents/${basePath}/${item.id}`);
        }
      }}
      className="flex items-center justify-between gap-3 p-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-base-200/60 transition-colors"
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-field bg-primary/10 text-primary">
          <FileText size={18} />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-base text-base-content truncate">
            {item.title}
          </h2>
          <p className="text-sm text-base-content/60">
            Modifié le {item.updatedAt}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 -mr-2">
        <button
          type="button"
          aria-label="Copier le lien"
          onClick={stop(() => onCopyLink(item))}
          className="btn btn-ghost btn-circle w-11 h-11 min-h-0 text-base-content/50 hover:bg-base-200 hover:text-secondary"
        >
          <Copy className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Modifier"
          onClick={stop(() => navigate(`/documents/${basePath}/${item.id}/edit`))}
          className="btn btn-ghost btn-circle w-11 h-11 min-h-0 text-base-content/50 hover:bg-base-200 hover:text-secondary"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          type="button"
          aria-label="Supprimer"
          onClick={stop(() => onDelete(item))}
          className="btn btn-ghost btn-circle w-11 h-11 min-h-0 text-base-content/50 hover:bg-base-200 hover:text-error"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
