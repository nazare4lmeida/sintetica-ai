import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSites } from "@/lib/sites-store";
import { SiteCard } from "@/components/SiteCard";
import { formatDay, formatDuration, useAnalytics } from "@/lib/site-analytics";

export const Route = createFileRoute("/painel/")({
  head: () => ({
    meta: [
      { title: "Painel — Sintética" },
      { name: "description", content: "Acompanhe seus sites, rascunhos e publicações em um só lugar." },
      { property: "og:title", content: "Painel — Sintética" },
      { property: "og:description", content: "Seus sites criados com a Sintética." },
    ],
  }),
  component: PainelHome,
});

function PainelHome() {
  const { sites, userName, ready } = useSites();
  const { total, metricsFor } = useAnalytics();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">Olá, {userName}</h1>
          <p className="mt-2 text-muted-foreground">Vamos criar algo incrível?</p>
        </div>
        <Link
          to="/criar"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
        >
          <Plus className="size-4" /> Criar novo site
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Sites criados", value: sites.length },
          { label: "Publicados", value: sites.filter((s) => s.status === "publicado").length },
          { label: "Acessos totais", value: total.views },
          { label: "Visitantes únicos", value: total.visitors },
          { label: "Tempo médio", value: formatDuration(total.avgTimeMs) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-background p-5">
            <div className="font-display text-3xl font-bold">{stat.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Acessos nos últimos 14 dias
          </h2>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={total.daily.map((d) => ({ ...d, label: formatDay(d.date) }))}>
                <defs>
                  <linearGradient id="visitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} fontSize={11} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "var(--color-foreground)",
                  }}
                  labelStyle={{ color: "var(--color-muted-foreground)" }}
                />
                <Area type="monotone" dataKey="views" stroke="var(--color-accent)" strokeWidth={2} fill="url(#visitas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Desempenho por site
          </h2>
          <ul className="mt-4 space-y-3">
            {sites.slice(0, 6).map((site) => {
              const m = metricsFor(site.id);
              return (
                <li key={site.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 flex-1 truncate font-medium">{site.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {m.views} acessos · {formatDuration(m.avgTimeMs)}
                  </span>
                </li>
              );
            })}
            {sites.length === 0 ? (
              <li className="text-sm text-muted-foreground">Nenhum site ainda.</li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Meus sites</h2>
        <Link to="/painel/sites" className="text-sm font-medium text-accent">
          Ver todos
        </Link>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ready && sites.slice(0, 3).map((site) => <SiteCard key={site.id} site={site} />)}
        {ready && sites.length === 0 && (
          <Link
            to="/criar"
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-10 text-center text-muted-foreground hover:border-accent"
          >
            <Sparkles className="size-6" />
            <span className="text-sm font-medium">Criar seu primeiro site</span>
          </Link>
        )}
        {!ready &&
          [0, 1, 2].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-xl border border-border bg-background" />
          ))}
      </div>
    </div>
  );
}
