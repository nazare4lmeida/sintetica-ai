import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Site } from "./site-model";
import { generateSite } from "./site-generator";
import { useAuth } from "./auth-store";

/**
 * Persistência local do protótipo, isolada por conta.
 * Cada conta guarda seus próprios sites em `sintetica.sites.v2.<accountId>`,
 * então a conta de administração nunca compartilha dados com a conta de exemplo.
 */

const keyFor = (accountId: string) => `sintetica.sites.v2.${accountId}`;

interface SitesContextValue {
  sites: Site[];
  ready: boolean;
  userName: string;
  setUserName: (name: string) => void;
  getSite: (id: string) => Site | undefined;
  addSite: (site: Site) => void;
  updateSite: (site: Site) => void;
  removeSite: (id: string) => void;
  duplicateSite: (id: string) => void;
  publishSite: (id: string, publicado: boolean) => void;
}

const SitesContext = createContext<SitesContextValue | null>(null);

function seed(): Site[] {
  const demo = generateSite(
    "Tenho uma barbearia chamada Barbearia Prime, localizada em Fortaleza. Quero um site moderno e elegante, com serviços, preços e agendamento pelo WhatsApp.",
  );
  const restaurant = generateSite("Restaurante chamado Casa Nova em Fortaleza, comida caseira.");
  restaurant.status = "publicado";
  restaurant.updatedAt = new Date(Date.now() - 86400000 * 3).toISOString();
  return [demo, restaurant];
}

export function SitesProvider({ children }: { children: ReactNode }) {
  const { user, ready: authReady, updateProfile } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [ready, setReady] = useState(false);
  const loadedFor = useRef<string | null>(null);

  const accountId = user?.id ?? "visitante";

  useEffect(() => {
    if (!authReady) return;
    setReady(false);
    let list: Site[] = [];
    try {
      const raw = localStorage.getItem(keyFor(accountId));
      if (raw) list = JSON.parse(raw) as Site[];
      else if (accountId === "acc-demo") list = seed();
    } catch {
      list = [];
    }
    setSites(list);
    loadedFor.current = accountId;
    setReady(true);
  }, [authReady, accountId]);

  useEffect(() => {
    if (!ready || loadedFor.current !== accountId) return;
    try {
      localStorage.setItem(keyFor(accountId), JSON.stringify(sites));
    } catch {
      /* armazenamento indisponível */
    }
  }, [sites, ready, accountId]);

  const setUserName = useCallback((name: string) => updateProfile({ nome: name }), [updateProfile]);

  const value = useMemo<SitesContextValue>(
    () => ({
      sites,
      ready,
      userName: user?.nome ?? "Visitante",
      setUserName,
      getSite: (id) => sites.find((s) => s.id === id),
      addSite: (site) => setSites((prev) => [site, ...prev]),
      updateSite: (site) => setSites((prev) => prev.map((s) => (s.id === site.id ? site : s))),
      removeSite: (id) => setSites((prev) => prev.filter((s) => s.id !== id)),
      publishSite: (id, publicado) =>
        setSites((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: publicado ? "publicado" : "rascunho",
                  updatedAt: new Date().toISOString(),
                }
              : s,
          ),
        ),
      duplicateSite: (id) =>
        setSites((prev) => {
          const found = prev.find((s) => s.id === id);
          if (!found) return prev;
          return [
            {
              ...found,
              id: Math.random().toString(36).slice(2, 10),
              name: `${found.name} (cópia)`,
              slug: `${found.slug}-copia`,
              status: "rascunho",
              updatedAt: new Date().toISOString(),
            },
            ...prev,
          ];
        }),
    }),
    [sites, ready, user, setUserName],
  );

  return <SitesContext.Provider value={value}>{children}</SitesContext.Provider>;
}

export function useSites() {
  const ctx = useContext(SitesContext);
  if (!ctx) throw new Error("useSites precisa estar dentro de SitesProvider");
  return ctx;
}

/** "há 3 h", "há 2 d" — data relativa curta usada nos cards de site. */
export function formatUpdated(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "agora mesmo";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.round(h / 24);
  if (d < 30) return `há ${d} d`;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}
