import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowLeft } from "lucide-react";
import { generateSite, GENERATION_STEPS } from "@/lib/site-generator";
import { aiGenerateSite } from "@/lib/ai.functions";
import { siteFromPlan } from "@/lib/ai-hydrate";
import type { Site } from "@/lib/site-model";
import { useSites } from "@/lib/sites-store";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";


export const Route = createFileRoute("/criar")({
  validateSearch: (search: Record<string, unknown>): { ideia?: string } =>
    typeof search["ideia"] === "string" ? { ideia: search["ideia"] } : {},
  head: () => ({
    meta: [
      { title: "Criar novo site — Sintética" },
      {
        name: "description",
        content: "Descreva o que você quer e a Sintética monta a primeira versão do seu site.",
      },
      { property: "og:title", content: "Criar novo site — Sintética" },
      { property: "og:description", content: "Conte sua ideia e receba um site pronto para ajustar." },
    ],
  }),
  component: Criar,
});

const SUGESTOES: { label: string; categoria: string; prompt: string }[] = [
  {
    label: "Barbearia com agendamento",
    categoria: "Serviços",
    prompt:
      "Tenho a Barbearia Prime, em Fortaleza, focada em cortes clássicos e barba. Quero um site moderno e masculino, com hero impactante, lista de serviços com preços, galeria de trabalhos, depoimentos de clientes, horário de funcionamento, mapa da localização e botão de agendamento pelo WhatsApp.",
  },
  {
    label: "Restaurante com cardápio",
    categoria: "Alimentação",
    prompt:
      "Sou dono do restaurante Casa Nova, comida italiana contemporânea em São Paulo. Quero um site elegante com fotos dos pratos, cardápio dividido por entradas, principais e sobremesas, história do restaurante, depoimentos, horários, endereço e um botão de reserva de mesa.",
  },
  {
    label: "Clínica ou consultório",
    categoria: "Saúde",
    prompt:
      "Sou dentista e tenho a clínica Sorriso Integral. Quero um site profissional e acolhedor, com apresentação da equipe, especialidades (ortodontia, implantes, clareamento), convênios aceitos, perguntas frequentes, depoimentos de pacientes e agendamento de consulta por WhatsApp.",
  },
  {
    label: "Loja online",
    categoria: "Varejo",
    prompt:
      "Tenho a loja Verde Casa, que vende plantas e vasos artesanais. Quero um site limpo com vitrine de produtos em destaque, categorias, seção sobre a marca, política de entrega, avaliações de clientes e botão de compra pelo WhatsApp ou Instagram.",
  },
  {
    label: "Portfólio criativo",
    categoria: "Criativo",
    prompt:
      "Sou fotógrafo de casamentos e quero um portfólio minimalista com galeria em destaque, apresentação do meu trabalho, pacotes e valores, processo de contratação, depoimentos de casais e formulário de contato.",
  },
  {
    label: "Consultoria / serviço B2B",
    categoria: "Negócios",
    prompt:
      "Sou consultor financeiro para pequenas empresas. Quero uma landing page profissional com proposta de valor clara, serviços oferecidos, resultados e números, metodologia em etapas, depoimentos de clientes, planos de consultoria e CTA para agendar uma conversa.",
  },
  {
    label: "Academia / estúdio",
    categoria: "Fitness",
    prompt:
      "Tenho um estúdio de pilates e treino funcional chamado Movimento. Quero um site energético com hero de impacto, modalidades, planos e mensalidades, equipe de professores, estrutura em fotos, depoimentos de alunos e botão para aula experimental gratuita.",
  },
  {
    label: "Evento ou lançamento",
    categoria: "Evento",
    prompt:
      "Vou realizar o Summit Criativo 2026, um evento de um dia para empreendedores. Quero uma landing page com contagem para a data, programação por horário, palestrantes, ingressos com lotes de preço, local do evento, perguntas frequentes e botão de inscrição.",
  },
];


const PLACEHOLDER =
  "Ex: Tenho uma barbearia chamada Barbearia Prime, localizada em Fortaleza. Quero um site moderno e elegante, com meus serviços, preços, horário de funcionamento, localização e um botão para agendamento pelo WhatsApp.";

function Criar() {
  const { ideia } = Route.useSearch();
  const navigate = useNavigate();
  const { addSite } = useSites();
  const [prompt, setPrompt] = useState(ideia ?? "");
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const doneRef = useRef(false);
  const siteRef = useRef<Promise<Site> | null>(null);

  useEffect(() => {
    if (!generating) return;
    if (step >= GENERATION_STEPS.length) {
      if (doneRef.current) return;
      doneRef.current = true;
      void (async () => {
        const site = (await siteRef.current) ?? generateSite(prompt);
        addSite(site);
        navigate({ to: "/editor/$siteId", params: { siteId: site.id } });
      })();
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 850);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generating, step]);


  if (generating) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-ink-foreground">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3">
            <span className="size-2 animate-pulse rounded-full bg-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
              Criando seu site
            </span>
          </div>
          <ul className="space-y-4">
            {GENERATION_STEPS.map((label, i) => (
              <li
                key={label}
                className={
                  i < step
                    ? "flex items-center gap-3 text-sm text-ink-foreground"
                    : i === step
                      ? "flex items-center gap-3 text-sm text-accent"
                      : "flex items-center gap-3 text-sm text-ink-muted/50"
                }
              >
                <span
                  className={
                    i < step
                      ? "flex size-5 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground"
                      : "flex size-5 items-center justify-center rounded-full border border-ink-line text-[10px]"
                  }
                >
                  {i < step ? "✓" : i + 1}
                </span>
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-10 h-1 overflow-hidden rounded-full bg-ink-line">
            <div
              className="h-full bg-accent transition-all duration-700"
              style={{ width: `${(step / GENERATION_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/painel"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Voltar ao painel
          </Link>
          <ThemeToggle />
        </div>


        <h1 className="mt-10 font-display text-4xl font-extrabold tracking-tight">
          O que você quer criar?
        </h1>
        <p className="mt-3 text-muted-foreground">
          Escreva com suas palavras. Quanto mais detalhes sobre o seu negócio, melhor fica a primeira
          versão.
        </p>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            const texto = prompt.trim();
            if (!texto) return;
            doneRef.current = false;
            siteRef.current = aiGenerateSite({ data: { prompt: texto } })
              .then((plan) => siteFromPlan(plan, texto))
              .catch((err) => {
                console.error("Falha na IA, usando geração local:", err);
                toast.error("IA indisponível — gerei localmente. Verifique AI_API_KEY no .env.");
                return generateSite(texto);
              });
            setStep(0);
            setGenerating(true);

          }}
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={PLACEHOLDER}
            rows={7}
            className="w-full resize-none rounded-2xl border border-border bg-surface p-6 text-base leading-relaxed outline-none transition-colors focus:border-accent focus:bg-background"
          />

          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Sugestões de prompts profissionais
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SUGESTOES.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setPrompt(s.prompt)}
                  className="group rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-accent"
                >
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {s.categoria}
                  </span>
                  <span className="mt-1 block text-sm font-semibold group-hover:text-accent">
                    {s.label}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                    {s.prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>


          <button
            type="submit"
            disabled={!prompt.trim()}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-accent-foreground transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="size-4" /> Criar meu site
          </button>
        </form>
      </div>
    </main>
  );
}
