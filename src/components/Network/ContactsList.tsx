import type { Contact } from "../../types/contact.types";
import { ContactCard } from "./ContactCard";

type Props = {
    contacts: Contact[];
    companyNameById: Record<number, string>;
    onEdit: (contact: Contact) => void;
    onDelete: (id: number) => void;
};

export function ContactsList({
    contacts,
    companyNameById,
    onEdit,
    onDelete,
}: Props) {
    if (contacts.length === 0)
        return <p className="border border-base-300 rounded-xl flex justify-center p-15">Aucun contact.<br />Pour ajouter un contact, cliquez sur le bouton ci-dessous.</p>
         
        

    return (
        <div className="flex flex-col gap-2">
            {contacts.map((contact) => (
                <ContactCard
                    key={contact.id}
                    contact={contact}
                    companyName={companyNameById[contact.companyId] ?? "—"}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
