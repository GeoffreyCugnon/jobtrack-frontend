import { useRef, useState } from "react";
import { ArrowLeft, Check } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { CompanyFormFields } from "../../components/Company/CompanyFormFields";
import { CompanyApi } from "../../api/company.api";
import { queryKeys } from "../../api/query-keys";
import type { Company } from "../../types/company.type";
import {
  type CreateCompanyValues,
  createCompanySchema,
  withScheme,
} from "../../schemas/company.schemas";
import { fileToAvatarDataUrl, fileToBannerDataUrl } from "../../utils/image";
import { getBackendErrorMessage } from "../../utils/http-error";
import { logError } from "../../utils/log";

const MAX_LOGO_FILE_BYTES = 8 * 1024 * 1024;
const MAX_BANNER_FILE_BYTES = 8 * 1024 * 1024;

export function CreateCompany() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [savingLogo, setSavingLogo] = useState(false);
  const [bannerDataUrl, setBannerDataUrl] = useState<string | null>(null);
  const [savingBanner, setSavingBanner] = useState(false);
  const [createdCompany, setCreatedCompany] = useState<Company | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCompanyValues>({
    resolver: zodResolver(createCompanySchema),
  });

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || file.size > MAX_LOGO_FILE_BYTES) return;

    setSavingLogo(true);
    try {
      setLogoDataUrl(await fileToAvatarDataUrl(file));
    } catch (error) {
      logError("company/logo", error);
    } finally {
      setSavingLogo(false);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || file.size > MAX_BANNER_FILE_BYTES) return;

    setSavingBanner(true);
    try {
      setBannerDataUrl(await fileToBannerDataUrl(file));
    } catch (error) {
      logError("company/banner", error);
    } finally {
      setSavingBanner(false);
    }
  };

  const onSubmit = async (values: CreateCompanyValues) => {
    setServerError(null);
    try {
      const company = await CompanyApi.create({
        name: values.name,
        business_sector: values.business_sector,
        size: values.size || undefined,
        website: values.website ? withScheme(values.website) : undefined,
        address: values.address || undefined,
        description: values.description || undefined,
        logo_url: logoDataUrl || undefined,
        banner_url: bannerDataUrl || undefined,
      });
      setCreatedCompany(company);
      void queryClient.invalidateQueries({ queryKey: queryKeys.company.mineAll });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status < 500) {
        // Message backend déjà explicite (nom déjà pris, déjà rattaché à une
        // entreprise, champ invalide...) — cf. `CompanyService.create` /
        // `ValidationPipe`.
        setServerError(
          getBackendErrorMessage(error, "Une entreprise porte déjà ce nom."),
        );
      } else {
        logError("company/create", error);
        setServerError("Une erreur est survenue. Réessaie plus tard.");
      }
    }
  };

  return (
    <div className="flex min-h-full shrink-0 flex-col bg-base-100">
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-base-200 bg-base-100 px-4 py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Retour"
          className="flex text-base-content/70 hover:text-base-content"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold text-base-content">
          Créer votre entreprise
        </h1>
      </div>

      {createdCompany ? (
        <div className="flex flex-col items-center gap-2.5 px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check size={24} weight="bold" />
          </span>
          <h2 className="text-[17px] font-bold text-base-content">
            Entreprise créée
          </h2>
          <p className="max-w-70 text-sm text-base-content/60">
            {createdCompany.name} est maintenant sur JobTrack.
          </p>
          <button
            type="button"
            onClick={() => navigate(`/company/${createdCompany.id}`)}
            className="btn btn-primary btn-sm mt-2 gap-1.5"
          >
            Voir la fiche
          </button>
        </div>
      ) : (
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <p className="px-4 pt-4 pb-1 text-sm text-base-content/60">
            Renseignez les informations de votre entreprise pour publier des
            offres et recruter sur JobTrack.
          </p>

          <CompanyFormFields
            register={register}
            errors={errors}
            logoPreviewUrl={logoDataUrl}
            savingLogo={savingLogo}
            logoInputRef={logoInputRef}
            onLogoButtonClick={() => logoInputRef.current?.click()}
            onLogoFileChange={handleLogoChange}
            bannerPreviewUrl={bannerDataUrl}
            savingBanner={savingBanner}
            bannerInputRef={bannerInputRef}
            onBannerButtonClick={() => bannerInputRef.current?.click()}
            onBannerFileChange={handleBannerChange}
          />

          {serverError && (
            <p className="px-4 pt-3 text-sm text-error">{serverError}</p>
          )}

          <div className="px-4 py-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? "Création..." : "Créer mon entreprise"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
