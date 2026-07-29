import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { offerCategories } from "../../data/offerCategories";

interface OfferCategorySelectorProps {
  active: string | null;
  onChange: (key: string | null) => void;
}

const SCROLL_STEP_PX = 200;

export function OfferCategorySelector({ active, onChange }: OfferCategorySelectorProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const updateScrollState = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };

    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollByStep = (direction: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: direction * SCROLL_STEP_PX, behavior: "smooth" });
  };

  // Le fondu ne doit apparaître que du côté où il reste vraiment du contenu à
  // découvrir : sinon il laisse croire qu'on peut encore scroller alors que
  // le dernier badge est déjà entièrement visible.
  const maskClass =
    canScrollLeft && canScrollRight
      ? "mask-[linear-gradient(to_right,transparent_0%,black_15%,black_85%,transparent_100%)]"
      : canScrollLeft
        ? "mask-[linear-gradient(to_right,transparent_0%,black_15%,black_100%)]"
        : canScrollRight
          ? "mask-[linear-gradient(to_right,black_85%,transparent_100%)]"
          : "";

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollByStep(-1)}
          aria-label="Catégories précédentes"
          className="hidden lg:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-7 h-7 rounded-full bg-base-content/70 text-base-100 hover:bg-base-content shadow transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      <div
        ref={scrollerRef}
        role="tablist"
        aria-label="Catégories d'offres"
        className={`flex overflow-x-auto ${maskClass} lg:mask-none`}
      >
        {offerCategories.map(({ key, label, icon: Icon, colorClass }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={label}
              onClick={() => onChange(isActive ? null : key)}
              className={`flex items-center justify-center shrink-0 px-0.5 py-0.5 transition-opacity ${
                isActive ? "opacity-100" : "opacity-50"
              }`}
            >
              <span
                className={`w-11 h-11 rounded-field flex items-center justify-center shrink-0 ${colorClass}`}
              >
                <Icon className="w-5 h-5 text-white" />
              </span>
            </button>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollByStep(1)}
          aria-label="Catégories suivantes"
          className="hidden lg:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-7 h-7 rounded-full bg-base-content/70 text-base-100 hover:bg-base-content shadow transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
