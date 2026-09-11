import { useRef, useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useToastStore } from "../../store/toast.store";
import { logError } from "../../utils/log";

const MAX_LOGO_FILE_BYTES = 8 * 1024 * 1024;
const MAX_BANNER_FILE_BYTES = 8 * 1024 * 1024;

function EditCompanyHeader() {
  const navigate = useNavigate();
  return (
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
        Modifier votre entreprise
      </h1>
    </div>
  );
}

// Composant séparé pour que les hooks de formulaire (useForm, useState du
// logo) s'initialisent directement avec les vraies valeurs de `company` —
// `EditCompany` ne le monte qu'une fois la requête résolue.
function EditCompanyForm({ company }: { company: Company }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(
    company.logo_url,
  );
  const [savingLogo, setSavingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [bannerDataUrl, setBannerDataUrl] = useState<string | null>(
    company.banner_url,
  );
  const [savingBanner, setSavingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCompanyValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: company.name,
      business_sector: company.business_sector,
      size: company.size ?? undefined,
      website: company.website ?? "",
      address: company.address ?? "",
      description: company.description ?? "",
    },
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
      await CompanyApi.update(company.id, {
        name: values.name,
        business_sector: values.business_sector,
        size: values.size || undefined,
        website: values.website ? withScheme(values.website) : undefined,
        address: values.address || undefined,
        description: values.description || undefined,
        logo_url: logoDataUrl || undefined,
        banner_url: bannerDataUrl || undefined,
      });
      void queryClient.invalidateQueries({ queryKey: queryKeys.company.mineAll });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.company.detail(company.id),
      });
      useToastStore.getState().addToast("Entreprise mise à jour", "success");
      navigate(`/company/${company.id}`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status < 500) {
        setServerError(
          getBackendErrorMessage(error, "Une entreprise porte déjà ce nom."),
        );
      } else {
        logError("company/update", error);
        setServerError("Une erreur est survenue. Réessaie plus tard.");
      }
    }
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)} noValidate>
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
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

export function EditCompany() {
  const { id } = useParams<{ id: string }>();
  const {
    data: company,
    isPending,
    isError,
  } = useQuery({
    queryKey: queryKeys.company.detail(id ?? ""),
    queryFn: () => CompanyApi.getById(id ?? ""),
    enabled: !!id,
  });

  return (
    <div className="flex min-h-full shrink-0 flex-col bg-base-100">
      <EditCompanyHeader />

      {isPending ? (
        <p className="px-4 py-8 text-sm text-base-content/60">Chargement…</p>
      ) : isError || !company ? (
        <p className="px-4 py-8 text-sm text-base-content/60">
          Impossible de charger votre entreprise.
        </p>
      ) : (
        <EditCompanyForm company={company} />
      )}
    </div>
  );
}
