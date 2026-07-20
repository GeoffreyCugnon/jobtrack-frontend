import React from "react";

interface SettingsModalProps {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  title: string;
  children: React.ReactNode;
}

export function SettingsModal({ modalRef, title, children }: SettingsModalProps) {
  return (
    <>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{title}</h3>
          <div className="mt-4">{children}</div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Fermer</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}