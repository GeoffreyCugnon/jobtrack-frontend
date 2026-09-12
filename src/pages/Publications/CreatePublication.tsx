import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CaretDown, Clock, Image as ImageIcon, Plus, X } from "@phosphor-icons/react";

import { Avatar } from "../../components/UI/Avatar";
import { PublicationsApi } from "../../api/publications.api";
import { queryKeys } from "../../api/query-keys";
import { useAuthStore } from "../../store/auth.store";
import { useToastStore } from "../../store/toast.store";
import { getUserDisplay } from "../../utils/user-display";
import { getBackendErrorMessage } from "../../utils/http-error";
import { fileToPostImageDataUrl } from "../../utils/image";
import { logError } from "../../utils/log";
import { createPublicationSchema } from "../../schemas/publication.schemas";

const MAX_IMAGE_FILE_BYTES = 8 * 1024 * 1024;

// Pas de champ dédié dans le composeur (design volontairement minimal, cf.
// maquette) — le Backend exige un titre non vide (`CreatePublicationDto`),
// donc on le dérive de la première ligne du contenu.
function deriveTitle(content: string): string {
  const firstLine = content.trim().split("\n")[0] ?? "";
  return firstLine.length > 80 ? `${firstLine.slice(0, 79)}…` : firstLine;
}

export function CreatePublication() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const display = getUserDisplay(useAuthStore((state) => state.user));

  const [content, setContent] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = createPublicationSchema.safeParse({ content }).success;

  const createMutation = useMutation({
    mutationFn: () =>
      PublicationsApi.create({
        title: deriveTitle(content) || "Publication",
        content: content.trim(),
        type: "ACTU",
        imageUrl: imageDataUrl ?? undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.publications.all });
      useToastStore.getState().addToast("Publication envoyée", "success");
      navigate("/publications");
    },
    onError: (error) => {
      logError("publications/create", error);
      useToastStore
        .getState()
        .addToast(
          getBackendErrorMessage(error, "La publication a échoué"),
          "error",
        );
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || file.size > MAX_IMAGE_FILE_BYTES) return;

    setUploadingImage(true);
    try {
      setImageDataUrl(await fileToPostImageDataUrl(file));
    } catch (error) {
      logError("publications/create-image", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const notImplemented = () =>
    useToastStore.getState().addToast("Bientôt disponible", "info");

  return (
    <div className="flex min-h-full shrink-0 flex-col bg-base-100">
      <div className="flex items-center justify-between gap-3 border-b border-base-200 px-4 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Fermer"
          className="flex text-base-content/70 hover:text-base-content"
        >
          <X size={22} />
        </button>

        <button
          type="button"
          onClick={notImplemented}
          className="flex min-w-0 flex-1 items-center justify-center gap-1.5"
        >
          <Avatar label={display.initials} avatarUrl={display.avatarUrl} size="sm" />
          <span className="truncate text-sm font-semibold text-base-content">
            {display.name}
          </span>
          <CaretDown className="h-3.5 w-3.5 shrink-0 text-base-content/50" />
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={notImplemented}
            aria-label="Planifier la publication"
            className="rounded-full p-2 text-base-content/60 hover:bg-base-200 hover:text-base-content"
          >
            <Clock size={20} />
          </button>
          <button
            type="button"
            onClick={() => createMutation.mutate()}
            disabled={!canSubmit || createMutation.isPending}
            className="btn btn-primary btn-sm rounded-full px-4"
          >
            Publier
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Donnez votre avis..."
          className="w-full flex-1 resize-none bg-transparent text-lg text-base-content placeholder:text-base-content/40 focus:outline-none"
        />

        {imageDataUrl && (
          <div className="relative mt-2 shrink-0">
            <img
              src={imageDataUrl}
              alt=""
              className="max-h-72 w-full rounded-box object-cover"
            />
            <button
              type="button"
              onClick={() => setImageDataUrl(null)}
              aria-label="Retirer l'image"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-base-300/90 text-base-content hover:bg-base-300"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-base-200 px-4 py-3">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <button
          type="button"
          onClick={() => imageInputRef.current?.click()}
          disabled={uploadingImage}
          aria-label="Ajouter une image"
          className="rounded-full p-2 text-base-content/60 hover:bg-base-200 hover:text-base-content disabled:opacity-60"
        >
          <ImageIcon size={22} />
        </button>
        <button
          type="button"
          onClick={notImplemented}
          aria-label="Ajouter du contenu"
          className="rounded-full p-2 text-base-content/60 hover:bg-base-200 hover:text-base-content"
        >
          <Plus size={22} />
        </button>
      </div>
    </div>
  );
}
