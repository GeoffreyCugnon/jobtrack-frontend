import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "../../schemas/contact.schemas";
import type { Contact } from "../../types/contact.types";
import type { Company } from "../../types/company.types";

type Props = {
    initialData: Contact | null;
    companies: Company[];
    onClose: () => void;
    onSubmit: (data: ContactFormData) => void;
};

export function ContactForm({ initialData, companies, onClose, onSubmit }: Props) {
    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: initialData 
        ? {
            companyId: initialData.companyId,
            name: initialData.name,
            jobTitle: initialData.jobTitle,
            email: initialData.email,
            phone: initialData.phone ?? undefined,

        } 
        : undefined,
    });


    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">
                    {initialData ? "Modifier le contact" : "Ajouter un contact"}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)}  className="space-y-3">
                    <select {...register("companyId", { valueAsNumber: true })}className="select select-bordered w-full">
                        <option value="">Choisir une entreprise</option>
                        {companies.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {errors.companyId && <p className="text-error text-sm">{errors.companyId.message}</p>}

                    <input {...register("name")} placeholder="Nom" className="input input-bordered w-full"/>
                    {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}

                    <input {...register("jobTitle")} placeholder="Fonction" className="input input-bordered w-full"/>
                    {errors.jobTitle && <p className="text-error text-sm">{errors.jobTitle.message}</p>}

                    <input {...register("email")} placeholder="Email" className="input input-bordered w-full"/>
                    {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}

                    <input {...register("phone")} placeholder="Téléphone (optionnel)" className="input input-bordered w-full"/>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
