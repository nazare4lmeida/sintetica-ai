import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useSites } from "@/lib/sites-store";
import { fieldClass } from "@/components/AuthShell";

export const Route = createFileRoute("/painel/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — Sintética" },
      { name: "description", content: "Ajuste seus dados, preferências e plano da conta." },
      { property: "og:title", content: "Configurações — Sintética" },
      { property: "og:description", content: "Preferências da sua conta Sintética." },
    ],
  }),
  component: Configuracoes,
});

function Configuracoes() {
  const { userName, setUserName } = useSites();
  const [name, setName] = useState(userName);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Configurações</h1>

      <section className="mt-8 rounded-xl border border-border bg-background p-6">
        <h2 className="font-display text-lg font-bold">Seus dados</h2>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setUserName(name.trim() || "Você");
            toast.success("Dados atualizados");
          }}
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              E-mail
            </label>
            <input type="email" defaultValue="lucas@barbeariaprime.com" className={fieldClass} />
          </div>
          <button
            type="submit"
            className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Salvar
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-background p-6">
        <h2 className="font-display text-lg font-bold">Seu plano</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Plano gratuito — 1 site publicado e alterações ilimitadas com a assistente.
        </p>
        <button className="mt-4 rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-surface">
          Ver planos
        </button>
      </section>
    </div>
  );
}
