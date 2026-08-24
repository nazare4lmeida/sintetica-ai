import { Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const PHRASE = "Descreva seu negócio e tenha o seu site pronto antes do café.";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (charIndex < PHRASE.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + PHRASE.charAt(charIndex));
        setCharIndex((prev) => prev + 1);
      }, 45); // Velocidade de digitação (45ms)
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [charIndex]);

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col justify-between px-6 py-10 sm:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground">
              <span className="size-3 rounded-full bg-accent" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">SINTÉTICA</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="mx-auto w-full max-w-sm py-12">
          <h1 className="mb-2 font-display text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mb-8 text-sm text-muted-foreground">{subtitle}</p>
          {children}
        </div>

        <div className="text-sm text-muted-foreground">{footer}</div>
      </div>

      <div className="relative hidden flex-col justify-end overflow-hidden bg-espresso p-12 text-espresso-foreground lg:flex">
        {/* Imagem de Fundo corrigida */}
        <img
          src="site-images/img-login.png"
          alt="Adesivos variados na parede branca"
          className="absolute inset-0 h-full w-full object-cover opacity-15 "
        />

        {/* Efeito Typewriter */}
        <div className="relative z-10">
          <p className="max-w-md font-display text-3xl font-bold leading-tight">
            {displayText}
            <span className="inline-block animate-pulse font-light">|</span>
          </p>
        </div>
      </div>
    </main>
  );
}

export const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent";

export const submitClass =
  "w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.01]";
