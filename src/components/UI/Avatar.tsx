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

// Pastille de présence, dimensionnée selon la taille de l'avatar.
const DOT_SIZE_CLASSES = {
  sm: "w-2.5 h-2.5",
  md: "w-2.5 h-2.5",
  lg: "w-3.5 h-3.5",
} as const;

interface AvatarProps {
  // Initiales affichées quand aucune photo n'est disponible (ex: "GC",
  // "T") — calculées par l'appelant, qui sait s'il faut 1 ou 2 lettres.
  label: string;
  // Photo réelle optionnelle (utilisateur, logo d'entreprise...) : prend
  // toujours le pas sur le fallback dégradé + initiales.
  avatarUrl?: string;
  size?: keyof typeof SIZE_CLASSES;
  // Présence : pastille verte si `true`, grise si `false`, absente si
  // `undefined` (cas par défaut hors messagerie).
  online?: boolean;
}

// Avatar partagé : dégradé primary→secondary + initiales par défaut, photo
// réelle si disponible. Utilisé par MenuHeader, ConversationItem et
// ConversationThread pour garder un seul et même fallback dans toute l'app.
export function Avatar({ label, avatarUrl, size = "md", online }: AvatarProps) {
  return (
    <div className="avatar placeholder shrink-0 relative">
      <div
        className={`${SIZE_CLASSES[size]} rounded-full ring-2 ring-primary/30 ${
          avatarUrl
            ? "bg-base-300"
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
      {online !== undefined && (
        <span
          aria-label={online ? "En ligne" : "Hors ligne"}
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-base-100 ${
            DOT_SIZE_CLASSES[size]
          } ${online ? "bg-success" : "bg-base-content/30"}`}
        />
      )}
    </div>
  );
}
