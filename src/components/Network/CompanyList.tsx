import type { Company } from "../../types/company.types";
import { CompanyCard } from "./CompanyCard";

export function CompanyList({
    companies
}:{
    companies:Company[]
}){

    if(companies.length === 0)
        return <p className="border border-base-300 rounded-xl flex justify-center p-15">Aucune entreprise.<br /> Pour ajouter une entreprise, cliquez sur le bouton ci-dessous.</p>;

    return (
        <div className="flex flex-col gap-3">
            {
                companies.map(company=>(
                    <CompanyCard
                        key={company.id}
                        company={company}
                    />
                ))
            }
        </div>
    );
}