import { useRef, useState } from "react";
import { Loader2, MapPin, Edit2, Camera } from "@/lib/icons";
import { fileToAvatarDataUrl } from "../../utils/image";

interface UserType {
  firstName: string;
  lastName: string;
  initials: string;
  /** Avatar par défaut généré (Backend). */
  avatarUrl?: string;
  title: string;
  location: string;
  bio: string;
  availability: string;
  jobType: string;
  salary: string;
}

const FALLBACK_AVATAR = "https://randomuser.me/api/portraits/lego/5.jpg";

interface ProfileIdentityProps {
  user: UserType;
  onEdit?: () => void;
  /**
   * Persiste le nouvel avatar (data URL). Doit rejeter en cas d'échec pour
   * que la prévisualisation soit annulée.
   */
  onAvatarChange?: (dataUrl: string) => Promise<void>;
}

const MAX_AVATAR_FILE_BYTES = 8 * 1024 * 1024;

// Aperçu instantané côté client (pas de backend d'upload pour l'instant).
// Révoque l'ancienne blob URL pour éviter les fuites mémoire.
function previewImage(
  file: File,
  current: string,
  setSrc: (url: string) => void
) {
  if (current.startsWith("blob:")) URL.revokeObjectURL(current);
  setSrc(URL.createObjectURL(file));
}

export function ProfileIdentity({
  user,
  onEdit,
  onAvatarChange,
}: ProfileIdentityProps) {
  const [avatarSrc, setAvatarSrc] = useState(user.avatarUrl || FALLBACK_AVATAR);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [bannerSrc, setBannerSrc] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) previewImage(file, bannerSrc ?? "", setBannerSrc);
    e.target.value = "";
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || file.size > MAX_AVATAR_FILE_BYTES) return;

    const previous = avatarSrc;
    setSavingAvatar(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setAvatarSrc(dataUrl); // prévisualisation immédiate
      await onAvatarChange?.(dataUrl);
    } catch (error) {
      console.error("Avatar update failed", error);
      setAvatarSrc(previous); // échec -> on annule la prévisualisation
    } finally {
      setSavingAvatar(false);
    }
  };

  return (
    <>
      {/* 1. Zone de Couverture */}
      <div className="relative h-34 sm:h-56 overflow-hidden bg-linear-to-r from-primary to-secondary">
        {bannerSrc && (
          <img
            src={bannerSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleBannerChange}
        />
        <button
          onClick={() => bannerInputRef.current?.click()}
          aria-label="Changer la photo de bannière"
          className="absolute right-3 top-3 w-8 h-8 rounded-full flex items-center justify-center bg-base-200 hover:bg-base-300 text-base-content/80 hover:text-base-content transition-colors cursor-pointer"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Contenu des détails de l'identité */}
      <div className="relative pt-12 px-4 pb-5 bg-base-100 -mt-4">
        {/* DaisyUI Avatar Container décalé vers le haut */}
        <div className="absolute left-4 -top-14 avatar placeholder">
          <div className="w-24 h-24 rounded-full ring-4 ring-base-100 shadow-md overflow-hidden bg-base-300">
            <img
              src={avatarSrc}
              alt="Avatar"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            onClick={() => avatarInputRef.current?.click()}
            disabled={savingAvatar}
            aria-label="Changer la photo de profil"
            className="absolute -right-1 -bottom-1 w-7 h-7 rounded-full border-2 border-base-100 flex items-center justify-center bg-base-200 hover:bg-base-300 text-base-content/80 hover:text-base-content transition-colors cursor-pointer disabled:opacity-70"
          >
            {savingAvatar ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Bloc d'informations textuelles */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-base-content">
              {user.firstName} {user.lastName}
            </h2>
            <button
              onClick={onEdit}
              className="btn btn-sm shrink-0 gap-1.5 mt-1.5 bg-base-200 hover:bg-base-300 text-base-content/80 hover:text-base-content border-none transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Modifier
            </button>
          </div>
          <p className="text-sm text-base-content/70 font-medium">
            {user.title}
          </p>
          <div className="flex items-center gap-1 text-base-content/50 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span>{user.location}</span>
          </div>
        </div>

        {/* Biographie */}
        <p className="mt-2 text-sm text-base-content/80 leading-relaxed">
          {user.bio}
        </p>

        {/* Badges DaisyUI */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="badge badge-success badge-soft font-medium">
            {user.availability}
          </div>
          <div className="badge badge-primary badge-soft font-medium">
            {user.jobType}
          </div>
          <div className="badge badge-soft font-medium">
            {user.salary}
          </div>
        </div>
      </div>
    </>
  );
}
