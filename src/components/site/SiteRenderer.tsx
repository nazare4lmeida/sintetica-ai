import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Section, Site } from "@/lib/site-model";
import { getTheme } from "@/lib/site-themes";

interface Props {
  site: Site;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  interactive?: boolean;
  /** Mostra o botão flutuante de claro/escuro dentro do site gerado. */
  allowThemeSwitch?: boolean;
}

const surface = { backgroundColor: "var(--site-surface)" };
const line = { borderColor: "var(--site-line)" };
const muted = { color: "var(--site-muted)" };
const accentBg = { backgroundColor: "var(--site-accent)", color: "var(--site-accent-fg)" };
const heading = {
  fontFamily: "var(--site-font-heading)",
  letterSpacing: "var(--site-tracking)",
};
const radius = { borderRadius: "var(--site-radius)" };

function localImageUrl(src: string) {
  const match = src.match(/images\.unsplash\.com\/(photo-[^?]+)/);
  return match?.[1] ? `/site-images/${match[1]}.jpg` : src;
}

function Img({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const localSrc = localImageUrl(src);
  const [currentSrc, setCurrentSrc] = useState(localSrc);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(localImageUrl(src));
    setFailed(false);
  }, [src]);

  if (failed) {
    // Fallback local: mantém o layout íntegro quando a imagem remota é bloqueada.
    return (
      <div
        aria-label={alt}
        role="img"
        className={cn("h-full w-full", className)}
        style={{
          ...radius,
          ...style,
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--site-accent) 35%, transparent), color-mix(in oklab, var(--site-fg) 12%, transparent))",
        }}
      />
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      onError={() => {
        if (currentSrc !== src) {
          setCurrentSrc(src);
          return;
        }
        setFailed(true);
      }}
      className={cn("h-full w-full object-cover", className)}
      style={{ ...radius, ...style }}
    />
  );
}


