import { FiHeart, FiMessageCircle, FiShare2, FiBookmark } from "react-icons/fi";

import { Publication } from "../../types/publication";

interface Props {
  publication: Publication;
}

export default function PublicationCard({ publication }: Props) {
  return (
    <div className="card bg-base-100 shadow-md border">
      <div className="card-body">
        <div className="flex justify-between">
          <div className="flex gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            </div>

            <div>
              <h2 className="font-semibold">{publication.author}</h2>

              <p className="text-xs text-gray-500">{publication.date}</p>
            </div>
          </div>

          <button className="btn btn-ghost btn-circle btn-sm">
            <FiBookmark />
          </button>
        </div>

        <p className="leading-7">{publication.description}</p>

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
              <FiHeart />

              {publication.likes}
            </button>

            <button className="btn btn-ghost btn-sm">
              <FiMessageCircle />

              {publication.comments}
            </button>
          </div>

          <button className="btn btn-ghost btn-sm">
            <FiShare2 />
            Partager
          </button>
        </div>
      </div>
    </div>
  );
}
