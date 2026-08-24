import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SITE_THEMES } from "@/lib/site-themes";
import { generateSite } from "@/lib/site-generator";
import { SiteRenderer } from "@/components/site/SiteRenderer";


export const Route = createFileRoute("/painel/modelos")({
  head: () => ({
    meta: [
      { title: "Modelos — Sintética" },
      { name: "description", content: "Comece de um modelo pronto para o seu tipo de negócio." },
      { property: "og:title", content: "Modelos — Sintética" },
      { property: "og:description", content: "Modelos prontos para barbearia, restaurante, clínica e mais." },
    ],
  }),
  component: Modelos,
});

const MODELOS = [
  { nome: "Barbearia", ideia: "Tenho uma barbearia e quero um site moderno e elegante com serviços, preços e agendamento pelo WhatsApp." },
  { nome: "Restaurante", ideia: "Tenho um restaurante e quero um site com cardápio, reservas e localização." },
  { nome: "Salão de beleza", ideia: "Tenho um salão de beleza e quero um site com procedimentos, preços e horários." },
  { nome: "Clínica", ideia: "Tenho uma clínica e quero um site profissional com especialidades e contato." },
  { nome: "Loja", ideia: "Tenho uma loja e quero um site com vitrine de produtos e contato direto." },
  { nome: "Fotógrafo", ideia: "Sou fotógrafo e quero um portfólio minimalista com galeria e pacotes." },
];

function Modelos() {
  const previews = useMemo(() => MODELOS.map((m) => ({ ...m, site: generateSite(m.ideia) })), []);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Modelos</h1>
      <p className="mt-2 text-muted-foreground">
        Escolha um ponto de partida — depois é só conversar para ajustar tudo.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {previews.map((m) => (
          <Link
            key={m.nome}
            to="/criar"
            search={{ ideia: m.ideia }}
            className="group overflow-hidden rounded-xl border border-border bg-background transition-colors hover:border-accent"
          >
            <div className="relative h-52 overflow-hidden border-b border-border bg-surface-2">
              <div className="pointer-events-none absolute left-0 top-0 w-[1200px] origin-top-left scale-[0.31]">
                <SiteRenderer site={m.site} />
              </div>
            </div>
            <div className="p-5">
              <div className="font-semibold">{m.nome}</div>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.ideia}</p>
            </div>
          </Link>
        ))}
      </div>


      <h2 className="mt-14 font-display text-xl font-bold">Estilos visuais</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SITE_THEMES.map((t) => (
          <div key={t.id} className="rounded-xl border border-border bg-background p-5">
            <div className="flex gap-1.5">
              {t.swatch.map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="size-6 rounded-full border border-border"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="mt-4 font-semibold">{t.label}</div>
            <p className="text-xs text-muted-foreground">{t.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
