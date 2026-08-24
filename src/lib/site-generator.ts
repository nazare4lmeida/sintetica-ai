import type { Section, Site, ThemeId } from "./site-model";
import { slugify, uid } from "./site-model";
import { getPack } from "./site-images";

/**
 * Geração simulada: interpreta o texto do usuário e monta uma estrutura
 * de seções. No futuro isso será substituído por uma chamada real de IA
 * que devolve exatamente este mesmo formato.
 */

interface Blueprint {
  category: string;
  name: string;
  theme: ThemeId;
  sections: Section[];
}

type DraftSection = Section extends infer S ? (S extends Section ? Omit<S, "id"> : never) : never;

const s = (section: DraftSection): Section => ({ ...section, id: uid() }) as Section;

function detectName(prompt: string, fallback: string) {
  const match = prompt.match(
    /chamad[oa]\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]*(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]*)*)/,
  );
  if (match?.[1]) return match[1].trim();
  const named = prompt.match(/(?:nome|se chama)\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]*)/);
  if (named?.[1]) return named[1].trim();
  return fallback;
}

function detectCity(prompt: string) {
  const match = prompt.match(/em\s+([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]+(?:\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ]+)?)/);
  return match?.[1] ? match[1].trim() : "Fortaleza";
}

const handle = (name: string) => "@" + slugify(name).replace(/-/g, "");

function testimonials(pack: ReturnType<typeof getPack>, items: [string, string][]) {
  return s({
    type: "testimonials",
    title: "O que dizem por aí",
    items: items.map(([name, text], i) => ({
      name,
      text,
      rating: 5,
      avatar: pack.avatars[i % pack.avatars.length] as string,
    })),
  });
}

