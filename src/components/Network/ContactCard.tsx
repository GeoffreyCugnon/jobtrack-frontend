import { Pencil, Trash2 } from "lucide-react";
import { Card } from "./Card";
import type { Contact } from "../../types/contact.types";

type Props = {
    contact: Contact;
    companyName: string;
    onEdit: (contact: Contact) => void;
    onDelete: (id: number) => void;
};

export function ContactCard({ contact, companyName, onEdit, onDelete }: Props) {
    return (
        <Card>
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm opacity-70">{contact.jobTitle} · {companyName}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => onEdit(contact)}>
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => onDelete(contact.id)}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </Card>
    );
}
