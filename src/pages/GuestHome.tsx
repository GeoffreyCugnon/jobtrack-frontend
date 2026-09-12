import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { CaretRight } from "@phosphor-icons/react";

import { Header } from "../components/Layout/Header";
import { PageContainer } from "../components/Layout/PageContainer";
import { AuthLogo } from "../components/Auth/AuthLogo";
import { OfferList } from "../components/Offers/OfferList";
import PublicationCard from "../components/Publications/PublicationCard";
import { OffersApi } from "../api/offers.api";
import { PublicationsApi } from "../api/publications.api";
import { queryKeys } from "../api/query-keys";
import { useTheme } from "../context/Theme/useTheme";
import { THEME_DARK } from "../context/Theme/themeContextInstance";

// Paliers (hauteur d'écran croissante -> nombre d'offres) : le header + le
// logo + les tabs + le CTA sont de hauteur fixe, seule la liste peut
// grandir/rétrécir pour combler l'espace restant sans jamais scroller.
// [seuil min de hauteur, nb d'offres] — trié croissant, on prend le dernier
// palier atteint (ex: 360x780 -> 3 ; téléphone haut -> 4 ; tablette -> 5).
const OFFERS_PREVIEW_TIERS: [minHeight: number, count: number][] = [
  [0, 3],
  [800, 3],
  [870, 4],
  [1000, 6],
  [1220, 7],
  [1400, 8],
];
const PUBLICATIONS_PREVIEW_COUNT = 3;

function offersPreviewCountFor(viewportHeight: number): number {
  const tier = [...OFFERS_PREVIEW_TIERS]
    .reverse()
    .find(([minHeight]) => viewportHeight >= minHeight);
  return tier?.[1] ?? OFFERS_PREVIEW_TIERS[0][1];
}

type Tab = "offers" | "publications";

const noop = () => {};

/**
 * Nouvel accueil invité : logo + bascule Offres/Publications donnant un
 * aperçu (offres : 3 à 8 selon la hauteur d'écran, cf.
 * `OFFERS_PREVIEW_TIERS` ; publications : 3 fixe) + lien "Voir
 * tout" vers la page complète, poussé jusqu'en bas par un spacer flex, et le
 * CTA de création de compte en pied de page (`shrink-0`, jamais compressé).
 * Pas de scroll voulu : c'est le nombre d'offres affichées qui s'adapte à la
 * hauteur d'écran (cf. `OFFERS_PREVIEW_TIERS`), pas les espacements.
 */
export function GuestHome() {
  const [tab, setTab] = useState<Tab>("offers");
  const { theme } = useTheme();
  const isDark = theme === THEME_DARK;

  const [viewportHeight, setViewportHeight] = useState(
    () => window.innerHeight,
  );
  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const offersPreviewCount = offersPreviewCountFor(viewportHeight);

  const { data: offers = [], isPending: offersPending } = useQuery({
    queryKey: queryKeys.offers.all,
    queryFn: () => OffersApi.getAll(),
  });
  const { data: publications = [], isPending: publicationsPending } = useQuery(
    {
      queryKey: queryKeys.publications.all,
      queryFn: () => PublicationsApi.getAll(),
    },
  );

  const previewOffers = (Array.isArray(offers) ? offers : []).slice(
    0,
    offersPreviewCount,
  );
  const previewPublications = publications.slice(
    0,
    PUBLICATIONS_PREVIEW_COUNT,
  );

  return (
    <div className="flex h-full flex-col bg-base-100">
      <Header search="feed" />

      <PageContainer className="flex flex-1 flex-col min-h-0">
        <div className="pt-6">
          <AuthLogo size="xl" />
        </div>

        <div className="flex items-center justify-center gap-3 pb-3 text-base">
          <button
            type="button"
            onClick={() => setTab("offers")}
            className={`cursor-pointer px-2 py-1 font-semibold ${
              tab === "offers" ? "text-link" : "text-base-content/40"
            }`}
          >
            Offres
          </button>
          <span className="text-base-content/20">|</span>
          <button
            type="button"
            onClick={() => setTab("publications")}
            className={`cursor-pointer px-2 py-1 font-semibold ${
              tab === "publications" ? "text-link" : "text-base-content/40"
            }`}
          >
            Publications
          </button>
        </div>

        <div className="-mx-4 flex flex-1 flex-col sm:mx-0">
          {tab === "offers" ? (
            offersPending ? (
              <p className="p-4 text-center text-sm text-base-content/60">
                Chargement des offres…
              </p>
            ) : (
              <>
                <OfferList
                  offers={previewOffers}
                  savedIds={[]}
                  showActions={false}
                  onToggleSave={noop}
                  onDismiss={noop}
                />
                <Link
                  to="/offers"
                  className="flex items-center justify-center gap-1 pt-2 pb-4 text-sm font-semibold text-base-content hover:text-link"
                >
                  Voir toutes les offres
                  <CaretRight className="h-4 w-4" />
                </Link>
              </>
            )
          ) : publicationsPending ? (
            <p className="p-4 text-center text-sm text-base-content/60">
              Chargement des publications…
            </p>
          ) : (
            <>
              <div className="divide-y divide-base-200">
                {previewPublications.map((publication) => (
                  <PublicationCard
                    key={publication.id}
                    publication={publication}
                  />
                ))}
              </div>
              <Link
                to="/publications"
                className="flex items-center justify-center gap-1 py-4 text-sm font-semibold text-base-content hover:text-link"
              >
                Voir toutes les publications
                <CaretRight className="h-4 w-4" />
              </Link>
            </>
          )}

          <div className="flex-1" />
        </div>
      </PageContainer>

      <div className="shrink-0 border-t border-base-200 bg-base-100 px-4 py-4 text-center shadow-[0_-2px_10px_rgba(15,23,42,0.06)]">
        <p className="mb-3 text-base text-base-content/60">
          Créez un compte pour postuler, suivre vos candidatures et échanger
          avec votre réseau.
        </p>
        <Link
          to="/auth?mode=signup"
          className={
            isDark
              ? "btn border-none bg-base-200 text-base-content/80 transition-colors hover:bg-base-300 hover:text-base-content"
              : "btn border-none bg-primary text-primary-content shadow-sm transition-opacity hover:opacity-90"
          }
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
}
