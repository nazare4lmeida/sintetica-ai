import { createFileRoute, Link } from "@tanstack/react-router";
import { getPack } from "@/lib/site-images";
import { ThemeToggle } from "@/components/ThemeToggle";

const DEMO = getPack("barbearia");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sintética — Crie seu site conversando com a IA" },
      {
        name: "description",
        content:
          "Descreva seu negócio e a Sintética cria a primeira versão do seu site. Depois, aperfeiçoe tudo conversando com a assistente.",
      },
      { property: "og:title", content: "Sintética — Crie seu site conversando com a IA" },
      {
        property: "og:description",
        content: "Sites profissionais para pequenos negócios, criados a partir de uma conversa.",
      },
    ],
  }),
  component: Landing,
});

const EXAMPLES = [
  { label: "Barbearia", hint: "Serviços, preços e agendamento", image: getPack("barbearia").hero },
  { label: "Restaurante", hint: "Cardápio, reservas e localização", image: getPack("restaurante").hero },
  { label: "Salão de beleza", hint: "Procedimentos e horários", image: getPack("beleza").hero },
  { label: "Clínica", hint: "Especialidades e convênios", image: getPack("clinica").hero },
  { label: "Loja", hint: "Vitrine e contato direto", image: getPack("loja").hero },
  { label: "Fotógrafo", hint: "Portfólio e pacotes", image: getPack("portfolio").hero },
  { label: "Profissional autônomo", hint: "Serviços e depoimentos", image: getPack("generico").hero },
];


