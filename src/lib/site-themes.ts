import type { CSSProperties } from "react";
import type { ThemeId } from "./site-model";

export interface SiteTheme {
  id: ThemeId;
  label: string;
  description: string;
  swatch: string[];
  vars: CSSProperties;
  darkVars: CSSProperties;
}

interface Palette {
  bg: string;
  fg: string;
  muted: string;
  surface: string;
  line: string;
  accent: string;
  accentFg: string;
}

interface Shape {
  radius: string;
  fontBody: string;
  fontHeading: string;
  tracking: string;
}

const vars = (p: Palette, s: Shape): CSSProperties =>
  ({
    "--site-bg": p.bg,
    "--site-fg": p.fg,
    "--site-muted": p.muted,
    "--site-surface": p.surface,
    "--site-line": p.line,
    "--site-accent": p.accent,
    "--site-accent-fg": p.accentFg,
    "--site-radius": s.radius,
    "--site-font-body": s.fontBody,
    "--site-font-heading": s.fontHeading,
    "--site-tracking": s.tracking,
  }) as CSSProperties;

const theme = (
  id: ThemeId,
  label: string,
  description: string,
  shape: Shape,
  light: Palette,
  dark: Palette,
): SiteTheme => ({
  id,
  label,
  description,
  swatch: [light.bg, light.surface, light.fg, light.accent],
  vars: vars(light, shape),
  darkVars: vars(dark, shape),
});

const sans: Shape = {
  radius: "12px",
  fontBody: "'Inter', sans-serif",
  fontHeading: "'Inter Tight', sans-serif",
  tracking: "-0.02em",
};

