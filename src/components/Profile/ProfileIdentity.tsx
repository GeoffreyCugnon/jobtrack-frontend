import { MapPin, Edit2 } from "lucide-react";

interface UserType {
  firstName: string;
  lastName: string;
  initials: string;
  title: string;
  location: string;
  bio: string;
  availability: string;
  jobType: string;
  salary: string;
}

interface ProfileIdentityProps {
  user: UserType;
}

export function ProfileIdentity({ user }: ProfileIdentityProps) {
  return (
    <>
      {/* 1. Zone de Couverture */}
      <div className="relative h-34 sm:h-56 bg-linear-to-r from-primary to-secondary">
        <button className="btn btn-sm btn-glass absolute right-4 bottom-6 sm:bottom-6 gap-1.5 text-primary-content border-none hover:bg-black/20">
          <Edit2 className="w-3.5 h-3.5" />
          Modifier
        </button>
      </div>

      {/* 2. Contenu des détails de l'identité */}
      <div className="relative pt-12 px-4 pb-5 bg-base-100 shadow-sm -mt-4">
        {/* DaisyUI Avatar Container décalé vers le haut */}
        <div className="absolute left-4 -top-14 avatar placeholder">
          <div className="w-24 h-24 rounded-full ring-4 ring-base-100 shadow-md overflow-hidden bg-neutral">
            <img
              src="https://picsum.photos/200"
              alt="Avatar"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Bloc d'informations textuelles */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-base-content">
            {user.firstName} {user.lastName}
          </h2>
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
          <div className="badge badge-success badge-outline font-medium">
            {user.availability}
          </div>
          <div className="badge badge-primary badge-outline font-medium">
            {user.jobType}
          </div>
          <div className="badge bg-base-200 border-none font-medium text-base-content/70">
            {user.salary}
          </div>
        </div>
      </div>
    </>
  );
}
