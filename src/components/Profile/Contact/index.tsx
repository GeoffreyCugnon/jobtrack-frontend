import { useState } from "react";
import { Mail, Phone, Globe, ChevronDown, Plus } from "lucide-react";
import { ContactRow } from "./ContactRow";

interface UserType {
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
}

interface ProfileContactProps {
  user: UserType;
  onAdd?: () => void;
}

const iconSizeStyle = "w-4 h-4";

const linkedinIcon = (
  <svg
    className={iconSizeStyle}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const githubIcon = (
  <svg
    className={iconSizeStyle}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

export function ProfileContact({ user, onAdd }: ProfileContactProps) {
  const [isOpen, setIsOpen] = useState(true);

  const contacts = [
    { icon: <Mail className={iconSizeStyle} />, label: user?.email },
    { icon: <Phone className={iconSizeStyle} />, label: user?.phone },
    { icon: <Globe className={iconSizeStyle} />, label: user?.website },
    { icon: linkedinIcon, label: "linkedin.com/in/..." },
    { icon: githubIcon, label: "github.com/..." },
  ];

  return (
    <div className="rounded-none sm:rounded-box overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((v) => !v);
          }
        }}
        aria-expanded={isOpen}
        className="flex items-center justify-between px-4 py-3 bg-base-200 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg text-base-content">Contact</h3>
          <button
            type="button"
            aria-label="Ajouter un contact"
            onClick={(e) => {
              e.stopPropagation();
              onAdd?.();
            }}
            className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-base-content/50 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="bg-base-100 p-4 border-t border-base-200">
          <div className="space-y-2">
            {contacts.map((contact, i) => (
              <ContactRow key={i} icon={contact.icon} label={contact.label} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
