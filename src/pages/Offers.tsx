import { useEffect, useRef, useState } from "react";
import { Briefcase, Heart } from "lucide-react";
import { OfferSearchBar } from "../components/Offers/OfferSearchBar";
import { OfferCategorySelector } from "../components/Offers/OfferCategorySelector";
import { OfferCategoryBanner } from "../components/Offers/OfferCategoryBanner";
import { OfferList } from "../components/Offers/OfferList";
import { EmptyState } from "../components/Layout/EmptyState";
import { Header } from "../components/Layout/Header";
import { PageContainer } from "../components/Layout/PageContainer";
import { PageTitle } from "../components/Layout/PageTitle";
import { SectionCard } from "../components/Layout/SectionCard";
import { Tabs } from "../components/Layout/Tabs";
import { offerCategories } from "../data/offerCategories";
import { OffersApi, type OfferApiItem } from "../api/offers.api";

function pluralize(count: number, singular: string, plural: string) {
  return count > 1 ? plural : singular;
}

export function Offers() {
  // null = aucun filtre catégorie actif (toutes les offres affichées).
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"search" | "saved">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [alertEnabled, setAlertEnabled] = useState(false);
  const [offers, setOffers] = useState<OfferApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const pageTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const data = await OffersApi.getAll();
        setOffers(data);
      } catch (error) {
        console.error("Failed to load offers", error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    void loadOffers();
  }, []);

  const activeCategoryData = offerCategories.find(
    (category) => category.key === activeCategory,
  );

  const toggleSave = (id: number) => {
    setSavedIds((prev) =>
      prev.includes(id)
        ? prev.filter((savedId) => savedId !== id)
        : [...prev, id],
    );
  };

  const dismissOffer = (id: number) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== id));
  };

  // Sélection ET désélection (retour à "Toutes les offres") remontent en
  // haut : la search bar (qui n'est pas sticky) redevient visible et les
  // nouveaux résultats s'affichent depuis le début de la liste.
  const handleCategoryChange = (key: string | null) => {
    setActiveCategory(key);
    pageTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Choisir une catégorie ne filtre pas la liste courante : ça bascule vers
  // une autre colonne de résultats, propre à cette catégorie. Sans catégorie
  // active (aucun badge sélectionné), aucun filtrage n'est appliqué.
  const normalizedOffers = Array.isArray(offers) ? offers : [];

  const categoryOffers =
    activeCategory === null
      ? normalizedOffers
      : normalizedOffers.filter((offer) => offer.category === activeCategory);

  const searchedOffers = categoryOffers.filter((offer) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      offer.role.toLowerCase().includes(query) ||
      offer.company.toLowerCase().includes(query) ||
      offer.location.toLowerCase().includes(query)
    );
  });

  const savedOffers = normalizedOffers.filter((offer) =>
    savedIds.includes(offer.id),
  );
  // Plus récent d'abord : postedHoursAgo croissant (petit nombre = publié il
  // y a peu de temps).
  const visibleOffers = [
    ...(activeTab === "search" ? searchedOffers : savedOffers),
  ].sort((a, b) => a.postedHoursAgo - b.postedHoursAgo);

  const searchResultsLabel = `${searchedOffers.length} ${pluralize(searchedOffers.length, "offre trouvée", "offres trouvées")}`;
  const bannerLabel = activeCategoryData
    ? activeCategoryData.label
    : "Toutes les offres";

  return (
    <div className="flex-1 flex flex-col" ref={pageTopRef}>
      <Header />
      <PageContainer className="pt-3 flex-1 flex flex-col">
        <PageTitle
          title="Offres"
          description="Retrouvez les offres qui correspondent à votre profil"
          icon={Briefcase}
        />

        <div className="flex-1 flex flex-col">
          <div className="-mx-4 sm:mx-0 flex-1 flex flex-col">
            <div className="flex flex-col divide-y divide-base-300">
              <div className="rounded-none sm:rounded-box overflow-hidden">
                <div className="bg-base-200 shadow-sm px-4 pt-2 pb-3">
                  <Tabs<"search" | "saved">
                    items={[
                      { key: "search", label: "Recherche" },
                      { key: "saved", label: "Sauvegardées" },
                    ]}
                    value={activeTab}
                    onChange={setActiveTab}
                    variant="onMuted"
                  />
                </div>
              </div>

              {activeTab === "search" && (
                // Un seul bloc englobant bannière + badges + search bar +
                // résultats : position: sticky reste "collé" tant qu'on
                // scrolle dans les limites de SON PARENT direct. Si la
                // bannière/les badges n'avaient que la search bar comme
                // parent (~90px), le sticky se décollait dès que ce petit
                // parent avait fini de défiler. En englobant aussi les
                // résultats (bien plus grands que le viewport), les deux
                // restent collés sur toute la hauteur de la liste.
                <div className="bg-base-100">
                  {/* top-16 = hauteur du Header (h-16, sticky top-0 z-30) :
                      la bannière se colle juste en dessous, jamais dessus. */}
                  <div className="sticky top-16 z-20">
                    <OfferCategoryBanner
                      label={bannerLabel}
                      resultsLabel={searchResultsLabel}
                      alertEnabled={alertEnabled}
                      onAlertToggle={setAlertEnabled}
                      showAlertToggle={!!activeCategoryData}
                    />
                  </div>
                  {/* top-30 (120px) = header (64px) + bannière (56px, cf.
                      OFFER_CATEGORY_BANNER_HEIGHT) : les badges se collent
                      juste sous la bannière. */}
                  <div className="sticky top-30 z-20 bg-base-100">
                    <OfferCategorySelector
                      active={activeCategory}
                      onChange={handleCategoryChange}
                    />
                  </div>
                  {/* Sticky uniquement quand la recherche contient du texte :
                      une recherche vide n'a pas besoin de rester accessible
                      en permanence, elle scrolle avec le reste comme avant.
                      top-42 (168px) = header (64) + bannière (56) + badges
                      (48) : elle se colle juste sous les badges. */}
                  <div
                    className={
                      searchQuery ? "sticky top-42 z-20 bg-base-100" : ""
                    }
                  >
                    <OfferSearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                    />
                  </div>

                  <div className="border-t border-base-300">
                    {loading ? (
                      <div className="p-4 text-sm text-base-content/60">
                        Chargement des offres...
                      </div>
                    ) : visibleOffers.length === 0 ? (
                      <div className="p-4">
                        <EmptyState
                          icon={Briefcase}
                          message="Aucune offre dans cette catégorie pour l'instant."
                        />
                      </div>
                    ) : (
                      <OfferList
                        offers={visibleOffers}
                        savedIds={savedIds}
                        onToggleSave={toggleSave}
                        onDismiss={dismissOffer}
                      />
                    )}
                  </div>
                </div>
              )}

              {activeTab === "saved" && (
                <SectionCard
                  title={`${visibleOffers.length} ${pluralize(visibleOffers.length, "offre sauvegardée", "offres sauvegardées")}`}
                  collapsible={false}
                >
                  {loading ? (
                    <div className="p-4 text-sm text-base-content/60">
                      Chargement des offres...
                    </div>
                  ) : visibleOffers.length === 0 ? (
                    <EmptyState
                      icon={Heart}
                      message="Aucune offre sauvegardée pour l'instant. Cliquez sur le cœur pour en ajouter !"
                    />
                  ) : (
                    <div className="-m-4">
                      <OfferList
                        offers={visibleOffers}
                        savedIds={savedIds}
                        onToggleSave={toggleSave}
                        onDismiss={dismissOffer}
                      />
                    </div>
                  )}
                </SectionCard>
              )}
            </div>

            <div className="flex-1 bg-base-100" />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
