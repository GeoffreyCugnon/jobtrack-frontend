import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DocumentCard } from "./DocumentCard";
import { DeleteDocumentDialog } from "./DeleteDocumentDialog";
import { DocumentsApi } from "../../api/documents.api";
import { queryKeys } from "../../api/query-keys";
import { useToastStore } from "../../store/toast.store";
import type { DocumentItem } from "../../types/document.type";

interface DocumentListProps {
  items: DocumentItem[];
  basePath: "cv" | "letters";
}

export function DocumentList({ items, basePath }: DocumentListProps) {
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [pendingDelete, setPendingDelete] = useState<DocumentItem | null>(null);
  const queryClient = useQueryClient();

  const removeDocument = useMutation({
    mutationFn: (id: number) => DocumentsApi.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.documents.all,
      });
      useToastStore.getState().addToast("Document supprimé", "success");
    },
    onError: () =>
      useToastStore.getState().addToast("La suppression a échoué", "error"),
    onSettled: () => deleteModalRef.current?.close(),
  });

  const askDelete = (item: DocumentItem) => {
    setPendingDelete(item);
    deleteModalRef.current?.showModal();
  };

  const handleDelete = () => {
    if (pendingDelete) removeDocument.mutate(pendingDelete.id);
  };

  const handleCopyLink = (item: DocumentItem) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/documents/${basePath}/${item.id}`,
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
