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
 * Autenticação do protótipo (armazenamento local).
 * Contas de cliente e de administrador são separadas: o console /admin
 * só abre para contas com papel "admin".
 * Ao conectar o Supabase, troque estas funções por supabase.auth.* — a
 * interface pública (login, logout, register, currentUser) permanece igual.
 */

export type Papel = "admin" | "cliente";

export interface Account {
  id: string;
  nome: string;
  email: string;
  senha: string;
  papel: Papel;
  criadoEm: string;
}

const ACCOUNTS_KEY = "sintetica.accounts.v1";
const SESSION_KEY = "sintetica.session.v1";

export const CONTA_ADMIN = { email: "admin@sintetica.app", senha: "admin@2026" };
export const CONTA_DEMO = { email: "lucas@barbeariaprime.com", senha: "cliente123" };

function seedAccounts(): Account[] {
  const agora = new Date().toISOString();
  return [
    {
      id: "acc-admin",
      nome: "Administração Sintética",
      email: CONTA_ADMIN.email,
      senha: CONTA_ADMIN.senha,
      papel: "admin",
      criadoEm: agora,
    },
    {
      id: "acc-demo",
      nome: "Lucas Ferreira",
      email: CONTA_DEMO.email,
      senha: CONTA_DEMO.senha,
      papel: "cliente",
      criadoEm: agora,
    },
  ];
}

interface AuthContextValue {
  ready: boolean;
  accounts: Account[];
  user: Account | null;
  isAdmin: boolean;
  login: (email: string, senha: string) => { ok: boolean; error?: string; papel?: Papel };
  register: (nome: string, email: string, senha: string) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<Pick<Account, "nome" | "email" | "senha">>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let list: Account[];
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      list = raw ? (JSON.parse(raw) as Account[]) : seedAccounts();
    } catch {
      list = seedAccounts();
    }
    // Garante que as contas padrão sempre existam.
    for (const base of seedAccounts()) {
      if (!list.some((a) => a.email === base.email)) list.push(base);
    }
    setAccounts(list);
    try {
      setUserId(localStorage.getItem(SESSION_KEY));
    } catch {
      setUserId(null);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      if (userId) localStorage.setItem(SESSION_KEY, userId);
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* armazenamento indisponível */
    }
  }, [ready, accounts, userId]);

  const login = useCallback<AuthContextValue["login"]>(
    (email, senha) => {
      const found = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) return { ok: false, error: "Não encontramos uma conta com esse e-mail." };
      if (found.senha !== senha) return { ok: false, error: "Senha incorreta." };
      setUserId(found.id);
      return { ok: true, papel: found.papel };
    },
    [accounts],
  );

  const register = useCallback<AuthContextValue["register"]>(
    (nome, email, senha) => {
      const clean = email.trim().toLowerCase();
      if (accounts.some((a) => a.email.toLowerCase() === clean))
        return { ok: false, error: "Já existe uma conta com esse e-mail." };
      const account: Account = {
        id: `acc-${Math.random().toString(36).slice(2, 10)}`,
        nome: nome.trim() || clean.split("@")[0] || "Cliente",
        email: clean,
        senha,
        papel: "cliente",
        criadoEm: new Date().toISOString(),
      };
      setAccounts((list) => [...list, account]);
      setUserId(account.id);
      return { ok: true };
    },
    [accounts],
  );

  const logout = useCallback(() => setUserId(null), []);

  const updateProfile = useCallback<AuthContextValue["updateProfile"]>(
    (patch) => {
      setAccounts((list) => list.map((a) => (a.id === userId ? { ...a, ...patch } : a)));
    },
    [userId],
  );

  const user = accounts.find((a) => a.id === userId) ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      accounts,
      user,
      isAdmin: user?.papel === "admin",
      login,
      register,
      logout,
      updateProfile,
    }),
    [ready, accounts, user, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return ctx;
}
