import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Trash2, Pencil, Plus, X } from "lucide-react";
import { Panel, PanelHead, Tag, Td, Th } from "@/components/admin/AdminUI";
import {
  brl,
  dataCurta,
  useAdmin,
  type AdminUser,
  type Papel,
  type Plano,
  type StatusUsuario,
} from "@/lib/admin-store";

export const Route = createFileRoute("/admin/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários — Console Sintética" },
      { name: "description", content: "Gestão de contas: plano, status, papel e exclusão de usuários." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminUsuarios,
});

const PLANOS: Plano[] = ["gratuito", "pro", "business"];
const STATUS: StatusUsuario[] = ["ativo", "inativo", "suspenso"];
const PAPEIS: Papel[] = ["admin", "cliente"];

const inputCls =
  "rounded-lg border border-ink-line/70 bg-ink px-3 py-2 text-sm text-ink-foreground outline-none placeholder:text-ink-muted focus:border-accent";

type NovoUsuario = Pick<AdminUser, "nome" | "email" | "plano" | "papel" | "status">;

const NOVO_VAZIO: NovoUsuario = {
  nome: "",
  email: "",
  plano: "gratuito",
  papel: "cliente",
  status: "ativo",
};

function AdminUsuarios() {
  const { users, addUser, updateUser, removeUser, ready } = useAdmin();

  const [busca, setBusca] = useState("");
  const [plano, setPlano] = useState<"todos" | Plano>("todos");
  const [status, setStatus] = useState<"todos" | StatusUsuario>("todos");
  const [editando, setEditando] = useState<AdminUser | null>(null);
  const [novo, setNovo] = useState<NovoUsuario | null>(null);
  const [confirmar, setConfirmar] = useState<AdminUser | null>(null);


  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return users.filter(
      (u) =>
        (plano === "todos" || u.plano === plano) &&
        (status === "todos" || u.status === status) &&
        (!q || u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)),
    );
  }, [users, busca, plano, status]);

  if (!ready) return <div className="flex-1" />;

  return (
    <main className="flex-1 px-5 py-8 lg:px-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">contas</span>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight">Usuários</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {lista.length} de {users.length} contas · crie, edite plano/papel/status ou remova o acesso.
          </p>
        </div>
        <button
          onClick={() => setNovo({ ...NOVO_VAZIO })}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          <Plus className="size-4" /> Novo usuário
        </button>
      </header>


      <Panel>
        <PanelHead
          title="Base de clientes"
          hint="Alterações são aplicadas imediatamente"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-ink-muted" />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar nome ou e-mail"
                  className={`${inputCls} w-56 pl-8`}
                />
              </div>
              <select
                value={plano}
                onChange={(e) => setPlano(e.target.value as typeof plano)}
                className={`${inputCls} w-32`}
              >
                <option value="todos">Plano</option>
                {PLANOS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className={`${inputCls} w-32`}
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
                <Th>Usuário</Th>
                <Th>Plano</Th>
                <Th>Papel</Th>
                <Th>Status</Th>
                <Th className="text-right">Sites</Th>
                <Th className="text-right">Receita</Th>
                <Th>Último acesso</Th>
                <Th className="text-right">Ações</Th>
              </tr>
            </thead>
            <tbody>
              {lista.map((u) => (
                <tr key={u.id} className="border-b border-ink-line/40 last:border-0 hover:bg-ink-soft/40">
                  <Td>
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-ink-line/60 text-xs font-bold">
                        {u.nome.charAt(0)}
                      </span>
                      <div>
                        <div className="font-medium">{u.nome}</div>
                        <div className="text-xs text-ink-muted">{u.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Tag value={u.plano} />
                  </Td>
                  <Td>
                    <Tag value={u.papel} />
                  </Td>
                  <Td>
                    <Tag value={u.status} />
                  </Td>
                  <Td className="text-right font-mono text-xs">{u.sites}</Td>
                  <Td className="text-right font-mono text-xs">{brl(u.receita)}</Td>
                  <Td className="text-xs text-ink-muted">{dataCurta(u.ultimoAcesso)}</Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditando(u)}
                        aria-label={`Editar ${u.nome}`}
                        className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-ink-line/60 hover:text-ink-foreground"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => setConfirmar(u)}
                        aria-label={`Excluir ${u.nome}`}
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
                  <Td className="py-10 text-center text-ink-muted">Nenhum usuário encontrado.</Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {editando && (
        <Modal titulo="Editar usuário" onClose={() => setEditando(null)}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateUser(editando.id, {
                nome: editando.nome,
                email: editando.email,
                plano: editando.plano,
                papel: editando.papel,
                status: editando.status,
              });
              setEditando(null);
            }}
          >
            <Campo label="Nome">
              <input
                className={`${inputCls} w-full`}
                value={editando.nome}
                onChange={(e) => setEditando({ ...editando, nome: e.target.value })}
              />
            </Campo>
            <Campo label="E-mail">
              <input
                className={`${inputCls} w-full`}
                type="email"
                value={editando.email}
                onChange={(e) => setEditando({ ...editando, email: e.target.value })}
              />
            </Campo>
            <div className="grid grid-cols-3 gap-3">
              <Campo label="Plano">
                <select
                  className={`${inputCls} w-full`}
                  value={editando.plano}
                  onChange={(e) => setEditando({ ...editando, plano: e.target.value as Plano })}
                >
                  {PLANOS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Papel">
                <select
                  className={`${inputCls} w-full`}
                  value={editando.papel}
                  onChange={(e) => setEditando({ ...editando, papel: e.target.value as Papel })}
                >
                  {PAPEIS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Status">
                <select
                  className={`${inputCls} w-full`}
                  value={editando.status}
                  onChange={(e) => setEditando({ ...editando, status: e.target.value as StatusUsuario })}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
            <div className="flex justify-end gap-2 pt-2">
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
                Salvar alterações
              </button>
            </div>
          </form>
        </Modal>
      )}

      {novo && (
        <Modal titulo="Novo usuário" onClose={() => setNovo(null)}>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              addUser({ ...novo, nome: novo.nome.trim(), email: novo.email.trim() });
              setNovo(null);
            }}
          >
            <Campo label="Nome">
              <input
                required
                className={`${inputCls} w-full`}
                value={novo.nome}
                onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
              />
            </Campo>
            <Campo label="E-mail">
              <input
                required
                type="email"
                className={`${inputCls} w-full`}
                value={novo.email}
                onChange={(e) => setNovo({ ...novo, email: e.target.value })}
              />
            </Campo>
            <div className="grid grid-cols-3 gap-3">
              <Campo label="Plano">
                <select
                  className={`${inputCls} w-full`}
                  value={novo.plano}
                  onChange={(e) => setNovo({ ...novo, plano: e.target.value as Plano })}
                >
                  {PLANOS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Papel">
                <select
                  className={`${inputCls} w-full`}
                  value={novo.papel}
                  onChange={(e) => setNovo({ ...novo, papel: e.target.value as Papel })}
                >
                  {PAPEIS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Campo>
              <Campo label="Status">
                <select
                  className={`${inputCls} w-full`}
                  value={novo.status}
                  onChange={(e) => setNovo({ ...novo, status: e.target.value as StatusUsuario })}
                >
                  {STATUS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setNovo(null)}
                className="rounded-lg px-4 py-2 text-sm text-ink-muted hover:text-ink-foreground"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
              >
                Criar usuário
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmar && (

        <Modal titulo="Excluir usuário" onClose={() => setConfirmar(null)}>
          <p className="text-sm text-ink-muted">
            Isso remove <span className="text-ink-foreground">{confirmar.nome}</span> e todos os sites vinculados à
            conta. A ação não pode ser desfeita.
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
                removeUser(confirmar.id);
                setConfirmar(null);
              }}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground"
            >
              Excluir definitivamente
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

function Modal({
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
