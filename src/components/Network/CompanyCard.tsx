import { Users, Folder } from "lucide-react";
import { Card } from "./Card";
import type { Company, ApplicationStatus } from "../../types/company.types";

const statusColor: Record<ApplicationStatus | 'NONE', string> = {
    ACCEPTED: "bg-success",
    PENDING: "bg-warning",
    REJECTED: "bg-error",
    WITHDRAWN: "bg-neutral",
    NONE: "bg-base-300", //pastille neutre par défaut
};

export function CompanyCard({ company }: { company: Company }) {
    return (
        <Card>
            <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${statusColor[company.latestApplicationStatus ?? 'NONE']}`}/>
                <span className="font-medium">{company.name}</span>
            </div>
            <div className="flex gap-4 text-sm opacity-70">
                <span className="flex items-center gap-1">
                    <Users size={14} /> {company.contactsCount} Contact{company.contactsCount > 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1">
                    <Folder size={14} /> {company.candidaturesCount} Candidature{company.candidaturesCount > 1 ? "s" : ""}
                </span>
            </div>
        </Card>
    );
}