function SectionBody({ section }: { section: Section }) {
  switch (section.type) {
    case "header":
      return (
        <header
          className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-5 sm:px-10"
          style={line}
        >
          <span className="text-lg font-extrabold" style={heading}>
            {section.logo}
          </span>
          <nav className="hidden gap-6 text-[11px] font-semibold uppercase tracking-widest md:flex">
            {section.menu.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </nav>
          <button className="px-5 py-2 text-xs font-bold" style={{ ...accentBg, ...radius }}>
            {section.buttonLabel}
          </button>
        </header>
      );

    case "hero":
      if (section.image && section.align !== "left") {
        return (
          <section className="relative border-b" style={line}>
            <div className="absolute inset-0">
              <Img src={section.image} alt={section.title} style={{ borderRadius: 0 }} />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.72))" }}
              />
            </div>
            <div className="relative px-6 py-28 text-center sm:px-12">
              {section.badge ? (
                <span
                  className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ ...accentBg, ...radius }}
                >
                  {section.badge}
                </span>
              ) : null}
              <h1
                className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl"
                style={heading}
              >
                {section.title}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base text-white/80">{section.subtitle}</p>
              <button className="mt-8 px-8 py-3 text-sm font-bold" style={{ ...accentBg, ...radius }}>
                {section.buttonLabel}
              </button>
            </div>
          </section>
        );
      }
      return (
        <section className="border-b px-6 py-20 sm:px-12" style={line}>
          <div
            className={cn(
              "grid items-center gap-10",
              section.image ? "md:grid-cols-2" : "text-center",
            )}
          >
            <div className={section.image ? "text-left" : ""}>
              {section.badge ? (
                <span
                  className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ ...accentBg, ...radius }}
                >
                  {section.badge}
                </span>
              ) : null}
              <h1
                className="mt-5 max-w-2xl text-4xl font-extrabold leading-[1.08] sm:text-5xl"
                style={heading}
              >
                {section.title}
              </h1>
              <p className="mt-5 max-w-xl text-base" style={muted}>
                {section.subtitle}
              </p>
              <button className="mt-8 px-8 py-3 text-sm font-bold" style={{ ...accentBg, ...radius }}>
                {section.buttonLabel}
              </button>
            </div>
            {section.image ? (
              <div className="aspect-[4/3] overflow-hidden" style={radius}>
                <Img src={section.image} alt={section.title} />
              </div>
            ) : null}
          </div>
        </section>
      );

    case "services":
      return (
        <section className="border-b px-6 py-16 sm:px-12" style={line}>
          <h2 className="mb-8 text-2xl font-bold" style={heading}>
            {section.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {section.items.map((item) => (
              <div key={item.name} className="overflow-hidden border" style={{ ...line, ...radius }}>
                {item.image ? (
                  <div className="aspect-[16/10] overflow-hidden">
                    <Img src={item.image} alt={item.name} style={{ borderRadius: 0 }} />
                  </div>
                ) : null}
                <div className="p-5">
                  <div className="text-base font-semibold">{item.name}</div>
                  {item.note ? (
                    <div className="mt-1 text-xs" style={muted}>
                      {item.note}
                    </div>
                  ) : null}
                  <div className="mt-4 text-xl font-bold" style={{ color: "var(--site-accent)" }}>
                    {item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case "about":
      return (
        <section className="border-b px-6 py-16 sm:px-12" style={line}>
          <div className={cn("grid gap-8", section.image ? "md:grid-cols-2 md:items-center" : "md:grid-cols-[1fr_1.4fr]")}>
            {section.image ? (
              <div className="aspect-[4/3] overflow-hidden" style={radius}>
                <Img src={section.image} alt={section.title} />
              </div>
            ) : null}
            <div>
              <h2 className="text-2xl font-bold" style={heading}>
                {section.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed" style={muted}>
                {section.text}
              </p>
              {section.stats?.length ? (
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {section.stats.map((st) => (
                    <div key={st.label}>
                      <div className="text-2xl font-bold" style={{ color: "var(--site-accent)" }}>
                        {st.value}
                      </div>
                      <div className="text-xs" style={muted}>
                        {st.label}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      );

    case "gallery": {
      const imgs = section.images?.length ? section.images.slice(0, section.count) : [];
      return (
        <section className="border-b px-6 py-16 sm:px-12" style={line}>
          <h2 className="mb-8 text-2xl font-bold" style={heading}>
            {section.title}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: section.count }).map((_, i) => {
              const src = imgs[i % (imgs.length || 1)];
              return (
                <div key={i} className="aspect-[4/3] overflow-hidden" style={{ ...surface, ...radius }}>
                  {src ? <Img src={src} alt={`${section.title} ${i + 1}`} /> : null}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case "testimonials":
      return (
        <section className="border-b px-6 py-16 sm:px-12" style={line}>
          <h2 className="mb-8 text-2xl font-bold" style={heading}>
            {section.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {section.items.map((item) => (
              <div key={item.name} className="p-5" style={{ ...surface, ...radius }}>
                <div className="text-sm" style={{ color: "var(--site-accent)" }}>
                  {"★".repeat(item.rating)}
                </div>
                <p className="mt-3 text-sm leading-relaxed">{item.text}</p>
                <div className="mt-4 flex items-center gap-3">
                  {item.avatar ? (
                    <div className="size-9 shrink-0 overflow-hidden rounded-full">
                      <Img
                        src={item.avatar}
                        alt={item.name}
                        className="rounded-full"
                        style={{ borderRadius: "9999px" }}
                      />
                    </div>
                  ) : null}
                  <div className="text-xs font-semibold" style={muted}>
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    case "pricing":
      return (
        <section className="border-b px-6 py-16 sm:px-12" style={line}>
          <h2 className="mb-8 text-2xl font-bold" style={heading}>
            {section.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {section.plans.map((plan) => (
              <div
                key={plan.name}
                className="border p-6"
                style={{
                  ...line,
                  ...radius,
                  ...(plan.highlight ? { borderColor: "var(--site-accent)" } : {}),
                }}
              >
                <div className="text-sm font-semibold">{plan.name}</div>
                <div className="mt-2 text-2xl font-bold" style={heading}>
                  {plan.price}
                </div>
                <ul className="mt-4 space-y-2 text-xs" style={muted}>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      );

    case "location":
      return (
        <section className="border-b px-6 py-16 sm:px-12" style={line}>
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-bold" style={heading}>
                {section.title}
              </h2>
              <p className="mt-3 text-sm" style={muted}>
                {section.address}
                <br />
                {section.city}
              </p>
            </div>
            <div className="aspect-[16/9] overflow-hidden" style={{ ...surface, ...radius }}>
              {section.image ? (
                <Img src={section.image} alt={section.title} />
              ) : (
                <div
                  className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em]"
                  style={muted}
                >
                  Mapa
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case "contact":
      return (
        <section className="border-b px-6 py-16 sm:px-12" style={line}>
          <h2 className="mb-8 text-2xl font-bold" style={heading}>
            {section.title}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3 text-sm">
            <div>
              <div className="text-xs uppercase tracking-widest" style={muted}>
                WhatsApp
              </div>
              <div className="mt-2 font-semibold">{section.whatsapp}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest" style={muted}>
                Instagram
              </div>
              <div className="mt-2 font-semibold">{section.instagram}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest" style={muted}>
                Horários
              </div>
              <div className="mt-2 space-y-1" style={muted}>
                {section.hours.map((h) => (
                  <div key={h}>{h}</div>
                ))}
              </div>
            </div>
          </div>
        </section>
      );

    case "cta":
      if (section.image) {
        return (
          <section className="relative overflow-hidden">
            <div className="absolute inset-0">
              <Img src={section.image} alt={section.title} style={{ borderRadius: 0 }} />
              <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,.6)" }} />
            </div>
            <div className="relative px-6 py-20 text-center sm:px-12">
              <h2 className="text-3xl font-bold text-white" style={heading}>
                {section.title}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/80">{section.subtitle}</p>
              <button className="mt-6 px-8 py-3 text-sm font-bold" style={{ ...accentBg, ...radius }}>
                {section.buttonLabel}
              </button>
            </div>
          </section>
        );
      }
      return (
        <section className="px-6 py-16 text-center sm:px-12" style={surface}>
          <h2 className="text-2xl font-bold" style={heading}>
            {section.title}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm" style={muted}>
            {section.subtitle}
          </p>
          <button className="mt-6 px-8 py-3 text-sm font-bold" style={{ ...accentBg, ...radius }}>
            {section.buttonLabel}
          </button>
        </section>
      );

    case "footer":
      return (
        <footer className="px-6 py-10 text-center text-xs sm:px-12" style={muted}>
          {section.text}
        </footer>
      );

    default:
      return null;
  }
}

export function SiteRenderer({
  site,
  selectedId,
  onSelect,
  interactive = false,
  allowThemeSwitch = false,
}: Props) {
  const theme = getTheme(site.theme);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const isDark = mode === "dark";

  return (
    <div
      className="site-scope relative min-h-full"
      style={isDark ? theme.darkVars : theme.vars}
    >
      {allowThemeSwitch ? (
        <button
          type="button"
          onClick={() => setMode(isDark ? "light" : "dark")}
          aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
          className="fixed bottom-5 right-5 z-40 inline-flex size-11 items-center justify-center border shadow-lg backdrop-blur"
          style={{
            ...radius,
            ...line,
            backgroundColor: "var(--site-surface)",
            color: "var(--site-fg)",
          }}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      ) : null}
      {site.sections.map((section) => (
        <div
          key={section.id}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          onClick={interactive ? () => onSelect?.(section.id) : undefined}
          onKeyDown={
            interactive
              ? (e) => {
                  if (e.key === "Enter") onSelect?.(section.id);
                }
              : undefined
          }
          className={cn(
            "relative transition-shadow",
            interactive && "cursor-pointer hover:ring-2 hover:ring-accent/40 hover:ring-inset",
            interactive && selectedId === section.id && "ring-2 ring-accent ring-inset",
          )}
        >
          <SectionBody section={section} />
        </div>
      ))}
    </div>
  );
}
