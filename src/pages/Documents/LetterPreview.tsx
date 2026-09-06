import { useNavigate, useParams } from "react-router";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import { Header } from "../../components/Layout/Header";
import { letterItems } from "../../data/documents";
import { BTN_FOCUS_RING } from "../../constants/styles";

export function LetterPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = letterItems.find((letter) => letter.id === id);

  return (
    <>
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          onClick={() => navigate("/documents")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          Retour aux documents
        </button>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FileText size={18} />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">
                    {item?.title ?? "Document introuvable"}
                  </h1>
                  {item ? (
                    <p className="text-sm text-base-content/60">
                      Modifié le {item.updatedAt}
                    </p>
                  ) : null}
                </div>
              </div>
              {item ? (
                <button
                  onClick={() =>
                    navigate(`/documents/letters/${item.id}/edit`)
                  }
                  className={`btn btn-sm btn-secondary gap-1.5 ${BTN_FOCUS_RING.secondary}`}
                >
                  <Pencil size={15} />
                  Éditer
                </button>
              ) : null}
            </div>

            {/* TODO: brancher sur GET /documents/letters/:id pour afficher le vrai rendu de la lettre */}
            <div className="flex items-center justify-center rounded-box border border-dashed border-base-300 bg-base-200/40 py-24 text-sm text-base-content/40">
              Aperçu à venir
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
