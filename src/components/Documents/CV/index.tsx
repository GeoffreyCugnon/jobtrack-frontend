import { useRef, useState } from "react";
import { CVCard } from "./CVCard";
import { DeleteDocumentDialog } from "../DeleteDocumentDialog";

export interface CvItem {
  id: string;
  title: string;
  updatedAt: string;
}

interface CVListProps {
  items: CvItem[];
}

export function CVList({ items }: CVListProps) {
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [pendingDelete, setPendingDelete] = useState<CvItem | null>(null);

  const askDelete = (item: CvItem) => {
    setPendingDelete(item);
    deleteModalRef.current?.showModal();
  };

  const handleDelete = () => {
    // TODO: brancher sur DELETE /documents/cv/:id
    console.log("delete", pendingDelete?.id);
    deleteModalRef.current?.close();
  };

  const handleCopyLink = (item: CvItem) => {
    // TODO: copier le vrai lien partageable une fois l'API branchée
    navigator.clipboard.writeText(item.id);
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <CVCard
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
