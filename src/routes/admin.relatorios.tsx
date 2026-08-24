import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download } from "lucide-react";
import { Panel, PanelHead, Stat, Td, Th } from "@/components/admin/AdminUI";
import { brl, serieMensal, useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Console Sintética" },
      { name: "description", content: "Relatórios de receita, adoção de planos e desempenho dos sites." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminRelatorios,
});

const EIXO = "oklch(0.705 0.015 286.067)";
const TOOLTIP = {
  background: "oklch(0.21 0.006 285.9)",
  border: "1px solid oklch(0.274 0.006 286.033)",
  borderRadius: 10,
  fontSize: 12,
  color: "oklch(0.985 0 0)",
};

function AdminRelatorios() {
  const { users, sites, ready } = useAdmin();
  const serie = useMemo(() => serieMensal(), []);
  const [periodo, setPeriodo] = useState<"3" | "6">("6");

  const dados = periodo === "3" ? serie.slice(-3) : serie;

  const receitaTotal = users.reduce((t, u) => t + u.receita, 0);
  const ticket = users.length ? receitaTotal / users.length : 0;
  const conversao = users.length
    ? (users.filter((u) => u.plano !== "gratuito").length / users.length) * 100
    : 0;
  const churn = users.length ? (users.filter((u) => u.status !== "ativo").length / users.length) * 100 : 0;

  const topSites = [...sites].sort((a, b) => b.visitas - a.visitas).slice(0, 8);
  const topClientes = [...users].sort((a, b) => b.receita - a.receita).slice(0, 8);

  const exportarCsv = () => {
    const linhas = [
      ["mes", "novos_usuarios", "sites_criados", "receita"],
      ...dados.map((d) => [d.mes, String(d.novosUsuarios), String(d.sitesCriados), String(d.receita)]),
    ];
    const csv = linhas.map((l) => l.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-sintetica-${periodo}m.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!ready) return <div className="flex-1" />;

  return (
    <main className="flex-1 px-5 py-8 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">análise</span>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">Relatórios</h1>
          <p className="mt-1 text-sm text-ink-muted">Receita, adoção de planos e desempenho dos sites publicados.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-ink-line/70 p-0.5">
            {(["3", "6"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriodo(p)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  periodo === p ? "bg-ink-soft text-ink-foreground" : "text-ink-muted"
                }`}
              >
                {p} meses
              </button>
            ))}
          </div>
          <button
            onClick={exportarCsv}
            className="flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-xs font-medium text-accent-foreground"
          >
            <Download className="size-3.5" />
            Exportar CSV
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Receita acumulada" value={brl(receitaTotal)} delta="+21%" hint="Todos os planos" />
        <Stat label="Ticket médio" value={brl(Math.round(ticket))} delta="+6%" hint="Por conta" />
        <Stat label="Conversão paga" value={`${conversao.toFixed(1)}%`} delta="+3,2%" hint="Gratuito → pago" />
        <Stat label="Contas inativas" value={`${churn.toFixed(1)}%`} delta="-1,4%" hint="Inativas + suspensas" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead title="Receita por mês" hint="Assinaturas recorrentes" />
          <div className="h-64 px-2 py-4">
            <ClientOnly fallback={null}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dados}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.274 0.006 286.033)" vertical={false} />
                  <XAxis dataKey="mes" stroke={EIXO} fontSize={11} tickLine={false} />
                  <YAxis stroke={EIXO} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP} formatter={(v: number) => brl(v)} />
                  <Line
                    type="monotone"
                    dataKey="receita"
                    name="Receita"
                    stroke="oklch(0.696 0.17 162.48)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </Panel>

        <Panel>
          <PanelHead title="Sites criados" hint="Volume mensal de gerações" />
          <div className="h-64 px-2 py-4">
            <ClientOnly fallback={null}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dados}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.274 0.006 286.033)" vertical={false} />
                  <XAxis dataKey="mes" stroke={EIXO} fontSize={11} tickLine={false} />
                  <YAxis stroke={EIXO} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP} />
                  <Bar dataKey="sitesCriados" name="Sites" fill="oklch(0.72 0.12 240)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ClientOnly>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel>
          <PanelHead title="Sites com mais tráfego" hint="Top 8 por visitas" />
          <table className="w-full text-sm">
            <thead className="border-b border-ink-line/70">
              <tr>
                <Th>Site</Th>
                <Th>Categoria</Th>
                <Th className="text-right">Visitas</Th>
              </tr>
            </thead>
            <tbody>
              {topSites.map((s) => (
                <tr key={s.id} className="border-b border-ink-line/40 last:border-0">
                  <Td className="font-medium">{s.nome}</Td>
                  <Td className="text-ink-muted">{s.categoria}</Td>
                  <Td className="text-right font-mono text-xs">{s.visitas.toLocaleString("pt-BR")}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel>
          <PanelHead title="Clientes por receita" hint="Top 8 contas" />
          <table className="w-full text-sm">
            <thead className="border-b border-ink-line/70">
              <tr>
                <Th>Cliente</Th>
                <Th>Plano</Th>
                <Th className="text-right">Receita</Th>
              </tr>
            </thead>
            <tbody>
              {topClientes.map((u) => (
                <tr key={u.id} className="border-b border-ink-line/40 last:border-0">
                  <Td className="font-medium">{u.nome}</Td>
                  <Td className="text-ink-muted">{u.plano}</Td>
                  <Td className="text-right font-mono text-xs">{brl(u.receita)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </main>
  );
}
