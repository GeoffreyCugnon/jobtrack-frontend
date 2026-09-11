import type { CompanySize } from "../types/company.type";

// Valeurs alignées sur `COMPANY_SIZES` (Backend, `create-company.dto.ts`) —
// tout changement doit être répercuté des deux côtés.
export const COMPANY_SIZE_OPTIONS: { value: CompanySize; label: string }[] = [
  { value: "1-10", label: "1 à 10 salariés" },
  { value: "11-50", label: "11 à 50 salariés" },
  { value: "51-200", label: "51 à 200 salariés" },
  { value: "201-500", label: "201 à 500 salariés" },
  { value: "500+", label: "Plus de 500 salariés" },
];
