import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  X,
  Newspaper,
  Briefcase,
  FileText,
  MessageCircle,
  Users,
  Building2,
  type LucideIcon,
} from "@/lib/icons";
import { cvItems, letterItems } from "../../data/documents";
import { OffersApi } from "../../api/offers.api";
import { PublicationsApi } from "../../api/publications.api";
import { UserApi } from "../../api/user.api";
import { useAuthStore } from "../../store/auth.store";
import { useMessagingOptional } from "../../context/Messaging/useMessaging";
import type { Offer } from "../../types/offer.type";
import type { Publication } from "../../types/publication.types";
import type { User } from "../../types/user.type";

const MAX_PER_GROUP = 4;

interface GlobalSearchProps {
  /**
   * "feed" (accueil / fil d'actus) : cherche dans les actus + les offres.
   * "app" (toutes les autres pages) : ajoute utilisateurs, documents et
   *   conversations — et les entreprises dès qu'une source sera branchée.
   */
  scope?: "feed" | "app";
}

interface ResultItem {
  key: string;
  title: string;
  subtitle?: string;
  onSelect: () => void;
}

interface ResultGroup {
  label: string;
  icon: LucideIcon;
  /** Cible de l'en-tête de groupe cliquable (page "voir tout" correspondante). */
  href: string;
  items: ResultItem[];
}

/**
 * Barre de recherche du header. Cherche en direct dans plusieurs sources
 * (actus et offres toujours ; utilisateurs / documents / conversations en
 * scope "app") et affiche un dropdown groupé. Offres et utilisateurs sont
 * chargés à la première ouverture.
 */