interface Recipe {
  category: string;
  packKey: string;
  theme: ThemeId;
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta: string;
  menu: string[];
  headerCta: string;
  servicesTitle: string;
  services: { name: string; price: string; note?: string }[];
  aboutTitle: string;
  aboutText: (name: string) => string;
  stats: { label: string; value: string }[];
  galleryTitle: string;
  depoimentos: [string, string][];
  planos?: { name: string; price: string; features: string[]; highlight?: boolean }[];
  address: string;
  whatsapp: string;
  hours: string[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

function build(recipe: Recipe, name: string, city: string): Blueprint {
  const pack = getPack(recipe.packKey);
  const sections: Section[] = [
    s({
      type: "header",
      logo: name,
      menu: recipe.menu,
      buttonLabel: recipe.headerCta,
    }),
    s({
      type: "hero",
      title: recipe.heroTitle,
      subtitle: recipe.heroSubtitle,
      buttonLabel: recipe.heroCta,
      align: "center",
      image: pack.hero,
      badge: recipe.badge,
    }),
    s({
      type: "services",
      title: recipe.servicesTitle,
      items: recipe.services.map((item, i) => ({ ...item, image: pack.services[i % pack.services.length] as string })),
    }),
    s({
      type: "about",
      title: recipe.aboutTitle,
      text: recipe.aboutText(name),
      image: pack.about,
      stats: recipe.stats,
    }),
    s({ type: "gallery", title: recipe.galleryTitle, count: 6, images: pack.gallery }),
    testimonials(pack, recipe.depoimentos),
  ];

  if (recipe.planos) {
    sections.push(s({ type: "pricing", title: "Planos", plans: recipe.planos }));
  }

  sections.push(
    s({ type: "location", title: "Onde estamos", address: recipe.address, city, image: pack.location }),
    s({
      type: "contact",
      title: "Contato",
      whatsapp: recipe.whatsapp,
      instagram: handle(name),
      hours: recipe.hours,
    }),
    s({
      type: "cta",
      title: recipe.ctaTitle,
      subtitle: recipe.ctaSubtitle,
      buttonLabel: recipe.ctaButton,
      image: pack.gallery[0] as string,
    }),
    s({ type: "footer", text: `${name} © 2026 — Todos os direitos reservados` }),
  );

  return { category: recipe.category, name, theme: recipe.theme, sections };
}

const RECIPES: Record<string, Recipe> = {
  barbearia: {
    category: "Barbearia",
    packKey: "barbearia",
    theme: "elegante",
    badge: "Desde 2015",
    heroTitle: "Seu estilo começa aqui.",
    heroSubtitle: "Experiência, precisão e personalidade em cada corte.",
    heroCta: "Agendar pelo WhatsApp",
    menu: ["Início", "Serviços", "Sobre", "Galeria", "Contato"],
    headerCta: "Agendar horário",
    servicesTitle: "Serviços",
    services: [
      { name: "Corte Masculino", price: "R$ 40", note: "45 min" },
      { name: "Barba Terapia", price: "R$ 30", note: "30 min" },
      { name: "Corte + Barba", price: "R$ 60", note: "1h 15min" },
    ],
    aboutTitle: "Sobre a casa",
    aboutText: (name) =>
      `A ${name} nasceu da vontade de transformar o cuidado masculino em uma experiência completa. Ambiente acolhedor, profissionais experientes e atenção ao detalhe em cada atendimento.`,
    stats: [
      { label: "Clientes atendidos", value: "8k+" },
      { label: "Anos de casa", value: "11" },
      { label: "Nota média", value: "4,9" },
    ],
    galleryTitle: "Galeria",
    depoimentos: [
      ["Rafael M.", "Melhor corte que já fiz na cidade. Atendimento impecável."],
      ["Diego S.", "Ambiente top, café bom e barbeiro que entende do assunto."],
      ["Lucas P.", "Marquei pelo WhatsApp em 30 segundos. Voltarei sempre."],
    ],
    planos: [
      { name: "Avulso", price: "R$ 40", features: ["1 corte", "Sem fidelidade"] },
      { name: "Clube mensal", price: "R$ 129", features: ["4 cortes", "1 barba grátis", "Prioridade na agenda"], highlight: true },
      { name: "Premium", price: "R$ 199", features: ["Cortes ilimitados", "Barba + hidratação", "Horário exclusivo"] },
    ],
    address: "Av. Santos Dumont, 1420 — Aldeota",
    whatsapp: "(85) 99999-0000",
    hours: ["Seg a Sex — 09h às 20h", "Sábado — 08h às 18h", "Domingo — fechado"],
    ctaTitle: "Pronto para renovar o visual?",
    ctaSubtitle: "Agende em poucos toques e chegue na hora certa.",
    ctaButton: "Agendar agora",
  },
  restaurante: {
    category: "Restaurante",
    packKey: "restaurante",
    theme: "vibrante",
    badge: "Cozinha da casa",
    heroTitle: "Sabor que faz voltar.",
    heroSubtitle: "Cozinha honesta, ingredientes frescos e um ambiente para ficar.",
    heroCta: "Reservar mesa",
    menu: ["Início", "Cardápio", "Sobre", "Reservas", "Contato"],
    headerCta: "Reservar mesa",
    servicesTitle: "Cardápio em destaque",
    services: [
      { name: "Prato do dia", price: "R$ 38", note: "com bebida" },
      { name: "Massa artesanal", price: "R$ 52", note: "serve 1 pessoa" },
      { name: "Sobremesa da casa", price: "R$ 22", note: "feita na hora" },
    ],
    aboutTitle: "Nossa história",
    aboutText: (name) =>
      `O ${name} serve receitas de família desde o primeiro dia. Tudo é feito na hora, com fornecedores locais e muito capricho — do pão ao molho.`,
    stats: [
      { label: "Pratos servidos", value: "120k" },
      { label: "Anos abertos", value: "9" },
      { label: "Avaliação", value: "4,8" },
    ],
    galleryTitle: "Nosso ambiente",
    depoimentos: [
      ["Marina L.", "A massa é absurda. Melhor da região, sem exagero."],
      ["Caio R.", "Atendimento atencioso e o ambiente é lindo."],
      ["Bruna F.", "Reservei pelo site em segundos. Experiência completa."],
    ],
    address: "Rua das Flores, 210 — Centro",
    whatsapp: "(85) 98888-1122",
    hours: ["Ter a Dom — 11h30 às 23h", "Segunda — fechado"],
    ctaTitle: "Reserve sua mesa hoje",
    ctaSubtitle: "As melhores mesas acabam rápido nos fins de semana.",
    ctaButton: "Reservar pelo WhatsApp",
  },
  beleza: {
    category: "Salão de beleza",
    packKey: "beleza",
    theme: "moderno",
    badge: "Beleza & bem-estar",
    heroTitle: "Cuidar de você é o nosso trabalho.",
    heroSubtitle: "Procedimentos com técnica, produtos premium e resultado que dura.",
    heroCta: "Agendar horário",
    menu: ["Início", "Procedimentos", "Sobre", "Galeria", "Contato"],
    headerCta: "Agendar",
    servicesTitle: "Procedimentos",
    services: [
      { name: "Corte + escova", price: "R$ 90", note: "1h" },
      { name: "Coloração", price: "R$ 220", note: "2h 30min" },
      { name: "Dia de noiva", price: "R$ 650", note: "pacote completo" },
    ],
    aboutTitle: "Sobre o studio",
    aboutText: (name) =>
      `No ${name} cada atendimento começa por uma conversa. Entendemos seu tipo de cabelo, sua rotina e o resultado que você quer — só então colocamos a mão na massa.`,
    stats: [
      { label: "Clientes", value: "5k+" },
      { label: "Profissionais", value: "8" },
      { label: "Nota média", value: "5,0" },
    ],
    galleryTitle: "Transformações",
    depoimentos: [
      ["Ana C.", "Saí de lá me sentindo outra pessoa. Recomendo demais."],
      ["Juliana T.", "Coloração perfeita e nada de cabelo danificado."],
      ["Paula V.", "Atendimento humano e resultado impecável."],
    ],
    address: "Rua Monsenhor Tabosa, 780 — Meireles",
    whatsapp: "(85) 97777-5566",
    hours: ["Ter a Sáb — 09h às 19h", "Dom e Seg — fechado"],
    ctaTitle: "Sua próxima transformação começa agora",
    ctaSubtitle: "Escolha o melhor horário e deixe o resto com a gente.",
    ctaButton: "Agendar pelo WhatsApp",
  },
  clinica: {
    category: "Clínica",
    packKey: "clinica",
    theme: "profissional",
    badge: "Atendimento humanizado",
    heroTitle: "Cuidado que começa pela escuta.",
    heroSubtitle: "Equipe multidisciplinar, estrutura moderna e acompanhamento próximo.",
    heroCta: "Marcar consulta",
    menu: ["Início", "Especialidades", "Equipe", "Convênios", "Contato"],
    headerCta: "Marcar consulta",
    servicesTitle: "Especialidades",
    services: [
      { name: "Clínica geral", price: "R$ 180", note: "consulta 40 min" },
      { name: "Nutrição", price: "R$ 200", note: "com avaliação" },
      { name: "Psicologia", price: "R$ 160", note: "sessão 50 min" },
    ],
    aboutTitle: "Sobre a clínica",
    aboutText: (name) =>
      `A ${name} reúne profissionais que acreditam em medicina próxima e preventiva. Consultas sem pressa, retorno incluso e um plano de cuidado feito para a sua realidade.`,
    stats: [
      { label: "Pacientes/ano", value: "12k" },
      { label: "Especialistas", value: "18" },
      { label: "Satisfação", value: "97%" },
    ],
    galleryTitle: "Nossa estrutura",
    depoimentos: [
      ["Roberto A.", "Me senti realmente ouvido. Diferente de tudo que já vivi."],
      ["Cláudia M.", "Estrutura limpa, moderna e equipe muito atenciosa."],
      ["Felipe D.", "Agendamento fácil e horários que realmente são cumpridos."],
    ],
    address: "Av. Dom Luís, 500 — Sala 1203",
    whatsapp: "(85) 96666-3311",
    hours: ["Seg a Sex — 07h às 19h", "Sábado — 08h às 12h"],
    ctaTitle: "Agende sua avaliação",
    ctaSubtitle: "Primeira consulta com retorno incluso em até 30 dias.",
    ctaButton: "Falar com a recepção",
  },
  loja: {
    category: "Loja",
    packKey: "loja",
    theme: "moderno",
    badge: "Novidades toda semana",
    heroTitle: "Peças escolhidas a dedo.",
    heroSubtitle: "Curadoria própria, entrega rápida e troca sem burocracia.",
    heroCta: "Ver novidades",
    menu: ["Início", "Produtos", "Sobre", "Entrega", "Contato"],
    headerCta: "Comprar agora",
    servicesTitle: "Destaques da vitrine",
    services: [
      { name: "Coleção verão", price: "A partir de R$ 89", note: "novidade" },
      { name: "Básicos essenciais", price: "R$ 59", note: "mais vendidos" },
      { name: "Acessórios", price: "R$ 39", note: "edição limitada" },
    ],
    aboutTitle: "Sobre a loja",
    aboutText: (name) =>
      `A ${name} começou pequena, vendendo pelo Instagram. Hoje atende o Brasil inteiro mantendo o mesmo cuidado: cada peça é testada antes de entrar na vitrine.`,
    stats: [
      { label: "Pedidos", value: "40k" },
      { label: "Estados atendidos", value: "27" },
      { label: "Avaliação", value: "4,9" },
    ],
    galleryTitle: "Vitrine",
    depoimentos: [
      ["Larissa O.", "Chegou antes do prazo e a qualidade surpreendeu."],
      ["Thiago B.", "Atendimento pelo WhatsApp resolveu tudo em minutos."],
      ["Sofia N.", "Já é a minha terceira compra. Nunca decepciona."],
    ],
    address: "Shopping Centro, Loja 22",
    whatsapp: "(85) 95555-2200",
    hours: ["Seg a Sáb — 10h às 22h", "Domingo — 13h às 21h"],
    ctaTitle: "Frete grátis acima de R$ 199",
    ctaSubtitle: "Aproveite a coleção nova enquanto tem numeração.",
    ctaButton: "Comprar pelo WhatsApp",
  },
  portfolio: {
    category: "Portfólio",
    packKey: "portfolio",
    theme: "minimalista",
    badge: "Portfólio",
    heroTitle: "Imagens que contam histórias.",
    heroSubtitle: "Ensaios, eventos e projetos autorais com direção de arte própria.",
    heroCta: "Ver trabalhos",
    menu: ["Início", "Trabalhos", "Sobre", "Pacotes", "Contato"],
    headerCta: "Solicitar orçamento",
    servicesTitle: "Pacotes",
    services: [
      { name: "Ensaio individual", price: "R$ 690", note: "1h · 25 fotos" },
      { name: "Casamento", price: "R$ 4.200", note: "dia completo" },
      { name: "Corporativo", price: "R$ 1.500", note: "meio período" },
    ],
    aboutTitle: "Sobre o trabalho",
    aboutText: (name) =>
      `${name} trabalha com luz natural e direção leve — nada de poses forçadas. O resultado são imagens que parecem com quem você é de verdade.`,
    stats: [
      { label: "Projetos", value: "300+" },
      { label: "Anos", value: "10" },
      { label: "Prêmios", value: "6" },
    ],
    galleryTitle: "Trabalhos recentes",
    depoimentos: [
      ["Camila e Pedro", "As fotos do casamento superaram tudo que imaginamos."],
      ["Studio Norte", "Profissionalismo do briefing à entrega."],
      ["Renata G.", "Me senti à vontade do começo ao fim do ensaio."],
    ],
    address: "Rua Ateliê, 45 — Praia de Iracema",
    whatsapp: "(85) 94444-7788",
    hours: ["Atendimento com hora marcada"],
    ctaTitle: "Vamos criar algo juntos?",
    ctaSubtitle: "Conte sua ideia e monto um orçamento em 24h.",
    ctaButton: "Pedir orçamento",
  },
  generico: {
    category: "Serviço profissional",
    packKey: "generico",
    theme: "moderno",
    badge: "Atendimento local",
    heroTitle: "Seu negócio com a presença que ele merece.",
    heroSubtitle: "Atendimento com atenção, agilidade e resultado — agora também online.",
    heroCta: "Falar pelo WhatsApp",
    menu: ["Início", "Serviços", "Sobre", "Contato"],
    headerCta: "Falar conosco",
    servicesTitle: "O que oferecemos",
    services: [
      { name: "Atendimento personalizado", price: "Sob consulta" },
      { name: "Pacote mensal", price: "R$ 290", note: "melhor custo" },
      { name: "Consultoria avulsa", price: "R$ 150", note: "1h" },
    ],
    aboutTitle: "Sobre",
    aboutText: (name) =>
      `${name} é feito por pessoas que gostam do que fazem. Nosso compromisso é entregar sempre um pouco além do combinado — com prazo claro e comunicação direta.`,
    stats: [
      { label: "Clientes", value: "500+" },
      { label: "Anos", value: "7" },
      { label: "Indicações", value: "82%" },
    ],
    galleryTitle: "Um pouco do nosso dia a dia",
    depoimentos: [
      ["Marcos T.", "Resolveram rápido e explicaram tudo com clareza."],
      ["Elaine S.", "Preço justo e entrega no prazo combinado."],
      ["Rui A.", "Virou meu fornecedor fixo. Confiança total."],
    ],
    address: "Rua Principal, 100",
    whatsapp: "(85) 97777-3344",
    hours: ["Seg a Sex — 09h às 18h"],
    ctaTitle: "Vamos conversar?",
    ctaSubtitle: "Resposta em até 1 hora útil pelo WhatsApp.",
    ctaButton: "Chamar no WhatsApp",
  },
};

function pick(prompt: string): { key: string; fallbackName: string } {
  const lower = prompt.toLowerCase();
  if (/barbearia|barbeiro|corte masculino/.test(lower)) return { key: "barbearia", fallbackName: "Barbearia Prime" };
  if (/restaurante|pizzaria|hamburgueria|caf[eé]|bistr[oô]|lanchonete/.test(lower))
    return { key: "restaurante", fallbackName: "Casa Nova" };
  if (/sal[ãa]o|beleza|est[ée]tica|manicure|cabelo/.test(lower))
    return { key: "beleza", fallbackName: "Studio Beleza" };
  if (/cl[íi]nica|consult[óo]rio|dentista|psic[óo]log|m[ée]dic/.test(lower))
    return { key: "clinica", fallbackName: "Clínica Vida" };
  if (/loja|e-?commerce|boutique|vender|produtos/.test(lower)) return { key: "loja", fallbackName: "Minha Loja" };
  if (/fot[óo]graf|portf[óo]lio|design|arquitet|criativ/.test(lower))
    return { key: "portfolio", fallbackName: "Estúdio Criativo" };
  return { key: "generico", fallbackName: "Meu Negócio" };
}

export function generateSite(prompt: string): Site {
  const { key, fallbackName } = pick(prompt);
  const recipe = RECIPES[key] as Recipe;
  const name = detectName(prompt, fallbackName);
  const city = detectCity(prompt);
  const blueprint = build(recipe, name, city);

  return {
    id: uid(),
    name: blueprint.name,
    category: blueprint.category,
    slug: slugify(blueprint.name),
    status: "rascunho",
    theme: blueprint.theme,
    prompt,
    updatedAt: new Date().toISOString(),
    sections: blueprint.sections,
    messages: [
      {
        id: uid(),
        role: "assistant",
        text: "Seu site está pronto! O que você gostaria de melhorar?",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

export const GENERATION_STEPS = [
  "Entendendo seu negócio...",
  "Definindo a estrutura...",
  "Escolhendo o estilo visual...",
  "Selecionando as imagens...",
  "Montando as seções...",
  "Finalizando seu site...",
];
