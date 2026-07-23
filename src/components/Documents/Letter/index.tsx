import { useRef, useState } from "react";
import { LetterCard } from "./LetterCard";
import { DeleteDocumentDialog } from "../DeleteDocumentDialog";

export interface LetterItem {
  id: string;
  title: string;
  updatedAt: string;
}

interface LetterListProps {
  items: LetterItem[];
}

export function LetterList({ items }: LetterListProps) {
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [pendingDelete, setPendingDelete] = useState<LetterItem | null>(null);

  const askDelete = (item: LetterItem) => {
    setPendingDelete(item);
    deleteModalRef.current?.showModal();
  };

  const handleDelete = () => {
    // TODO: brancher sur DELETE /documents/letters/:id
    console.log("delete", pendingDelete?.id);
    deleteModalRef.current?.close();
  };

  const handleCopyLink = (item: LetterItem) => {
    // TODO: copier le vrai lien partageable une fois l'API branchée
    navigator.clipboard.writeText(item.id);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <LetterCard
            key={item.id}
            item={item}
            onCopyLink={handleCopyLink}
            onDelete={askDelete}
          />
        ))}
      </div>

      <DeleteDocumentDialog
        dialogRef={deleteModalRef}
        itemTitle={pendingDelete?.title}
        onConfirm={handleDelete}
      />
    </>
  );
}
