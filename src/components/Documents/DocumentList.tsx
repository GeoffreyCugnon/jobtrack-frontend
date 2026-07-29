import { useRef, useState } from "react";
import { DocumentCard } from "./DocumentCard";
import { DeleteDocumentDialog } from "./DeleteDocumentDialog";
import type { DocumentItem } from "../../data/documents";

interface DocumentListProps {
  items: DocumentItem[];
  basePath: "cv" | "letters";
}

export function DocumentList({ items, basePath }: DocumentListProps) {
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [pendingDelete, setPendingDelete] = useState<DocumentItem | null>(null);

  const askDelete = (item: DocumentItem) => {
    setPendingDelete(item);
    deleteModalRef.current?.showModal();
  };

  const handleDelete = () => {
    // TODO: brancher sur DELETE /documents/:basePath/:id
    deleteModalRef.current?.close();
  };

  const handleCopyLink = (item: DocumentItem) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/app/documents/${basePath}/${item.id}`
    );
  };

  return (
    <>
      <div className="divide-y divide-base-200">
        {items.map((item) => (
          <DocumentCard
            key={item.id}
            item={item}
            basePath={basePath}
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