function Landing() {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground">
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground">
              <span className="size-3 rounded-full bg-accent" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">SINTÉTICA</span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#como-funciona" className="transition-colors hover:text-foreground">
              Como funciona
            </a>
            <a href="#exemplos" className="transition-colors hover:text-foreground">
              Exemplos
            </a>
            <a href="#diferencial" className="transition-colors hover:text-foreground">
              Diferencial
            </a>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/entrar"
              className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-surface"
            >
              Entrar
            </Link>
            <Link
              to="/criar"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-ink-soft"
            >
              Começar agora
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative px-6 pb-20 pt-24">
        <div className="enter mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-balance font-display text-5xl font-extrabold leading-[1.1] tracking-tight md:text-7xl">
            Crie seu site. Basta dizer o que você precisa.
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-xl text-muted-foreground">
            Descreva seu negócio e nossa IA cria uma primeira versão do seu site. Depois, aperfeiçoe
            tudo conversando com ela.
          </p>
          <div className="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/criar"
              className="w-full rounded-full bg-accent px-8 py-4 font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Começar agora
            </Link>
            <a
              href="#como-funciona"
              className="w-full rounded-full bg-surface-2 px-8 py-4 text-center font-semibold transition-colors hover:bg-border sm:w-auto"
            >
              Ver como funciona
            </a>
          </div>

          <div className="enter relative mx-auto max-w-6xl rounded-2xl border border-border bg-surface p-4 shadow-2xl [animation-delay:200ms]">
            <div className="mb-4 flex items-center gap-2 px-2">
              <span className="size-3 rounded-full bg-border" />
              <span className="size-3 rounded-full bg-border" />
              <span className="size-3 rounded-full bg-border" />
            </div>
            <div className="grid min-h-[500px] overflow-hidden rounded-lg border border-border bg-background lg:grid-cols-[320px_1fr]">
              <div className="flex flex-col border-b border-border bg-surface/60 p-6 text-left lg:border-b-0 lg:border-r">
                <div className="mb-6">
                  <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Pedido do usuário
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3 text-sm leading-relaxed shadow-sm">
                    “Tenho uma barbearia chamada Barbearia Prime. Quero um site moderno, elegante e
                    masculino, com meus serviços, preços, localização e botão para agendamento pelo
                    WhatsApp.”
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Status
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-accent">
                    <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                    Montando as seções do seu site...
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-background shadow-sm">
                  <div className="flex h-12 items-center justify-between border-b border-border px-4">
                    <span className="font-display text-xs font-bold">BARBEARIA PRIME</span>
                    <span className="flex gap-2">
                      <span className="h-1 w-8 rounded bg-surface-2" />
                      <span className="h-1 w-8 rounded bg-surface-2" />
                    </span>
                  </div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={DEMO.hero}
                      alt="Interior de uma barbearia moderna"
                      className="size-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-espresso/60 px-6 text-center text-espresso-foreground">
                      <span className="font-display text-lg font-extrabold">Seu estilo começa aqui</span>
                      <span className="mt-1 text-[11px] opacity-80">Corte, barba e cuidado premium</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-1">
                    {DEMO.gallery.slice(0, 3).map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt="Trabalho realizado na barbearia"
                        className="aspect-square w-full rounded object-cover"
                        loading="eager"
                      />
                    ))}
                  </div>
                  <div className="p-4">
                    <div className="h-8 w-full rounded bg-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink px-6 py-24 text-ink-foreground">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="mb-2 block font-mono text-sm uppercase tracking-tight text-accent">
                Interface do editor
              </span>
              <h2 className="font-display text-4xl font-bold tracking-tight">Refine cada detalhe</h2>
            </div>
            <div className="flex rounded-lg border border-ink-line bg-ink-soft p-1 text-xs font-medium">
              <span className="rounded bg-ink-line px-3 py-1.5">Desktop</span>
              <span className="px-3 py-1.5 text-ink-muted">Tablet</span>
              <span className="px-3 py-1.5 text-ink-muted">Mobile</span>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-line bg-ink-line shadow-2xl shadow-black/50 lg:grid-cols-[300px_1fr_300px]">
            <div className="flex h-[600px] flex-col bg-ink-soft p-6">
              <div className="mb-8 flex items-center gap-2">
                <span className="size-2 rounded-full bg-accent" />
                <span className="text-sm font-semibold">Assistente de criação</span>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto">
                <p className="rounded-lg border border-ink-line bg-ink/50 p-3 text-sm text-ink-foreground/80">
                  Seu site está pronto! O que você gostaria de melhorar?
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Deixe mais moderno", "Troque as cores", "Adicione depoimentos"].map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-ink-line px-2 py-1 text-[10px] text-ink-muted"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 border-t border-ink-line pt-4">
                <div className="rounded-lg border border-ink-line bg-ink px-4 py-3 text-sm text-ink-muted">
                  Descreva uma alteração...
                </div>
              </div>
            </div>

            <div className="flex flex-col overflow-hidden bg-surface-2">
              <div className="min-h-full bg-background text-foreground">
                <header className="flex items-center justify-between border-b border-border px-8 py-6">
                  <span className="font-display text-xl font-extrabold tracking-tight">PRIME</span>
                  <nav className="hidden gap-6 text-[11px] font-bold uppercase tracking-widest md:flex">
                    <span>Serviços</span>
                    <span>Sobre</span>
                    <span>Agendar</span>
                  </nav>
                </header>
                <section className="relative overflow-hidden border-b border-border px-12 py-20 text-center ring-2 ring-accent/30 ring-offset-4 ring-offset-background">
                  <img
                    src={DEMO.hero}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 size-full object-cover opacity-15"
                    loading="eager"
                  />
                  <h3 className="relative mb-4 font-display text-4xl font-extrabold tracking-tight">
                    Seu estilo começa aqui.
                  </h3>
                  <p className="mb-8 text-muted-foreground">
                    Experiência, precisão e personalidade em cada corte.
                  </p>
                  <span className="inline-block rounded-full bg-foreground px-8 py-3 text-sm font-bold text-primary-foreground">
                    Agendar pelo WhatsApp
                  </span>
                </section>
                <section className="grid grid-cols-2 gap-8 p-12">
                  <div>
                    <div className="mb-1 text-xs font-bold text-accent">CORTE</div>
                    <div className="text-lg font-bold">Corte Masculino</div>
                    <div className="text-muted-foreground">R$ 40,00</div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-bold text-accent">BARBA</div>
                    <div className="text-lg font-bold">Barba</div>
                    <div className="text-muted-foreground">R$ 30,00</div>
                  </div>
                </section>
              </div>
            </div>

            <div className="bg-ink-soft p-6">
              <div className="mb-6 text-xs font-bold uppercase tracking-widest text-ink-muted">
                Propriedades
              </div>
              <div className="space-y-6">
                <div>
                  <span className="mb-2 block text-[10px] text-ink-muted">SEÇÃO</span>
                  <span className="text-sm font-medium">Destaque</span>
                </div>
                <div>
                  <span className="mb-2 block text-[10px] text-ink-muted">TÍTULO</span>
                  <span className="block rounded border border-ink-line bg-ink px-3 py-2 text-xs">
                    Seu estilo começa aqui.
                  </span>
                </div>
                <div>
                  <span className="mb-2 block text-[10px] text-ink-muted">ESTILO VISUAL</span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <span className="rounded bg-accent py-2 text-center text-accent-foreground">
                      Elegante
                    </span>
                    <span className="rounded bg-ink-line py-2 text-center">Minimalista</span>
                  </div>
                </div>
              </div>
              <div className="mt-20">
                <span className="block w-full rounded-lg bg-background py-3 text-center text-sm font-bold text-foreground shadow-xl">
                  Publicar site
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Conte sua ideia",
                d: "Explique o que você deseja criar usando suas próprias palavras.",
              },
              {
                n: "2",
                t: "A IA cria",
                d: "Receba uma primeira versão do seu site em poucos instantes.",
              },
              {
                n: "3",
                t: "Aperfeiçoe conversando",
                d: "Peça alterações como “deixe mais moderno”, “adicione uma galeria” ou “mude as cores”.",
              },
            ].map((step) => (
              <div key={step.n}>
                <div className="mb-6 flex size-12 items-center justify-center rounded-xl border border-border bg-surface font-display text-xl font-bold">
                  {step.n}
                </div>
                <h3 className="mb-3 text-lg font-bold">{step.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="exemplos" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 font-display text-3xl font-bold">Feito para o seu tipo de negócio</h2>
          <p className="mb-12 text-muted-foreground">
            Alguns exemplos de sites que a Sintética já sabe criar.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EXAMPLES.map((ex) => (
              <Link
                key={ex.label}
                to="/criar"
                search={{ ideia: `Quero um site para minha ${ex.label.toLowerCase()}` }}
                className="group rounded-xl border border-border p-5 transition-colors hover:border-accent"
              >
                <div className="mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-surface">
                  <img
                    src={ex.image}
                    alt={`Exemplo de site para ${ex.label.toLowerCase()}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="font-semibold">{ex.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{ex.hint}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="diferencial" className="border-t border-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-display text-3xl font-bold">Você explica. A Sintética constrói.</h2>
          <p className="mb-10 text-muted-foreground">
            Você não precisa saber programar, mexer em código ou entender de design. Basta contar o
            que o seu negócio faz — o resto é com a gente.
          </p>
          <Link
            to="/criar"
            className="inline-block rounded-full bg-foreground px-10 py-4 text-lg font-bold text-primary-foreground transition-all hover:shadow-2xl"
          >
            Criar meu site
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded bg-foreground">
              <span className="size-2 rounded-full bg-accent" />
            </span>
            <span className="font-display text-sm font-bold tracking-tight">SINTÉTICA</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Sintética. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}
