import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight } from "lucide-react";
import { Panel, PanelHead, Stat, Tag, Td, Th } from "@/components/admin/AdminUI";
import { brl, dataCurta, serieMensal, useAdmin } from "@/lib/admin-store";
import { formatDay, formatDuration, useAnalytics } from "@/lib/site-analytics";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Visão geral — Console Sintética" },
      { name: "description", content: "Indicadores de usuários, sites publicados e receita recorrente." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

const CORES = ["oklch(0.696 0.17 162.48)", "oklch(0.72 0.12 240)", "oklch(0.8 0.13 85)", "oklch(0.62 0.02 286)"];

function AdminDashboard() {
  const { users, sites, ready } = useAdmin();
  const serie = useMemo(() => serieMensal(), []);
  const { total: audiencia } = useAnalytics();

  const mrr = users.reduce((t, u) => t + (u.plano === "pro" ? 49 : u.plano === "business" ? 149 : 0), 0);
  const ativos = users.filter((u) => u.status === "ativo").length;
  const publicados = sites.filter((s) => s.status === "publicado").length;
  const visitas = sites.reduce((t, s) => t + s.visitas, 0);

  const porPlano = (["gratuito", "pro", "business"] as const).map((p) => ({
    name: p,
    value: users.filter((u) => u.plano === p).length,
  }));

  const porCategoria = Object.entries(
    sites.reduce<Record<string, number>>((acc, s) => {
      acc[s.categoria] = (acc[s.categoria] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const recentes = [...sites].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 6);

  if (!ready) return <div className="flex-1" />;

  return (
    <main className="flex-1 px-5 py-8 lg:px-8">
      <header className="mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">visão geral</span>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">Operação da plataforma</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Dados consolidados dos últimos 6 meses — atualizados a cada geração de site.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Receita recorrente" value={brl(mrr)} delta="+18%" hint="Assinaturas ativas" />
        <Stat label="Usuários ativos" value={String(ativos)} delta="+12%" hint={`${users.length} cadastrados`} />
        <Stat label="Sites publicados" value={String(publicados)} delta="+9%" hint={`${sites.length} no total`} />
        <Stat
          label="Visitas acumuladas"
          value={visitas.toLocaleString("pt-BR")}
          delta="+24%"
          hint="Somatório dos sites"
        />
      </div>

      <Panel className="mt-4">
        <PanelHead
          title="Audiência real dos sites publicados"
          hint={`${audiencia.views} acessos · ${audiencia.visitors} visitantes únicos · ${formatDuration(audiencia.avgTimeMs)} de tempo médio`}
        />
        <div className="h-56 px-2 py-4">
          <ClientOnly fallback={null}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={audiencia.daily.map((d) => ({ ...d, label: formatDay(d.date) }))}>
                <defs>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CORES[2]} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={CORES[2]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.274 0.006 286.033)" vertical={false} />
                <XAxis dataKey="label" stroke="oklch(0.705 0.015 286.067)" fontSize={11} tickLine={false} />
                <YAxis allowDecimals={false} stroke="oklch(0.705 0.015 286.067)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.006 285.9)",
                    border: "1px solid oklch(0.274 0.006 286.033)",
                    borderRadius: 10,
                    fontSize: 12,
                    color: "oklch(0.985 0 0)",
                  }}
                />
                <Area type="monotone" dataKey="views" name="Acessos" stroke={CORES[2]} fill="url(#gA)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ClientOnly>
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <PanelHead title="Crescimento mensal" hint="Novos usuários e sites criados por mês" />
          <div className="h-64 px-2 py-4">
            <ClientOnly fallback={null}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={serie}>
                  <defs>
                    <linearGradient id="gU" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CORES[0]} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={CORES[0]} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CORES[1]} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={CORES[1]} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.274 0.006 286.033)" vertical={false} />
                  <XAxis dataKey="mes" stroke="oklch(0.705 0.015 286.067)" fontSize={11} tickLine={false} />
                  <YAxis stroke="oklch(0.705 0.015 286.067)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.21 0.006 285.9)",
                      border: "1px solid oklch(0.274 0.006 286.033)",
                      borderRadius: 10,
                      fontSize: 12,
                      color: "oklch(0.985 0 0)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="novosUsuarios"
                    name="Novos usuários"
                    stroke={CORES[0]}
                    fill="url(#gU)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="sitesCriados"
                    name="Sites criados"
                    stroke={CORES[1]}
                    fill="url(#gS)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </Panel>

        <Panel>
          <PanelHead title="Distribuição por plano" hint="Base atual de contas" />
          <div className="space-y-5 px-5 py-6">
            <div className="flex h-3 overflow-hidden rounded-full bg-ink-line/50">
              {porPlano.map((p, i) => (
                <div
                  key={p.name}
                  style={{
                    width: `${users.length ? (p.value / users.length) * 100 : 0}%`,
                    background: CORES[i % CORES.length],
                  }}
                />
              ))}
            </div>
            <ul className="space-y-3">
              {porPlano.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 capitalize text-ink-muted">
                    <span className="size-2.5 rounded-full" style={{ background: CORES[i % CORES.length] }} />
                    {p.name}
                  </span>
                  <span className="font-mono text-xs">
                    {p.value} conta{p.value === 1 ? "" : "s"} ·{" "}
                    {users.length ? Math.round((p.value / users.length) * 100) : 0}%
                  </span>
                </li>
              ))}
            </ul>
            <div className="rounded-lg border border-ink-line/70 p-4">
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                receita média por plano
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Pro</span>
                  <span className="font-mono text-xs">{brl(49)}/mês</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Business</span>
                  <span className="font-mono text-xs">{brl(149)}/mês</span>
                </div>
              </div>
            </div>
          </div>

        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel className="self-start">
          <PanelHead title="Nichos mais criados" hint="Sites por categoria" />
          <div className="h-72 px-2 py-4">
            <ClientOnly fallback={null}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={porCategoria} layout="vertical" margin={{ left: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="oklch(0.705 0.015 286.067)"
                    fontSize={10}
                    width={110}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Bar dataKey="value" fill={CORES[0]} radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </Panel>

        <Panel className="xl:col-span-2">
          <PanelHead
            title="Sites recentes"
            hint="Últimas criações na plataforma"
            right={
              <Link
                to="/admin/sites"
                className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                Ver todos <ArrowUpRight className="size-3.5" />
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-ink-line/70">
                <tr>
                  <Th>Site</Th>
                  <Th>Responsável</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Visitas</Th>
                  <Th>Criado</Th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((s) => (
                  <tr key={s.id} className="border-b border-ink-line/40 last:border-0">
                    <Td>
                      <div className="font-medium">{s.nome}</div>
                      <div className="font-mono text-[11px] text-ink-muted">/{s.slug}</div>
                    </Td>
                    <Td className="text-ink-muted">{s.dono}</Td>
                    <Td>
                      <Tag value={s.status} />
                    </Td>
                    <Td className="text-right font-mono text-xs">{s.visitas.toLocaleString("pt-BR")}</Td>
                    <Td className="text-xs text-ink-muted">{dataCurta(s.criadoEm)}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </main>
  );
}
