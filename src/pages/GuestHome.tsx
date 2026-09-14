import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { useToastStore } from "../store/toast.store";
import { BOTTOM_NAV_HEIGHT } from "../constants/layout";

type Tab = "offers" | "publications";

const noop = () => {};
const FALLBACK_PREVIEW_COUNT = 3;

/**
 * Mesure combien d'éléments de hauteur `itemHeight` tiennent dans
 * `areaHeight` en plus du lien "Voir tout" (`linkHeight`), sans jamais
 * dépasser `available`. Remplace un tableau de paliers par hauteur d'écran
 * codé en dur : la liste offres/publications n'ont pas la même hauteur de
 * carte, un calcul basé sur la mesure réelle évite le rafistolage pixel par
 * pixel (et aligne naturellement les deux onglets, puisqu'ils remplissent le
 * même espace disponible par construction).
 */
function fitCount(
  areaHeight: number,
  linkHeight: number,
  itemHeight: number,
  available: number,
  columns = 1,
): number {
  if (areaHeight <= 0 || itemHeight <= 0) return FALLBACK_PREVIEW_COUNT;
  // Le lien "Voir tout" (navigation vers la page complète) doit toujours
  // rester visible, quitte à afficher 0 carte sur un écran très bas — jamais
  // l'inverse (forcer une carte au risque de repousser le lien hors champ).
  // Marge de confort (proportionnelle, pas un nombre de px fixe) pour ne pas
  // rendre pile au pixel près, sans faire sauter une carte sur les petits
  // écrans.
  const forItems = areaHeight - linkHeight - itemHeight / 256;
  const rows = Math.floor(forItems / itemHeight);
  // `columns` (grille offres en paysage large, cf. `OfferList`) : le budget
  // vertical couvre des RANGÉES, chacune tenant `columns` cartes côte à côte
  // — sert seulement d'estimation de départ pour un vrai redimensionnement,
  // l'affinage sur mesure réelle prend ensuite le relais carte par carte.
  const fit = Math.max(0, rows) * columns;
  return Math.max(0, Math.min(available, fit));
}

const TWO_COLUMN_OFFERS_QUERY = "(min-width: 768px) and (orientation: landscape)";

/**
 * Nouvel accueil invité : logo + bascule Offres/Publications donnant un
 * aperçu (nombre d'éléments mesuré dynamiquement pour remplir l'espace
 * disponible sans jamais scroller, cf. `fitCount`) + lien "Voir tout" vers la
 * page complète, ancré en bas via un spacer flex, et le CTA de création de
 * compte en pied de page (`shrink-0`, jamais compressé).
 */
