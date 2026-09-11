import { Globe, MapPin, UsersThree } from "@phosphor-icons/react";

import { COMPANY_SIZE_OPTIONS } from "../../constants/company";
import type { Company } from "../../types/company.type";

function sizeLabel(size: string | null) {
  return COMPANY_SIZE_OPTIONS.find((option) => option.value === size)?.label ?? null;
}

function subtitle(company: Company) {
  return [company.business_sector, company.address].filter(Boolean).join(" · ");
}

/**
 * Contenu détaillé d'une fiche entreprise (bannière, logo, à propos,
 * taille/site/localisation) — partagé entre `CompanyView` (`/company/:id`)
 * et `CompanyList` (affichage direct quand l'utilisateur n'a qu'une seule
 * entreprise, pour éviter un clic inutile vers une liste à un seul élément).
 */
export function CompanyDetails({ company }: { company: Company }) {
  return (
    <div className="flex flex-col">
      <div className="h-32 shrink-0 overflow-hidden bg-linear-to-r from-primary to-secondary">
        {company.banner_url && (
          <img
            src={company.banner_url}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex items-center gap-3.5 border-b border-base-200 px-4 py-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-field bg-linear-to-br from-primary to-secondary text-lg font-bold text-primary-content">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            company.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-base-content">
            {company.name}
          </h2>
          {subtitle(company) && (
            <p className="truncate text-sm text-base-content/60">
              {subtitle(company)}
            </p>
          )}
        </div>
      </div>

      {company.description && (
        <div className="border-b border-base-200 px-4 py-4">
          <h3 className="mb-1.5 text-sm font-semibold text-base-content">
            À propos
          </h3>
          <p className="text-sm leading-relaxed text-base-content/70">
            {company.description}
          </p>
        </div>
      )}

      {(sizeLabel(company.size) || company.website || company.address) && (
        <div className="flex flex-col gap-3 border-b border-base-200 px-4 py-4">
          {sizeLabel(company.size) && (
            <div className="flex items-center gap-2.5">
              <UsersThree className="h-4 w-4 shrink-0 text-base-content/45" />
              <span className="text-sm text-base-content">
                {sizeLabel(company.size)}
              </span>
            </div>
          )}
          {company.website && (
            <div className="flex min-w-0 items-center gap-2.5">
              <Globe className="h-4 w-4 shrink-0 text-base-content/45" />
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="truncate text-sm text-link hover:underline"
              >
                {company.website}
              </a>
            </div>
          )}
          {company.address && (
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-base-content/45" />
              <span className="text-sm text-base-content">
                {company.address}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
