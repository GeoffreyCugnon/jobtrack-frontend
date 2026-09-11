import type { RefObject } from "react";
import { ImageSquare, PencilSimple } from "@phosphor-icons/react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { FieldError } from "../Auth/FieldError";
import { INPUT_CLASS, SELECT_CLASS, TEXTAREA_CLASS } from "../../constants/styles";
import { COMPANY_SIZE_OPTIONS } from "../../constants/company";
import type { CreateCompanyValues } from "../../schemas/company.schemas";

interface CompanyFormFieldsProps {
  register: UseFormRegister<CreateCompanyValues>;
  errors: FieldErrors<CreateCompanyValues>;
  logoPreviewUrl: string | null;
  savingLogo: boolean;
  logoInputRef: RefObject<HTMLInputElement | null>;
  onLogoButtonClick: () => void;
  onLogoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bannerPreviewUrl: string | null;
  savingBanner: boolean;
  bannerInputRef: RefObject<HTMLInputElement | null>;
  onBannerButtonClick: () => void;
  onBannerFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Champs partagés entre `CreateCompany` et `EditCompany` — extraits pour
 * éviter de faire diverger deux copies d'un même formulaire déjà pas mal
 * retouché (espacement, rayons, style du bouton logo...).
 */
export function CompanyFormFields({
  register,
  errors,
  logoPreviewUrl,
  savingLogo,
  logoInputRef,
  onLogoButtonClick,
  onLogoFileChange,
  bannerPreviewUrl,
  savingBanner,
  bannerInputRef,
  onBannerButtonClick,
  onBannerFileChange,
}: CompanyFormFieldsProps) {
  return (
    <>
      <div className="relative h-32 shrink-0 overflow-hidden bg-linear-to-r from-primary to-secondary">
        {bannerPreviewUrl && (
          <img
            src={bannerPreviewUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onBannerFileChange}
        />
        <button
          type="button"
          onClick={onBannerButtonClick}
          disabled={savingBanner}
          className="btn btn-sm absolute right-3 top-3 gap-1.5 border-none bg-base-200 text-base-content/80 transition-colors hover:bg-base-300 hover:text-base-content disabled:opacity-70"
        >
          <PencilSimple className="h-3.5 w-3.5" />
          {savingBanner
            ? "Chargement..."
            : bannerPreviewUrl
              ? "Changer la bannière"
              : "Ajouter une bannière"}
        </button>
      </div>

      <div className="flex items-center gap-3.5 px-4 py-2">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-field bg-base-200 text-base-content/40">
          {logoPreviewUrl ? (
            <img
              src={logoPreviewUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageSquare size={22} />
          )}
        </div>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onLogoFileChange}
        />
        <button
          type="button"
          onClick={onLogoButtonClick}
          disabled={savingLogo}
          className="btn btn-sm gap-1.5 border-none bg-base-200 text-base-content/80 transition-colors hover:bg-base-300 hover:text-base-content disabled:opacity-70"
        >
          <PencilSimple className="h-3.5 w-3.5" />
          {savingLogo
            ? "Chargement..."
            : logoPreviewUrl
              ? "Changer le logo"
              : "Ajouter un logo"}
        </button>
      </div>

      <div className="px-4 py-2">
        <label className="mb-1.5 block text-sm font-semibold text-base-content">
          Nom de l'entreprise
        </label>
        <input
          type="text"
          required
          placeholder="Ex. Acme SAS"
          className={INPUT_CLASS}
          {...register("name")}
        />
        <FieldError error={errors.name?.message} />
      </div>

      <div className="px-4 py-2">
        <label className="mb-1.5 block text-sm font-semibold text-base-content">
          Secteur d'activité
        </label>
        <input
          type="text"
          placeholder="Ex. Technologie, Finance, Santé…"
          className={INPUT_CLASS}
          {...register("business_sector")}
        />
        <FieldError error={errors.business_sector?.message} />
      </div>

      <div className="px-4 py-2">
        <label className="mb-1.5 block text-sm font-semibold text-base-content">
          Taille de l'entreprise
        </label>
        <select className={SELECT_CLASS} {...register("size")}>
          <option value="">Sélectionner…</option>
          {COMPANY_SIZE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldError error={errors.size?.message} />
      </div>

      <div className="px-4 py-2">
        <label className="mb-1.5 block text-sm font-semibold text-base-content">
          Site web
        </label>
        <input
          type="url"
          placeholder="https://"
          className={INPUT_CLASS}
          {...register("website")}
        />
        <FieldError error={errors.website?.message} />
      </div>

      <div className="px-4 py-2">
        <label className="mb-1.5 block text-sm font-semibold text-base-content">
          Localisation
        </label>
        <input
          type="text"
          placeholder="Ville, pays"
          className={INPUT_CLASS}
          {...register("address")}
        />
        <FieldError error={errors.address?.message} />
      </div>

      <div className="px-4 py-2">
        <label className="mb-1.5 block text-sm font-semibold text-base-content">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Présentez votre entreprise en quelques phrases"
          className={TEXTAREA_CLASS}
          {...register("description")}
        />
        <FieldError error={errors.description?.message} />
      </div>
    </>
  );
}
