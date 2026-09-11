/** Tranches d'effectif proposées par le formulaire (alignées sur `COMPANY_SIZES`, Backend). */
export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "500+";

export interface Company {
  id: number;
  name: string;
  business_sector: string;
  size: CompanySize | null;
  website: string | null;
  address: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_public: boolean;
  verified: boolean;
}
