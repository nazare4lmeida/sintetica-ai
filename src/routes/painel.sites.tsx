import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useSites } from "@/lib/sites-store";
import { SiteCard } from "@/components/SiteCard";

export const Route = createFileRoute("/painel/sites")({
  head: () => ({
    meta: [
      { title: "Meus sites — Sintética" },
      { name: "description", content: "Todos os sites do seu negócio: rascunhos, publicados e edições." },
      { property: "og:title", content: "Meus sites — Sintética" },
      { property: "og:description", content: "Gerencie e publique seus sites." },
    ],
  }),
  component: MeusSites,
});

const FILTERS = ["Todos", "Rascunho", "Publicado"] as const;

function MeusSites() {
  const { sites, ready } = useSites();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Todos");

  const filtered = sites.filter((s) =>
    filter === "Todos" ? true : s.status === filter.toLowerCase(),
  );

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Meus sites</h1>
        <Link
          to="/criar"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
        >
          <Plus className="size-4" /> Criar novo site
        </Link>
      </div>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              filter === f
                ? "rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-primary-foreground"
                : "rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-background"
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ready && filtered.map((site) => <SiteCard key={site.id} site={site} />)}
        {ready && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">Nenhum site por aqui ainda.</p>
        )}
      </div>
    </div>
  );
}
