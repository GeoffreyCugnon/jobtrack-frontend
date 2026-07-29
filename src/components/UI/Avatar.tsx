const SIZE_CLASSES = {
  sm: "w-9",
  md: "w-10",
  lg: "w-14",
} as const;

const TEXT_SIZE_CLASSES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

interface AvatarProps {
  // Initiales affichées quand aucune photo n'est disponible (ex: "GC",
  // "T") — calculées par l'appelant, qui sait s'il faut 1 ou 2 lettres.
  label: string;
  // Photo réelle optionnelle (utilisateur, logo d'entreprise...) : prend
  // toujours le pas sur le fallback dégradé + initiales.
  avatarUrl?: string;
  size?: keyof typeof SIZE_CLASSES;
}

// Avatar partagé : dégradé primary→secondary + initiales par défaut, photo
// réelle si disponible. Utilisé par MenuHeader, ConversationItem et
// ConversationThread pour garder un seul et même fallback dans toute l'app.
export function Avatar({ label, avatarUrl, size = "md" }: AvatarProps) {
  return (
    <div className="avatar placeholder shrink-0">
      <div
        className={`${SIZE_CLASSES[size]} rounded-full ring-2 ring-primary/30 ${
          avatarUrl
            ? ""
            : "bg-linear-to-br from-primary to-secondary text-primary-content"
        }`}
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="object-cover" />
        ) : (
          <span className={`${TEXT_SIZE_CLASSES[size]} font-semibold`}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
