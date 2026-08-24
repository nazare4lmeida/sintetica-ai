import { Link } from "@tanstack/react-router";
import { MoreHorizontal, Copy, Trash2, ExternalLink, Eye, Clock, Users, Globe, Undo2 } from "lucide-react";
import type { Site } from "@/lib/site-model";
import { SiteRenderer } from "@/components/site/SiteRenderer";
import { formatUpdated, useSites } from "@/lib/sites-store";
import { formatDuration, useAnalytics } from "@/lib/site-analytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteCard({ site }: { site: Site }) {
  const { removeSite, duplicateSite, publishSite } = useSites();
  const { metricsFor } = useAnalytics();
  const metrics = metricsFor(site.id);

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-accent">
      <div className="relative h-44 overflow-hidden border-b border-border bg-surface">
        <div className="pointer-events-none absolute left-0 top-0 w-[1000px] origin-top-left scale-[0.34]">
          <SiteRenderer site={site} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{site.name}</h3>
            <p className="text-xs text-muted-foreground">{site.category}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-md p-1 text-muted-foreground hover:bg-surface">
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => duplicateSite(site.id)}>
                <Copy className="size-4" /> Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => publishSite(site.id, site.status !== "publicado")}>
                {site.status === "publicado" ? (
                  <>
                    <Undo2 className="size-4" /> Voltar para rascunho
                  </>
                ) : (
                  <>
                    <Globe className="size-4" /> Publicar site
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/site/$slug" params={{ slug: site.slug }}>
                  <ExternalLink className="size-4" /> Abrir site
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => removeSite(site.id)}>
                <Trash2 className="size-4" /> Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[11px]">
          <span
            className={
              site.status === "publicado"
                ? "rounded-full bg-accent/10 px-2 py-0.5 font-semibold uppercase tracking-wide text-accent"
                : "rounded-full bg-surface-2 px-2 py-0.5 font-semibold uppercase tracking-wide text-muted-foreground"
            }
          >
            {site.status === "publicado" ? "Publicado" : "Rascunho"}
          </span>
          <span className="text-muted-foreground">
            Atualizado: {formatUpdated(site.updatedAt)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg border border-border bg-surface-2/60 p-2 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <Eye className="size-3 text-accent" /> {metrics.views}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Acessos</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <Users className="size-3 text-accent" /> {metrics.visitors}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Visitantes</div>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-sm font-semibold">
              <Clock className="size-3 text-accent" /> {formatDuration(metrics.avgTimeMs)}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Tempo méd.</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Link
            to="/editor/$siteId"
            params={{ siteId: site.id }}
            className="flex-1 rounded-md bg-foreground py-2 text-center text-xs font-semibold text-primary-foreground"
          >
            Editar
          </Link>
          <Link
            to="/site/$slug"
            params={{ slug: site.slug }}
            className="flex-1 rounded-md border border-border py-2 text-center text-xs font-semibold hover:bg-surface"
          >
            Visualizar
          </Link>
          {site.status !== "publicado" && (
            <button
              onClick={() => publishSite(site.id, true)}
              className="flex-1 rounded-md bg-accent py-2 text-center text-xs font-semibold text-accent-foreground"
            >
              Publicar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
