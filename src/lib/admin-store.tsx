import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Base administrativa do protótipo.
 * Dados fictícios porém consistentes, persistidos localmente.
 * Ao conectar o Supabase, troque as funções deste arquivo por queries
 * nas tabelas `profiles`, `sites` e `subscriptions` — a interface é a mesma.
 */

export type Plano = "gratuito" | "pro" | "business";
export type StatusUsuario = "ativo" | "inativo" | "suspenso";
export type Papel = "admin" | "cliente";

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  plano: Plano;
  status: StatusUsuario;
  papel: Papel;
  sites: number;
  receita: number;
  criadoEm: string;
  ultimoAcesso: string;
}

export interface AdminSite {
  id: string;
  nome: string;
  slug: string;
  categoria: string;
  dono: string;
  donoId: string;
  status: "publicado" | "rascunho" | "suspenso";
  visitas: number;
  criadoEm: string;
}

const STORAGE_KEY = "sintetica.admin.v1";

const NOMES = [
  "Lucas Ferreira",
  "Mariana Duarte",
  "Rafael Menezes",
  "Camila Nogueira",
  "Diego Alencar",
  "Patrícia Lima",
  "Bruno Carvalho",
  "Juliana Prado",
  "Thiago Barreto",
  "Aline Moreira",
  "Gustavo Rocha",
  "Renata Vasques",
  "Felipe Andrade",
  "Carolina Bastos",
  "Marcelo Tavares",
  "Sofia Guimarães",
  "Eduardo Pacheco",
  "Larissa Mendes",
];

const CATEGORIAS = [
  "Barbearia",
  "Restaurante",
  "Salão de beleza",
  "Clínica",
  "Loja",
  "Portfólio",
  "Serviço profissional",
];

const NEGOCIOS = [
  "Barbearia Prime",
  "Casa Nova",
  "Studio Bella",
  "Clínica Vida",
  "Loja Alvorada",
  "Estúdio Meridiano",
  "Oficina do Corte",
  "Cantina Dom Pedro",
  "Espaço Aurora",
  "Odonto Sorriso",
  "Ateliê Norte",
  "Studio Lente",
  "Padaria Bom Dia",
  "Pet Amigo",
  "Academia Impulso",
  "Consultoria Vértice",
  "Floricultura Jardim",
  "Marcenaria Raiz",
  "Doceria Aliança",
  "Advocacia Prado",
];

const PRECO: Record<Plano, number> = { gratuito: 0, pro: 49, business: 149 };

/** Gerador determinístico — evita divergência entre servidor e navegador. */
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const slug = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function seedData(): { users: AdminUser[]; sites: AdminSite[] } {
  const r = rng(20260824);
  const base = Date.parse("2026-08-24T12:00:00Z");
  const dia = 86400000;

  const users: AdminUser[] = NOMES.map((nome, i) => {
    const plano: Plano = i % 5 === 0 ? "business" : i % 2 === 0 ? "pro" : "gratuito";
    const status: StatusUsuario = i === 7 ? "suspenso" : i % 6 === 3 ? "inativo" : "ativo";
    const sites = plano === "gratuito" ? Math.floor(r() * 2) + 1 : Math.floor(r() * 4) + 1;
    return {
      id: `u${(i + 1).toString().padStart(3, "0")}`,
      nome,
      email: `${slug(nome).replace(/-/g, ".")}@email.com`,
      plano,
      status,
      papel: i === 0 ? "admin" : "cliente",
      sites,
      receita: PRECO[plano] * (3 + Math.floor(r() * 9)),
      criadoEm: new Date(base - (300 - i * 14) * dia).toISOString(),
      ultimoAcesso: new Date(base - Math.floor(r() * 12) * dia).toISOString(),
    };
  });

  const sites: AdminSite[] = NEGOCIOS.map((nome, i) => {
    const dono = users[i % users.length]!;
    return {
      id: `s${(i + 1).toString().padStart(3, "0")}`,
      nome,
      slug: slug(nome),
      categoria: CATEGORIAS[i % CATEGORIAS.length]!,
      dono: dono.nome,
      donoId: dono.id,
      status: i % 7 === 4 ? "suspenso" : i % 3 === 1 ? "rascunho" : "publicado",
      visitas: 120 + Math.floor(r() * 4200),
      criadoEm: new Date(base - (200 - i * 9) * dia).toISOString(),
    };
  });

  return { users, sites };
}

export interface SerieMes {
  mes: string;
  novosUsuarios: number;
  sitesCriados: number;
  receita: number;
}

export function serieMensal(): SerieMes[] {
  const r = rng(7331);
  const meses = ["Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];
  let usuarios = 42;
  let sites = 68;
  let receita = 3100;
  return meses.map((mes) => {
    usuarios = Math.round(usuarios * (1.12 + r() * 0.16));
    sites = Math.round(sites * (1.1 + r() * 0.2));
    receita = Math.round(receita * (1.09 + r() * 0.14));
    return { mes, novosUsuarios: usuarios, sitesCriados: sites, receita };
  });
}

interface AdminContextValue {
  ready: boolean;
  users: AdminUser[];
  sites: AdminSite[];
  addUser: (data: Pick<AdminUser, "nome" | "email" | "plano" | "papel" | "status">) => void;
  updateUser: (id: string, patch: Partial<AdminUser>) => void;
  removeUser: (id: string) => void;
  updateAdminSite: (id: string, patch: Partial<AdminSite>) => void;
  removeAdminSite: (id: string) => void;
  reset: () => void;
}


const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [sites, setSites] = useState<AdminSite[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? (JSON.parse(raw) as { users: AdminUser[]; sites: AdminSite[] }) : seedData();
      setUsers(data.users);
      setSites(data.sites);
    } catch {
      const data = seedData();
      setUsers(data.users);
      setSites(data.sites);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ users, sites }));
  }, [ready, users, sites]);

  const addUser = useCallback(
    (data: Pick<AdminUser, "nome" | "email" | "plano" | "papel" | "status">) => {
      const agora = new Date().toISOString();
      setUsers((list) => [
        {
          ...data,
          id: `u${Date.now().toString(36)}`,
          sites: 0,
          receita: 0,
          criadoEm: agora,
          ultimoAcesso: agora,
        },
        ...list,
      ]);
    },
    [],
  );

  const updateUser = useCallback((id: string, patch: Partial<AdminUser>) => {
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers((list) => list.filter((u) => u.id !== id));
    setSites((list) => list.filter((s) => s.donoId !== id));
  }, []);

  const updateAdminSite = useCallback((id: string, patch: Partial<AdminSite>) => {
    setSites((list) => list.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const removeAdminSite = useCallback((id: string) => {
    setSites((list) => list.filter((s) => s.id !== id));
  }, []);

  const reset = useCallback(() => {
    const data = seedData();
    setUsers(data.users);
    setSites(data.sites);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      users,
      sites,
      addUser,
      updateUser,
      removeUser,
      updateAdminSite,
      removeAdminSite,
      reset,
    }),
    [ready, users, sites, addUser, updateUser, removeUser, updateAdminSite, removeAdminSite, reset],
  );


  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin precisa estar dentro de AdminProvider");
  return ctx;
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const dataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "2-digit" });
