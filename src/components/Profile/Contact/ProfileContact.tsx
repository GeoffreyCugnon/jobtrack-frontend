import { Envelope, Globe, Phone } from "@phosphor-icons/react";
import { ContactRow } from "./ContactRow";
import { SectionCard } from "../../Layout/SectionCard";

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
  const contacts = [
    { icon: <Envelope className={iconSizeStyle} />, label: user.email },
    { icon: <Phone className={iconSizeStyle} />, label: user.phone },
    { icon: <Globe className={iconSizeStyle} />, label: user.website },
    { icon: linkedinIcon, label: user.linkedin },
    { icon: githubIcon, label: user.github },
  ].filter((contact) => contact.label);

  return (
    <SectionCard title="Contact" onAdd={onAdd} addLabel="Modifier les contacts">
      <div className="space-y-2">
        {contacts.map((contact, i) => (
          <ContactRow key={i} icon={contact.icon} label={contact.label} />
        ))}
      </div>
    </SectionCard>
  );
}
