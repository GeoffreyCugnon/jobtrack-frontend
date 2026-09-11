import { api } from "../utils/axios-client";
import type { Company, CompanySize } from "../types/company.type";

export interface CreateCompanyPayload {
  name: string;
  business_sector: string;
  size?: CompanySize;
  website?: string;
  address?: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  is_public?: boolean;
}

/** Endpoints du module `company` (Backend, protégé par `AuthGuard`). */
export class CompanyApi {
  static async create(payload: CreateCompanyPayload): Promise<Company> {
    const { data } = await api.post<{ data: { company: Company } }>(
      "company",
      payload,
    );
    return data.data.company;
  }

  /** Toutes les entreprises gérées par l'utilisateur courant (`GET /company/mine/all`). */
  static async getMineAll(): Promise<Company[]> {
    const { data } = await api.get<Company[]>("company/mine/all");
    return data;
  }

  /** Fiche d'une entreprise par id (`GET /company/:id`), publique tant que l'appelant est authentifié. */
  static async getById(id: number | string): Promise<Company> {
    const { data } = await api.get<Company>(`company/${id}`);
    return data;
  }

  /**
   * `PATCH /company/:id` — protégé par une vérification de propriété côté
   * Backend (seul l'`Employment` courant de l'entreprise peut la modifier).
   * Un champ omis de `payload` n'est pas touché en base.
   */
  static async update(
    id: number,
    payload: Partial<CreateCompanyPayload>,
  ): Promise<Company> {
    const { data } = await api.patch<Company>(`company/${id}`, payload);
    return data;
  }
}
