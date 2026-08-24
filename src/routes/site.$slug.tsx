import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useSites } from "@/lib/sites-store";
import { SiteRenderer } from "@/components/site/SiteRenderer";
import { trackVisit } from "@/lib/site-analytics";

export const Route = createFileRoute("/site/$slug")({
  head: () => ({
    meta: [
      { title: "Site publicado — Sintética" },
      { name: "description", content: "Visualize o site publicado criado com a Sintética." },
      { property: "og:title", content: "Site publicado — Sintética" },
      { property: "og:description", content: "Um site criado em minutos com a Sintética." },
    ],
  }),
  component: PublicSite,
});

function PublicSite() {
  const { slug } = Route.useParams();
  const { sites, ready } = useSites();
  const site = sites.find((s) => s.slug === slug);
  const siteId = site?.id;

  useEffect(() => {
    if (!siteId) return;
    return trackVisit(siteId, slug);
  }, [siteId, slug]);

  if (!ready) return <div className="min-h-screen bg-background" />;

  if (!site) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <h1 className="font-display text-2xl font-bold">Site não encontrado</h1>
        <p className="text-sm text-muted-foreground">
          Esse endereço ainda não foi publicado nesta conta.
        </p>
        <Link
          to="/painel"
          className="rounded-full bg-foreground px-6 py-2.5 text-sm text-background"
        >
          Ir para o painel
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between gap-4 border-b border-border bg-surface px-5 py-2.5">
        <Link
          to="/editor/$siteId"
          params={{ siteId: site.id }}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Voltar ao editor
        </Link>
        <span className="font-mono text-[11px] text-muted-foreground">
          {site.slug}.sintetica.site
        </span>
      </div>
      <SiteRenderer site={site} allowThemeSwitch />
    </div>
  );
}
