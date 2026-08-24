import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Trash2, Pencil, X, ExternalLink } from "lucide-react";
import { Panel, PanelHead, Tag, Td, Th } from "@/components/admin/AdminUI";
import { dataCurta, useAdmin, type AdminSite } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/sites")({
  head: () => ({
    meta: [
      { title: "Sites — Console Sintética" },
      { name: "description", content: "Gestão de todos os sites da plataforma: status, edição e exclusão." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSites,
});

const STATUS = ["publicado", "rascunho", "suspenso"] as const;
type StatusSite = (typeof STATUS)[number];

const inputCls =
  "rounded-lg border border-ink-line/70 bg-ink px-3 py-2 text-sm text-ink-foreground outline-none placeholder:text-ink-muted focus:border-accent";

function AdminSites() {
  const { sites, updateAdminSite, removeAdminSite, ready } = useAdmin();
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<"todos" | StatusSite>("todos");
  const [editando, setEditando] = useState<AdminSite | null>(null);
  const [confirmar, setConfirmar] = useState<AdminSite | null>(null);

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return sites.filter(
      (s) =>
        (status === "todos" || s.status === status) &&
        (!q ||
          s.nome.toLowerCase().includes(q) ||
          s.slug.includes(q) ||
          s.dono.toLowerCase().includes(q) ||
          s.categoria.toLowerCase().includes(q)),
    );
  }, [sites, busca, status]);

  if (!ready) return <div className="flex-1" />;

  return (
    <main className="flex-1 px-5 py-8 lg:px-8">
      <header className="mb-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">catálogo</span>
        <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">Sites da plataforma</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {lista.length} de {sites.length} sites · suspenda, edite dados ou exclua conteúdos irregulares.
        </p>
      </header>

      <Panel>
        <PanelHead
          title="Todos os sites"
          hint="Moderação e manutenção"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-muted" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar site, slug ou dono"
                  className={`${inputCls} w-60 pl-8`}
                />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className={`${inputCls} w-36`}
              >
                <option value="todos">Status</option>
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-line/70">
              <tr>
                <Th>Site</Th>
                <Th>Categoria</Th>
                <Th>Responsável</Th>
                <Th>Status</Th>
                <Th className="text-right">Visitas</Th>
                <Th>Criado</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {lista.map((s) => (
                <tr key={s.id} className="border-b border-ink-line/40 last:border-0 hover:bg-ink-soft/40">
                  <Td>
                    <div className="font-medium">{s.nome}</div>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-ink-muted">
                      /site/{s.slug}
                      <ExternalLink className="size-3" />
                    </div>
                  </Td>
                  <Td className="text-ink-muted">{s.categoria}</Td>
                  <Td className="text-ink-muted">{s.dono}</Td>
                  <Td>
                    <select
                      value={s.status}
                      onChange={(e) => updateAdminSite(s.id, { status: e.target.value as StatusSite })}
                      aria-label={`Status de ${s.nome}`}
                      className="rounded-full border border-ink-line/70 bg-ink px-2 py-1 text-[11px] text-ink-foreground outline-none focus:border-accent"
                    >
                      {STATUS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </Td>
                  <Td className="text-right font-mono text-xs">{s.visitas.toLocaleString("pt-BR")}</Td>
                  <Td className="text-xs text-ink-muted">{dataCurta(s.criadoEm)}</Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditando(s)}
                        aria-label={`Editar ${s.nome}`}
                        className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-ink-line/60 hover:text-ink-foreground"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => setConfirmar(s)}
                        aria-label={`Excluir ${s.nome}`}
                        className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-destructive/15 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))}
              {lista.length === 0 && (
                <tr>
                  <Td className="py-10 text-center text-ink-muted">Nenhum site encontrado.</Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {editando && (
        <Dialogo titulo="Editar site" onClose={() => setEditando(null)}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateAdminSite(editando.id, {
                nome: editando.nome,
                slug: editando.slug,
                categoria: editando.categoria,
                status: editando.status,
              });
              setEditando(null);
            }}
          >
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                Nome
              </span>
              <input
                className={`${inputCls} w-full`}
                value={editando.nome}
                onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  Slug
                </span>
                <input
                  className={`${inputCls} w-full`}
                  value={editando.slug}
                  onChange={(e) => setEditando({ ...editando, slug: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                  Categoria
                </span>
                <input
                  className={`${inputCls} w-full`}
                  value={editando.categoria}
                  onChange={(e) => setEditando({ ...editando, categoria: e.target.value })}
                />
              </label>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Tag value={editando.status} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="rounded-lg px-4 py-2 text-sm text-ink-muted hover:text-ink-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
                >
                  Salvar
                </button>
              </div>
            </div>
          </form>
        </Dialogo>
      )}

      {confirmar && (
        <Dialogo titulo="Excluir site" onClose={() => setConfirmar(null)}>
          <p className="text-sm text-ink-muted">
            O site <span className="text-ink-foreground">{confirmar.nome}</span> será removido da plataforma e sairá
            do ar imediatamente.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setConfirmar(null)}
              className="rounded-lg px-4 py-2 text-sm text-ink-muted hover:text-ink-foreground"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                removeAdminSite(confirmar.id);
                setConfirmar(null);
              }}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground"
            >
              Excluir
            </button>
          </div>
        </Dialogo>
      )}
    </main>
  );
}

function Dialogo({
  titulo,
  onClose,
  children,
}: {
  titulo: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-xl border border-ink-line/70 bg-ink-soft p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold tracking-tight">{titulo}</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-ink-muted hover:text-ink-foreground">
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