export const SITE_THEMES: SiteTheme[] = [
  theme(
    "moderno",
    "Moderno",
    "Claro, direto e contemporâneo",
    sans,
    {
      bg: "#ffffff",
      fg: "#09090b",
      muted: "#71717a",
      surface: "#f4f4f5",
      line: "#e4e4e7",
      accent: "#10b981",
      accentFg: "#ffffff",
    },
    {
      bg: "#0b0d0c",
      fg: "#f4f4f5",
      muted: "#9a9aa2",
      surface: "#151816",
      line: "#252a27",
      accent: "#34d399",
      accentFg: "#08120e",
    },
  ),
  theme(
    "minimalista",
    "Minimalista",
    "Muito espaço e pouco ruído",
    { ...sans, radius: "0px", fontHeading: "'Inter', sans-serif", tracking: "-0.01em" },
    {
      bg: "#fafafa",
      fg: "#18181b",
      muted: "#8b8b94",
      surface: "#ffffff",
      line: "#ebebeb",
      accent: "#18181b",
      accentFg: "#ffffff",
    },
    {
      bg: "#131313",
      fg: "#f2f2f2",
      muted: "#9b9b9b",
      surface: "#1b1b1b",
      line: "#2a2a2a",
      accent: "#f2f2f2",
      accentFg: "#131313",
    },
  ),
  theme(
    "elegante",
    "Elegante",
    "Escuro, sóbrio e sofisticado",
    { ...sans, radius: "4px", tracking: "0.01em" },
    {
      bg: "#111111",
      fg: "#f5f3ee",
      muted: "#9c988e",
      surface: "#1a1a1a",
      line: "#2a2a2a",
      accent: "#c9a84c",
      accentFg: "#111111",
    },
    {
      bg: "#0a0a0a",
      fg: "#f5f3ee",
      muted: "#938f86",
      surface: "#141414",
      line: "#242424",
      accent: "#d9b95f",
      accentFg: "#0a0a0a",
    },
  ),
  theme(
    "vibrante",
    "Vibrante",
    "Cores fortes e energia alta",
    { ...sans, radius: "20px", tracking: "-0.03em" },
    {
      bg: "#fffdf7",
      fg: "#1b1200",
      muted: "#7a6a4f",
      surface: "#fff3d6",
      line: "#f0dfae",
      accent: "#ff6b35",
      accentFg: "#ffffff",
    },
    {
      bg: "#160f06",
      fg: "#fdf3e2",
      muted: "#b39d78",
      surface: "#211708",
      line: "#3a2a12",
      accent: "#ff8552",
      accentFg: "#160f06",
    },
  ),
  theme(
    "profissional",
    "Profissional",
    "Confiança e clareza corporativa",
    { ...sans, radius: "8px", tracking: "-0.015em" },
    {
      bg: "#ffffff",
      fg: "#0f1b3d",
      muted: "#5b6785",
      surface: "#eef2f8",
      line: "#dbe2ee",
      accent: "#1e3a5f",
      accentFg: "#ffffff",
    },
    {
      bg: "#0a1122",
      fg: "#e8eefb",
      muted: "#93a2c2",
      surface: "#111c33",
      line: "#1e2c48",
      accent: "#6f9fd8",
      accentFg: "#0a1122",
    },
  ),
  theme(
    "luxuoso",
    "Luxuoso",
    "Preto profundo com dourado",
    { ...sans, radius: "2px", tracking: "0.04em" },
    {
      bg: "#0b0b0b",
      fg: "#f0e9dc",
      muted: "#a2957c",
      surface: "#141210",
      line: "#2b2620",
      accent: "#d8b45c",
      accentFg: "#0b0b0b",
    },
    {
      bg: "#070707",
      fg: "#f0e9dc",
      muted: "#9b8e76",
      surface: "#100e0c",
      line: "#231f1a",
      accent: "#e2c273",
      accentFg: "#070707",
    },
  ),

  /* — paletas autorais — */
  theme(
    "argila",
    "Argila",
    "Terracota queimada com sálvia",
    { ...sans, radius: "16px", tracking: "-0.015em" },
    {
      bg: "#fbf6f1",
      fg: "#2f231c",
      muted: "#8a7566",
      surface: "#f2e6da",
      line: "#e3d2c2",
      accent: "#c4654a",
      accentFg: "#fff7f2",
    },
    {
      bg: "#1a1310",
      fg: "#f3e6dc",
      muted: "#a99283",
      surface: "#241a15",
      line: "#38271f",
      accent: "#e08161",
      accentFg: "#1a1310",
    },
  ),
  theme(
    "editorial",
    "Editorial",
    "Papel, tinta e tipografia serifada",
    {
      radius: "2px",
      fontBody: "'Inter', sans-serif",
      fontHeading: "'Playfair Display', Georgia, serif",
      tracking: "-0.01em",
    },
    {
      bg: "#f6f3ec",
      fg: "#171717",
      muted: "#6f6a60",
      surface: "#ffffff",
      line: "#e0dbd0",
      accent: "#8c2f39",
      accentFg: "#ffffff",
    },
    {
      bg: "#141311",
      fg: "#f2eee5",
      muted: "#a39d90",
      surface: "#1d1b18",
      line: "#2e2b26",
      accent: "#c9525f",
      accentFg: "#141311",
    },
  ),
  theme(
    "aurora",
    "Aurora",
    "Índigo profundo com ciano elétrico",
    { ...sans, radius: "18px", tracking: "-0.03em" },
    {
      bg: "#f7f8ff",
      fg: "#131634",
      muted: "#5f6690",
      surface: "#ecefff",
      line: "#dce1f8",
      accent: "#4f46e5",
      accentFg: "#ffffff",
    },
    {
      bg: "#0a0b1c",
      fg: "#e9ebff",
      muted: "#9aa0cf",
      surface: "#121533",
      line: "#20244d",
      accent: "#7c8cff",
      accentFg: "#0a0b1c",
    },
  ),
  theme(
    "botanico",
    "Botânico",
    "Verde musgo e creme natural",
    { ...sans, radius: "14px", tracking: "-0.015em" },
    {
      bg: "#f7f8f2",
      fg: "#18231a",
      muted: "#6b7a68",
      surface: "#e9efe2",
      line: "#d6e0cc",
      accent: "#3f6b46",
      accentFg: "#f7f8f2",
    },
    {
      bg: "#0e1410",
      fg: "#e9efe2",
      muted: "#93a58f",
      surface: "#151d17",
      line: "#243027",
      accent: "#7bb684",
      accentFg: "#0e1410",
    },
  ),
  theme(
    "solar",
    "Solar",
    "Areia quente com âmbar cítrico",
    { ...sans, radius: "22px", tracking: "-0.03em" },
    {
      bg: "#fffaf0",
      fg: "#241a06",
      muted: "#8a7548",
      surface: "#fdefd4",
      line: "#f2ddb4",
      accent: "#e0891a",
      accentFg: "#1b1204",
    },
    {
      bg: "#161005",
      fg: "#fbeed4",
      muted: "#b6a179",
      surface: "#20180a",
      line: "#362a13",
      accent: "#f5ab3c",
      accentFg: "#161005",
    },
  ),
  theme(
    "noturno",
    "Noturno",
    "Grafite frio com magenta neon",
    { ...sans, radius: "10px", tracking: "-0.02em" },
    {
      bg: "#f4f5f7",
      fg: "#16181d",
      muted: "#666c78",
      surface: "#e8eaee",
      line: "#d8dbe2",
      accent: "#d0347f",
      accentFg: "#ffffff",
    },
    {
      bg: "#0c0e12",
      fg: "#eceef3",
      muted: "#8d94a3",
      surface: "#141821",
      line: "#222835",
      accent: "#ff5fa8",
      accentFg: "#0c0e12",
    },
  ),
];

export const getTheme = (id: ThemeId): SiteTheme =>
  SITE_THEMES.find((t) => t.id === id) ?? (SITE_THEMES[0] as SiteTheme);
