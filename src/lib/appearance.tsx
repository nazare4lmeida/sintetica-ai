import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Appearance = "light" | "dark";

const KEY = "sintetica.appearance";

interface AppearanceContextValue {
  appearance: Appearance;
  setAppearance: (value: Appearance) => void;
  toggle: () => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

/**
 * Script inline: aplica o tema antes da hidratação, evitando flash de cor.
 * Lê localStorage e, se indisponível (iframes com storage particionado),
 * cai para o cookie.
 */
export const appearanceBootstrapScript = `(function(){try{var v=null;try{v=localStorage.getItem("${KEY}")}catch(e){}if(!v){var m=document.cookie.match(/(?:^|; )${KEY.replace(".", "\\\\.")}=([^;]*)/);if(m){v=decodeURIComponent(m[1])}}if(!v){v=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(v==="dark"){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}}catch(e){}})();`;

function readCookie(): Appearance | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${KEY.replace(".", "\\.")}=([^;]*)`));
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return value === "dark" || value === "light" ? value : null;
}

function writeCookie(value: Appearance) {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:";
  document.cookie = `${KEY}=${value}; path=/; max-age=31536000; samesite=${secure ? "none; secure" : "lax"}`;
}

function apply(value: Appearance) {
  const root = document.documentElement;
  root.classList.toggle("dark", value === "dark");
  root.style.colorScheme = value;
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setState] = useState<Appearance>("light");

  useEffect(() => {
    let stored: Appearance | null = null;
    try {
      const raw = localStorage.getItem(KEY);
      stored = raw === "dark" || raw === "light" ? raw : null;
    } catch {
      stored = null;
    }
    const initial: Appearance =
      stored ??
      readCookie() ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setState(initial);
    apply(initial);
  }, []);

  const setAppearance = useCallback((value: Appearance) => {
    setState(value);
    apply(value);
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* armazenamento indisponível */
    }
    writeCookie(value);
  }, []);


  const value = useMemo<AppearanceContextValue>(
    () => ({
      appearance,
      setAppearance,
      toggle: () => setAppearance(appearance === "dark" ? "light" : "dark"),
    }),
    [appearance, setAppearance],
  );

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance precisa estar dentro de AppearanceProvider");
  return ctx;
}
