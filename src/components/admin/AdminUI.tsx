import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-ink-line/70 bg-ink-soft/60", className)}>{children}</div>
  );
}

export function PanelHead({ title, hint, right }: { title: string; hint?: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-ink-line/70 px-5 py-4">
      <div>
        <h2 className="font-display text-sm font-semibold tracking-tight text-ink-foreground">{title}</h2>
        {hint ? <p className="mt-0.5 text-xs text-ink-muted">{hint}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
}) {
  const positivo = delta?.startsWith("+");
  return (
    <Panel className="p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">{label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold tracking-tight text-ink-foreground">{value}</span>
        {delta ? (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
              positivo ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive",
            )}
          >
            {delta}
          </span>
        ) : null}
      </div>
      {hint ? <div className="mt-1 text-xs text-ink-muted">{hint}</div> : null}
    </Panel>
  );
}

const TONES: Record<string, string> = {
  ativo: "bg-accent/15 text-accent",
  publicado: "bg-accent/15 text-accent",
  pro: "bg-accent/15 text-accent",
  business: "bg-sky-400/15 text-sky-300",
  rascunho: "bg-ink-line/60 text-ink-muted",
  gratuito: "bg-ink-line/60 text-ink-muted",
  inativo: "bg-amber-400/15 text-amber-300",
  suspenso: "bg-destructive/15 text-destructive",
  admin: "bg-violet-400/15 text-violet-300",
  cliente: "bg-ink-line/60 text-ink-muted",
};

export function Tag({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        TONES[value] ?? "bg-ink-line/60 text-ink-muted",
      )}
    >
      {value}
    </span>
  );
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "px-4 py-2.5 text-left font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink-muted",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle text-ink-foreground/90", className)}>{children}</td>;
}
