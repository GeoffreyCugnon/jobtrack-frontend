import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema, type CompanyFormData } from "../../schemas/company.schemas";


type Props = { 
    onClose: () => void; 
    onSubmit: (data: CompanyFormData) => void; 
};

export function CompanyForm({ onClose, onSubmit }: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
    });


    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Ajouter une entreprise</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <input
                        {...register("name")}
                        placeholder="Nom"
                        className="input input-bordered w-full"
                    />
                    {errors.name && (<p className="text-error text-sm">{errors.name.message}</p>)}

                    <input
                        {...register("businessSector")}
                        placeholder="Secteur d'activité"
                        className="input input-bordered w-full"
                    />
                    {errors.businessSector && (<p className="text-error text-sm">{errors.businessSector.message}</p>)}

                    <input
                        {...register("website")}
                        placeholder="Site web (optionnel)"
                        className="input input-bordered w-full"
                    />
                    {errors.website && (<p className="text-error text-sm">{errors.website.message}</p>)}

                    <input
                        {...register("address")}
                        placeholder="Adresse (optionnel)"
                        className="input input-bordered w-full"
                    />

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
