import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, type Icon as IconType } from "@phosphor-icons/react";
import { Header } from "./Header";

interface FormPageLayoutProps {
  title: string;
  icon: IconType;
  /** Destination du bouton retour (défaut : `navigate(-1)`). */
  backTo?: string;
  backLabel?: string;
  children: ReactNode;
}

/**
 * Coquille commune des sous-pages formulaire / détail : `Header`, conteneur
 * `max-w-2xl`, bouton retour, carte unique avec pastille d'icône et `<h1>`.
 * Remplace le copier-coller présent dans ~11 pages (Profile*, Document*,
 * Settings*, OfferDetail).
 */
export function FormPageLayout({
  title,
  icon: Icon,
  backTo,
  backLabel = "Retour",
  children,
}: FormPageLayoutProps) {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="mx-auto max-w-2xl px-4 py-6">
        <button
          type="button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-base-content/60 hover:text-base-content"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </button>

        <div className="card bg-base-100 border border-base-200 shadow-sm">
          <div className="card-body p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>

            {children}
          </div>
        </div>
      </div>
    </>
  );
}
