interface ProfileCardProps {
  name: string;
  email: string;
  onEdit?: () => void;
}

export default function ProfileCard({ name, email, onEdit }: ProfileCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-center justify-between rounded-none sm:rounded-box overflow-hidden bg-base-100 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-semibold text-primary-content">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-base-content">{name}</p>
          <p className="text-sm text-base-content/60">{email}</p>
        </div>
      </div>
      <button
        onClick={onEdit}
        className="text-sm font-medium text-primary hover:underline"
      >
        Modifier
      </button>
    </div>
  );
}
