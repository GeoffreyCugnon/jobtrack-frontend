import { Link } from "react-router";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";

import type { Publication } from "../../types/publication.types";

interface Props {
  publication: Publication;
  /** true (défaut) : la carte renvoie vers `/publications/:id`. false sur la
   *  page de détail elle-même, où la publication est déjà le sujet. */
  linkToDetail?: boolean;
}

export default function PublicationCard({
  publication,
  linkToDetail = true,
}: Props) {
  const to = `/publications/${publication.id}`;

  const header = (
    <div className="flex gap-3 min-w-0">
      <div className="avatar">
        <div className="w-12 rounded-full bg-linear-to-r from-blue-500 to-purple-500" />
      </div>
      <div className="min-w-0">
        <h2 className="font-semibold truncate">{publication.author}</h2>
        <p className="text-xs text-base-content/60">{publication.date}</p>
      </div>
    </div>
  );

  return (
    <div className="card bg-base-100 shadow-md border">
      <div className="card-body">
        <div className="flex justify-between">
          {linkToDetail ? (
            <Link to={to} className="min-w-0 hover:opacity-80">
              {header}
            </Link>
          ) : (
            header
          )}

          <button className="btn btn-ghost btn-circle btn-sm">
            <Bookmark />
          </button>
        </div>

        {linkToDetail ? (
          <Link to={to} className="block leading-7 hover:opacity-80">
            {publication.description}
          </Link>
        ) : (
          <p className="leading-7">{publication.description}</p>
        )}

        <div className="flex gap-2 flex-wrap">
          {publication.tags.map((tag) => (
            <div key={tag} className="badge badge-outline">
              {tag}
            </div>
          ))}
        </div>

        <div className="divider my-1" />

        <div className="flex justify-between">
          <div className="flex gap-5">
            <button className="btn btn-ghost btn-sm">
              <Heart />
              {publication.likes}
            </button>

            {linkToDetail ? (
              <Link to={to} className="btn btn-ghost btn-sm">
                <MessageCircle />
                {publication.comments}
              </Link>
            ) : (
              <span className="btn btn-ghost btn-sm pointer-events-none">
                <MessageCircle />
                {publication.comments}
              </span>
            )}
          </div>

          <button className="btn btn-ghost btn-sm">
            <Share2 />
            Partager
          </button>
        </div>
      </div>
    </div>
  );
}
