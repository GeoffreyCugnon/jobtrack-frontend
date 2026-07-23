import React from "react";

interface DeleteDocumentDialogProps {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  itemTitle?: string;
  onConfirm: () => void;
}

export function DeleteDocumentDialog({
  dialogRef,
  itemTitle,
  onConfirm,
}: DeleteDocumentDialogProps) {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold text-error">Supprimer ce document ?</h3>
        <p className="py-4 text-sm text-base-content/70">
          {itemTitle ? (
            <>
              « {itemTitle} » sera définitivement supprimé. Cette action est
              irréversible.
            </>
          ) : null}
        </p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Annuler</button>
          </form>
          <button className="btn btn-error" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
