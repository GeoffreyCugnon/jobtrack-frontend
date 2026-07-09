import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Mail, Phone, Globe, Edit2, Plus } from "lucide-react";

const user = {
  firstName: "Geoffrey",
  lastName: "Cugnon",
  initials: "GC",
  title: "Développeur Web Junior",
  location: "Paris, France",
  email: "junior@dev.fr",
  phone: "+33 6 12 34 56 78",
  website: "geoffreycugnon.dev",
  linkedin: "linkedin.com/in/gcugnon",
  github: "github.com/gcugnon",
  bio: "Développeur web passionné en reconversion, spécialisé React et Node.js. À la recherche d'opportunités en startup ou scale-up pour contribuer à des projets ambitieux.",
  availability: "Disponible immédiatement",
  jobType: "CDI · Freelance",
  salary: "35–45k€",
};

const skills = [
  { category: "Front-end", items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vite"] },
  { category: "Back-end", items: ["Node.js", "Express", "REST API", "PostgreSQL"] },
  { category: "Outils", items: ["Git", "GitHub", "Figma", "VS Code", "Docker (bases)"] },
  { category: "Soft skills", items: ["Autonomie", "Curiosité", "Esprit d'équipe", "Adaptabilité"] },
];

const levelColor = (level: number) => {
  if (level >= 4) return "bg-blue-600";
  if (level >= 3) return "bg-blue-400";
  return "bg-gray-300";
};

export function Profile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="font-semibold">Mon profil</h1>
      </header>

      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-28 bg-linear-to-r from-blue-600 to-blue-400" />
        <div className="absolute left-4 -bottom-12 w-24 h-24 rounded-full bg-white border-4 border-white flex items-center justify-center shadow-md">
          <span className="text-3xl font-bold text-blue-600">{user.initials}</span>
        </div>
        <button className="absolute right-4 bottom-3 flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm text-xs text-gray-700 hover:bg-gray-50 transition-colors">
          <Edit2 className="w-3.5 h-3.5" />
          Modifier
        </button>
      </div>

      {/* Identity */}
      <div className="bg-white px-4 pt-14 pb-5 mt-0 mb-3 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-xl text-gray-900">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-600 mt-0.5">{user.title}</p>
            <div className="flex items-center gap-1 text-gray-400 mt-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm">{user.location}</span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{user.bio}</p>

        {/* Availability chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">{user.availability}</span>
          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">{user.jobType}</span>
          <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{user.salary}</span>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white px-4 py-4 mb-3 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
        <div className="space-y-2.5">
          <a href={`mailto:${user.email}`} className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            {user.email}
          </a>
          <a href={`tel:${user.phone}`} className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-blue-600" />
            </div>
            {user.phone}
          </a>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            {user.website}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#0077B5]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            {user.linkedin}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-[#181717]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </div>
            {user.github}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white px-4 py-4 mb-3 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Compétences</h3>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="space-y-5">
          {skills.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{group.category}</p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-50 text-blue-700 border border-blue-100 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