export function GuestHome() {
  const [tab, setTab] = useState<Tab>("offers");
  const { theme } = useTheme();
  const isDark = theme === THEME_DARK;

  // Grille 2 colonnes pour les offres sur les résolutions paysage assez
  // larges (téléphone en paysage, tablette, desktop) : plus de largeur que
  // de hauteur disponible, autant en profiter plutôt que de laisser un
  // grand vide à droite d'une simple liste.
  const [isTwoColumnOffers, setIsTwoColumnOffers] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(TWO_COLUMN_OFFERS_QUERY).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(TWO_COLUMN_OFFERS_QUERY);
    const onChange = () => setIsTwoColumnOffers(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  const offersColumns = isTwoColumnOffers ? 2 : 1;

  // Pas de nav du bas mobile ici (remplacée par le CTA ci-dessous) : publie
  // sa hauteur réelle pour que `<Toast/>` s'empile juste au-dessus plutôt que
  // de le recouvrir (par défaut `<Toast/>` suppose la nav mobile, 64px).
  const ctaRef = useRef<HTMLDivElement>(null);
  const setBottomBarHeight = useToastStore((state) => state.setBottomBarHeight);
  useLayoutEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const publish = () => setBottomBarHeight(el.offsetHeight);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, [setBottomBarHeight]);
  useEffect(() => () => setBottomBarHeight(BOTTOM_NAV_HEIGHT), [setBottomBarHeight]);

  const {
    data: offers = [],
    isPending: offersPending,
    isFetching: offersFetching,
    refetch: refetchOffers,
  } = useQuery({
    queryKey: queryKeys.offers.all,
    queryFn: () => OffersApi.getAll(),
  });
  const {
    data: publications = [],
    isPending: publicationsPending,
    isFetching: publicationsFetching,
    refetch: refetchPublications,
  } = useQuery({
    queryKey: queryKeys.publications.all,
    queryFn: () => PublicationsApi.getAll(),
  });
  // Clic sur le logo : recharge offres + publications (les deux onglets),
  // même geste que le pull-to-refresh des pages complètes (cf. Offers /
  // Publications), pour un accueil qui ne dépend pas d'un rechargement de
  // page complet.
  const isRefreshing = offersFetching || publicationsFetching;
  const handleLogoRefresh = () => {
    void refetchOffers();
    void refetchPublications();
  };

  // Zone (liste + lien), mesurée pour connaître l'espace réellement
  // disponible ; persiste entre les deux onglets (pas démontée au switch).
  const listAreaRef = useRef<HTMLDivElement>(null);
  const [listAreaHeight, setListAreaHeight] = useState(0);
  useLayoutEffect(() => {
    const el = listAreaRef.current;
    if (!el) return;
    const publish = () => setListAreaHeight(el.clientHeight);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Offres : mesure la hauteur de la 1re carte et celle du lien, pour en
  // déduire combien en tiennent. Démarre à un nombre de repli, corrigé après
  // la première mesure (converge en un ou deux rendus).
  const [offersPreviewCount, setOffersPreviewCount] = useState(
    FALLBACK_PREVIEW_COUNT,
  );
  const offerListRef = useRef<HTMLDivElement>(null);
  const offerLinkRef = useRef<HTMLAnchorElement>(null);
  // Dernière hauteur de carte mesurée : conservée même si `offersPreviewCount`
  // retombe à 0 (rien à mesurer ce rendu-là), pour pouvoir remonter si l'écran
  // grandit ensuite.
  const offerCardHeightRef = useRef<number | null>(null);
  // Dernières mesures ayant servi à une prédiction `fitCount` : tant qu'elles
  // n'ont pas changé (pas de vrai redimensionnement), on ne relance jamais la
  // prédiction — l'affinage ci-dessous prend le relais à partir de là.
  const offerMeasureInputsRef = useRef<{
    cardHeight: number;
    linkHeight: number;
    listAreaHeight: number;
    columns: number;
  } | null>(null);
  // Plus petit compte déjà constaté trop grand (à mesures inchangées) : les
  // cartes n'ont pas toutes la même hauteur (badge "Premier candidat" présent
  // ou non), donc l'affinage tâtonne d'une carte à la fois à partir du rendu
  // réel plutôt que de la seule 1re carte — cette borne évite de retenter un
  // compte déjà trop grand et d'osciller indéfiniment.
  const offerKnownBadMinRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (tab !== "offers" || offersPending || offers.length === 0) return;
    const listEl = offerListRef.current;
    const linkEl = offerLinkRef.current;
    if (!listEl || !linkEl) return;
    // Mesure la 1re carte, jamais la dernière (cf. `trimLastPadding` : sa
    // hauteur est légèrement réduite) — une moyenne sur toute la liste
    // dépendrait du nombre affiché lui-même (la dernière carte varie avec
    // lui), ce qui peut osciller sans jamais converger. Sert uniquement de
    // point de départ rapide pour un vrai redimensionnement ; l'affinage
    // ci-dessous corrige ensuite sur la mesure réelle de la liste entière.
    // Exception : à `offersPreviewCount === 1`, la 1re carte EST aussi la
    // dernière (`previewLast` la raccourcit) — la mesurer ferait dépendre
    // `cardHeight` du compte lui-même et boucler indéfiniment (constaté en
    // pratique). On garde alors la dernière mesure fiable en cache.
    const firstCard = listEl.firstElementChild?.firstElementChild as
      | HTMLElement
      | null
      | undefined;
    if (firstCard && offersPreviewCount !== 1) {
      offerCardHeightRef.current = firstCard.offsetHeight;
    }
    const cardHeight = offerCardHeightRef.current;
    if (cardHeight === null) return;
    const linkHeight = linkEl.offsetHeight;

    const inputs = { cardHeight, linkHeight, listAreaHeight, columns: offersColumns };
    const prev = offerMeasureInputsRef.current;
    const inputsChanged =
      !prev ||
      prev.cardHeight !== cardHeight ||
      prev.linkHeight !== linkHeight ||
      prev.listAreaHeight !== listAreaHeight ||
      prev.columns !== offersColumns;
    offerMeasureInputsRef.current = inputs;

    if (inputsChanged) {
      offerKnownBadMinRef.current = null;
      const next = fitCount(
        listAreaHeight,
        linkHeight,
        cardHeight,
        offers.length,
        offersColumns,
      );
      if (next !== offersPreviewCount) {
        setOffersPreviewCount(next);
        return;
      }
    }

    const actualHeight = listEl.offsetHeight + linkHeight;
    const knownBadMin = offerKnownBadMinRef.current;
    if (actualHeight > listAreaHeight) {
      if (offersPreviewCount > 0) {
        offerKnownBadMinRef.current = Math.min(
          knownBadMin ?? Infinity,
          offersPreviewCount,
        );
        setOffersPreviewCount(offersPreviewCount - 1);
      }
    } else if (
      offersPreviewCount < offers.length &&
      (knownBadMin === null || offersPreviewCount + 1 < knownBadMin)
    ) {
      setOffersPreviewCount(offersPreviewCount + 1);
    }
  }, [
    tab,
    offersPending,
    offers.length,
    offersPreviewCount,
    listAreaHeight,
    offersColumns,
  ]);

  // Publications : même principe, cartes de hauteur différente (previewCrop).
  const [publicationsPreviewCount, setPublicationsPreviewCount] = useState(
    FALLBACK_PREVIEW_COUNT,
  );
  const pubListRef = useRef<HTMLDivElement>(null);
  const pubLinkRef = useRef<HTMLAnchorElement>(null);
  const pubCardHeightRef = useRef<number | null>(null);
  // Cf. bloc offres ci-dessus.
  const pubMeasureInputsRef = useRef<{
    cardHeight: number;
    linkHeight: number;
    listAreaHeight: number;
  } | null>(null);
  const pubKnownBadMinRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (tab !== "publications" || publicationsPending || publications.length === 0)
      return;
    const listEl = pubListRef.current;
    const linkEl = pubLinkRef.current;
    if (!listEl || !linkEl) return;
    // Idem offres : mesure la 1re carte, jamais la dernière (cf.
    // `previewLast`, qui réduit légèrement sa hauteur) — sauf à
    // `publicationsPreviewCount === 1` (la 1re carte est aussi la dernière,
    // cf. commentaire équivalent côté offres : mesurer boucle indéfiniment).
    const firstCard = listEl.firstElementChild as HTMLElement | null;
    if (firstCard && publicationsPreviewCount !== 1) {
      pubCardHeightRef.current = firstCard.offsetHeight;
    }
    const cardHeight = pubCardHeightRef.current;
    if (cardHeight === null) return;
    const linkHeight = linkEl.offsetHeight;

    const inputs = { cardHeight, linkHeight, listAreaHeight };
    const prev = pubMeasureInputsRef.current;
    const inputsChanged =
      !prev ||
      prev.cardHeight !== cardHeight ||
      prev.linkHeight !== linkHeight ||
      prev.listAreaHeight !== listAreaHeight;
    pubMeasureInputsRef.current = inputs;

    if (inputsChanged) {
      pubKnownBadMinRef.current = null;
      const next = fitCount(
        listAreaHeight,
        linkHeight,
        cardHeight,
        publications.length,
      );
      if (next !== publicationsPreviewCount) {
        setPublicationsPreviewCount(next);
        return;
      }
    }

    const actualHeight = listEl.offsetHeight + linkHeight;
    const knownBadMin = pubKnownBadMinRef.current;
    if (actualHeight > listAreaHeight) {
      if (publicationsPreviewCount > 0) {
        pubKnownBadMinRef.current = Math.min(
          knownBadMin ?? Infinity,
          publicationsPreviewCount,
        );
        setPublicationsPreviewCount(publicationsPreviewCount - 1);
      }
    } else if (
      publicationsPreviewCount < publications.length &&
      (knownBadMin === null || publicationsPreviewCount + 1 < knownBadMin)
    ) {
      setPublicationsPreviewCount(publicationsPreviewCount + 1);
    }
  }, [
    tab,
    publicationsPending,
    publications.length,
    publicationsPreviewCount,
    listAreaHeight,
  ]);

  const previewOffers = (Array.isArray(offers) ? offers : []).slice(
    0,
    offersPreviewCount,
  );
  const previewPublications = publications.slice(0, publicationsPreviewCount);

  return (
    <div className="flex h-full flex-col bg-base-100">
      <Header search="feed" divider={false} />

      <PageContainer className="flex flex-1 flex-col min-h-0">
        <button
          type="button"
          onClick={handleLogoRefresh}
          aria-label="Rafraîchir"
          className={`w-full pt-3 cursor-pointer transition-opacity ${
            isRefreshing ? "opacity-60" : "hover:opacity-80"
          }`}
        >
          <AuthLogo size="xl" compact />
        </button>

        <div className="flex items-center justify-center gap-3 pb-1 text-base">
          <button
            type="button"
            onClick={() => setTab("offers")}
            className={`cursor-pointer px-2 py-1.5 font-semibold ${
              tab === "offers" ? "text-link" : "text-base-content/40"
            }`}
          >
            Offres
          </button>
          <span className="text-base-content/20">|</span>
          <button
            type="button"
            onClick={() => setTab("publications")}
            className={`cursor-pointer px-2 py-1.5 font-semibold ${
              tab === "publications" ? "text-link" : "text-base-content/40"
            }`}
          >
            Publications
          </button>
        </div>

        <div
          ref={listAreaRef}
          className="-mx-4 flex min-h-0 flex-1 flex-col sm:mx-0"
        >
          {tab === "offers" ? (
            offersPending ? (
              <p className="p-4 text-center text-sm text-base-content/60">
                Chargement des offres…
              </p>
            ) : (
              <>
                <div ref={offerListRef}>
                  <OfferList
                    offers={previewOffers}
                    savedIds={[]}
                    showActions={false}
                    trimLastPadding
                    columns={offersColumns}
                    onToggleSave={noop}
                    onDismiss={noop}
                  />
                </div>
                {/* Un spacer identique avant et après le lien centre celui-ci
                    dans l'espace restant sous les cartes (plutôt que de le
                    coller en bas) — le nombre d'offres affiché est calculé
                    pour ne jamais forcer ces spacers sous 0 (cf. `fitCount`). */}
                <div className="flex-1" />
                <Link
                  ref={offerLinkRef}
                  to="/offers"
                  className="flex items-center justify-center gap-1 py-1.5 text-sm font-semibold text-base-content hover:text-link"
                >
                  Voir toutes les offres
                  <CaretRight className="h-4 w-4" />
                </Link>
                <div className="flex-1" />
              </>
            )
          ) : publicationsPending ? (
            <p className="p-4 text-center text-sm text-base-content/60">
              Chargement des publications…
            </p>
          ) : (
            <>
              <div ref={pubListRef} className="divide-y divide-base-200">
                {previewPublications.map((publication, index) => (
                  <PublicationCard
                    key={publication.id}
                    publication={publication}
                    previewCrop
                    previewLast={index === previewPublications.length - 1}
                  />
                ))}
              </div>
              <div className="flex-1" />
              <Link
                ref={pubLinkRef}
                to="/publications"
                className="flex items-center justify-center gap-1 py-1.5 text-sm font-semibold text-base-content hover:text-link"
              >
                Voir toutes les publications
                <CaretRight className="h-4 w-4" />
              </Link>
              <div className="flex-1" />
            </>
          )}
        </div>
      </PageContainer>

      <div
        ref={ctaRef}
        className="shrink-0 bg-base-100 px-4 pb-5 text-center"
      >
        <Link
          to="/auth?mode=signup"
          className={
            isDark
              ? "btn border-none bg-base-200 text-base-content/80 transition-colors hover:bg-base-300 hover:text-base-content"
              : "btn border-none bg-primary text-primary-content shadow-sm transition-opacity hover:opacity-90"
          }
        >
          Créer un compte pour postuler
        </Link>
      </div>
    </div>
  );
}