export function GlobalSearch({ scope = "app" }: GlobalSearchProps) {
  const navigate = useNavigate();
  const messaging = useMessagingOptional();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Un invité ne voit jamais les groupes "app" (documents, conversations,
  // utilisateurs, entreprises) : ces données sont privées. Quel que soit le
  // scope demandé par la page, on retombe sur "feed" tant qu'on n'est pas
  // connecté (utile après une déconnexion sur une page en scope "app").
  const effectiveScope: "feed" | "app" = isAuthenticated ? scope : "feed";

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  // Offres + actus : chargées une seule fois, à la première ouverture
  // (routes publiques).
  useEffect(() => {
    if (!open || offers.length > 0) return;
    let cancelled = false;
    OffersApi.getAll()
      .then((data) => {
        if (!cancelled) setOffers(data);
      })
      .catch((error) =>
        console.error("Recherche : chargement des offres échoué", error),
      );
    return () => {
      cancelled = true;
    };
  }, [open, offers.length]);

  useEffect(() => {
    if (!open || publications.length > 0) return;
    let cancelled = false;
    PublicationsApi.getAll()
      .then((data) => {
        if (!cancelled) setPublications(data);
      })
      .catch((error) =>
        console.error("Recherche : chargement des actus échoué", error),
      );
    return () => {
      cancelled = true;
    };
  }, [open, publications.length]);

  // Utilisateurs : scope "app" et session authentifiée uniquement
  // (`GET /user` est protégé par AuthGuard).
  useEffect(() => {
    if (effectiveScope !== "app" || !open || users.length > 0) return;
    let cancelled = false;
    UserApi.getAll()
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((error) =>
        console.error("Recherche : chargement des utilisateurs échoué", error),
      );
    return () => {
      cancelled = true;
    };
  }, [effectiveScope, open, users.length]);

  // Fermeture au clic extérieur / touche Échap.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  // Les pages liste "Actus" et "Offres" filtrent sur `?q=` : l'en-tête de
  // groupe y renvoie avec le terme courant.
  const qSuffix = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const buildGroups = (): ResultGroup[] => {
    const groups: ResultGroup[] = [];

    const pubs = publications.filter(
      (p) =>
        p.authorName.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q),
    );
    if (pubs.length) {
      groups.push({
        label: "Actus",
        icon: Newspaper,
        href: `/publications${qSuffix}`,
        items: pubs.map((p) => ({
          key: `pub-${p.id}`,
          title: p.title || p.authorName,
          subtitle: p.content,
          onSelect: () => go(`/publications/${p.id}`),
        })),
      });
    }

    const offs = offers.filter(
      (o) =>
        o.role.toLowerCase().includes(q) ||
        o.company.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q),
    );
    if (offs.length) {
      groups.push({
        label: "Offres",
        icon: Briefcase,
        href: `/offers${qSuffix}`,
        items: offs.map((o) => ({
          key: `off-${o.id}`,
          title: o.role,
          subtitle: `${o.company} · ${o.location}`,
          onSelect: () => go(`/offers/${o.id}`),
        })),
      });
    }

    if (effectiveScope !== "app") return groups;

    const matchedUsers = users.filter(
      (u) =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
    if (matchedUsers.length) {
      groups.push({
        label: "Utilisateurs",
        icon: Users,
        href: "/network",
        items: matchedUsers.map((u) => ({
          key: `usr-${u.id}`,
          title: `${u.first_name} ${u.last_name}`.trim() || u.email,
          subtitle: u.email,
          onSelect: () => go("/network"),
        })),
      });
    }

    // Entreprises : pas encore de source de données (cf. `Network`, liste
    // locale vide). Le groupe apparaîtra dès qu'on branchera une liste ici.
    const companies: { id: number; name: string; sector?: string }[] = [];
    const matchedCompanies = companies.filter((c) =>
      c.name.toLowerCase().includes(q),
    );
    if (matchedCompanies.length) {
      groups.push({
        label: "Entreprises",
        icon: Building2,
        href: "/network",
        items: matchedCompanies.map((c) => ({
          key: `cmp-${c.id}`,
          title: c.name,
          subtitle: c.sector,
          onSelect: () => go("/network"),
        })),
      });
    }

    const docs = [
      ...cvItems.map((d) => ({ ...d, kind: "cv" as const })),
      ...letterItems.map((d) => ({ ...d, kind: "letter" as const })),
    ].filter((d) => d.title.toLowerCase().includes(q));
    if (docs.length) {
      groups.push({
        label: "Documents",
        icon: FileText,
        href: "/documents",
        items: docs.map((d) => ({
          key: `doc-${d.id}`,
          title: d.title,
          subtitle: `${d.kind === "cv" ? "CV" : "Lettre"} · modifié le ${d.updatedAt}`,
          onSelect: () =>
            go(
              d.kind === "cv"
                ? `/documents/cv/${d.id}`
                : `/documents/letters/${d.id}`,
            ),
        })),
      });
    }

    // Aperçu : seul le dernier message de chaque conversation est chargé
    // (cf. MessagingProvider) — la recherche dans `messages` reste donc
    // partielle tant que le fil complet n'est pas ouvert.
    const convs = (messaging?.conversations ?? []).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q)),
    );
    if (convs.length) {
      groups.push({
        label: "Conversations",
        icon: MessageCircle,
        href: "/messaging/manage",
        items: convs.map((c) => ({
          key: `cnv-${c.id}`,
          title: c.name,
          subtitle: c.lastMessage,
          onSelect: () => {
            setOpen(false);
            if (messaging) messaging.openConversation(c.id);
            else navigate("/messaging/manage");
          },
        })),
      });
    }

    return groups;
  };

  const groups = q ? buildGroups() : [];
  const totalResults = groups.reduce((sum, g) => sum + g.items.length, 0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Entrée : ouvre la page "voir tout" du premier groupe qui a des résultats
    // (à défaut, le fil d'actus).
    go(groups[0]?.href ?? "/publications");
  };

  // Le libellé suit l'état de connexion, pas le `scope` : un membre connecté
  // voit toujours "Chercher" quelle que soit la page (le `scope` ne pilote
  // que les sources réellement interrogées).
  const placeholder = isAuthenticated
    ? "Chercher"
    : "Chercher une actu ou une offre...";
  const ariaLabel = isAuthenticated
    ? "Chercher parmi les actus, offres, utilisateurs, documents et conversations"
    : "Chercher parmi les actus et les offres";

  return (
    <div ref={rootRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        {/* Pattern DaisyUI 5 : l'icône est un enfant du champ (jamais masquée
            par le fond de l'input, contrairement à un icône en position
            absolue). */}
        <label className="input input-sm h-10 w-full items-center gap-2 rounded-full border border-base-content/70 bg-base-100 focus-within:border-primary focus-within:outline-none">
          <Search className="w-4 h-4 shrink-0 text-base-content/70" />
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            aria-label={ariaLabel}
            className="grow"
          />
          {query && (
            <button
              type="button"
              aria-label="Effacer la recherche"
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
              className="btn btn-ghost btn-circle btn-xs shrink-0 text-base-content/40 hover:text-base-content"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </label>
      </form>

      {open && q.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-box border border-base-200 bg-base-100 shadow-xl overflow-hidden">
          {totalResults === 0 ? (
            <p className="px-4 py-3 text-sm text-base-content/60">
              Aucun résultat pour «&nbsp;{query.trim()}&nbsp;»
            </p>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto py-1">
              {groups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <section key={group.label}>
                    <button
                      type="button"
                      onClick={() => go(group.href)}
                      className="flex w-full items-center justify-between px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wide text-base-content/50 hover:text-primary"
                    >
                      {group.label}
                      <span className="normal-case tracking-normal text-[0.7rem] font-medium">
                        voir tout
                      </span>
                    </button>
                    {group.items.slice(0, MAX_PER_GROUP).map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={item.onSelect}
                        className="flex w-full items-start gap-3 px-4 py-2 text-left hover:bg-base-200"
                      >
                        <GroupIcon className="mt-0.5 w-4 h-4 shrink-0 text-base-content/40" />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium truncate">
                            {item.title}
                          </span>
                          {item.subtitle && (
                            <span className="block text-xs text-base-content/60 truncate">
                              {item.subtitle}
                            </span>
                          )}
                        </span>
                      </button>
                    ))}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
