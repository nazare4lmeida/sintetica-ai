import type { Section, Site, ThemeId } from "./site-model";
import { uid } from "./site-model";
import { SITE_THEMES } from "./site-themes";
import { getPack } from "./site-images";

/**
 * Camada de conversa simulada.
 * Recebe o pedido em linguagem natural e devolve uma resposta + uma nova
 * versão da estrutura do site. Trocar por uma API real depois significa
 * apenas substituir esta função, mantendo a mesma assinatura.
 */

export interface AiResult {
  reply: string;
  site: Site;
}

const withId = <T extends Omit<Section, "id">>(section: T) =>
  ({ ...section, id: uid() }) as unknown as Section;

const testimonialsSection = () =>
  withId({
    type: "testimonials" as const,
    title: "O que dizem os clientes",
    items: [
      { name: "Rafael Menezes", text: "Atendimento impecável e resultado sempre acima do esperado.", rating: 5 },
      { name: "Diego Alencar", text: "Ambiente agradável e profissionais que entendem do assunto.", rating: 5 },
      { name: "Bruno Carvalho", text: "Virou meu lugar fixo. Recomendo de olhos fechados.", rating: 5 },
    ],
  });

const gallerySection = () =>
  withId({ type: "gallery" as const, title: "Galeria", count: 6, images: getPack("generico").gallery });

const pricingSection = () =>
  withId({
    type: "pricing" as const,
    title: "Planos",
    plans: [
      { name: "Essencial", price: "R$ 89/mês", features: ["1 atendimento por mês", "Agendamento online"] },
      {
        name: "Completo",
        price: "R$ 149/mês",
        features: ["3 atendimentos por mês", "Prioridade na agenda", "Desconto em produtos"],
        highlight: true,
      },
      { name: "Premium", price: "R$ 229/mês", features: ["Atendimentos ilimitados", "Horário exclusivo"] },
    ],
  });

const ctaSection = (name: string) =>
  withId({
    type: "cta" as const,
    title: "Pronto para começar?",
    subtitle: `Fale agora com a equipe ${name} e garanta seu horário.`,
    buttonLabel: "Chamar no WhatsApp",
  });

function insertBefore(sections: Section[], newSection: Section, beforeType: Section["type"]) {
  const index = sections.findIndex((sec) => sec.type === beforeType);
  const copy = [...sections];
  copy.splice(index === -1 ? copy.length : index, 0, newSection);
  return copy;
}

function setTheme(site: Site, theme: ThemeId): Site {
  return { ...site, theme };
}

export function respondToMessage(site: Site, message: string): AiResult {
  const text = message.toLowerCase();
  let next = site;
  let reply = "";

  const has = (type: Section["type"]) => site.sections.some((sec) => sec.type === type);

  if (/depoiment|avalia|testemunh|coment[áa]rio/.test(text)) {
    if (has("testimonials")) {
      reply = "A seção de depoimentos já está no seu site, logo abaixo dos serviços.";
    } else {
      next = {
        ...site,
        sections: insertBefore(site.sections, testimonialsSection(), "location"),
      };
      reply = "Adicionei uma seção de depoimentos abaixo dos serviços.";
    }
  } else if (/remov|tir[ae]|excluir|apagar/.test(text) && /galeria|fotos|imagens/.test(text)) {
    next = { ...site, sections: site.sections.filter((sec) => sec.type !== "gallery") };
    reply = "Removi a galeria. O site ficou mais direto e rápido de ler.";
  } else if (/galeria|fotos|imagens/.test(text)) {
    next = has("gallery")
      ? site
      : { ...site, sections: insertBefore(site.sections, gallerySection(), "location") };
    reply = has("gallery")
      ? "Sua galeria já está publicada no site."
      : "Incluí uma galeria com espaço para as suas fotos.";
  } else if (/plano|pacote|assinatura|mensalidade/.test(text)) {
    next = has("pricing")
      ? site
      : { ...site, sections: insertBefore(site.sections, pricingSection(), "location") };
    reply = has("pricing")
      ? "Os planos já aparecem no site."
      : "Criei uma seção de planos com três opções de assinatura.";
  } else if (/whatsapp|bot[ãa]o de contato|chamada final|cta/.test(text)) {
    next = has("cta")
      ? site
      : { ...site, sections: insertBefore(site.sections, ctaSection(site.name), "footer") };
    reply = "Coloquei uma chamada final com o botão do WhatsApp antes do rodapé.";
  } else if (/escur|dark|noturno|preto/.test(text)) {
    next = setTheme(site, "elegante");
    reply = "Deixei o site escuro, com contraste alto e um toque mais sóbrio.";
  } else if (/sofisticad|elegan|refinad|premium|luxo/.test(text)) {
    next = setTheme(site, /luxo|dourad/.test(text) ? "luxuoso" : "elegante");
    reply =
      "Pronto! Atualizei a identidade visual para um estilo mais sofisticado, ajustando tipografia, espaçamento e contraste.";
  } else if (/minimal|limpo|simples|clean/.test(text)) {
    next = setTheme(site, "minimalista");
    reply = "Simplifiquei tudo: mais espaço, menos elementos e uma leitura bem tranquila.";
  } else if (/vibrante|colorid|alegre|divertid/.test(text)) {
    next = setTheme(site, "vibrante");
    reply = "Trouxe mais cor e energia para o site, mantendo a legibilidade.";
  } else if (/profissional|corporativ|s[ée]rio|confian/.test(text)) {
    next = setTheme(site, "profissional");
    reply = "Ajustei para um visual mais profissional, com tons de confiança.";
  } else if (/moderno|atual|novo visual/.test(text)) {
    next = setTheme(site, "moderno");
    reply = "Modernizei o visual: tipografia atual, cantos suaves e mais respiro entre as seções.";
  } else if (/cor|paleta|tom/.test(text)) {
    const order = SITE_THEMES.map((t) => t.id);
    const nextTheme = order[(order.indexOf(site.theme) + 1) % order.length]!;
    next = setTheme(site, nextTheme);
    reply = `Troquei as cores do site para o estilo ${
      SITE_THEMES.find((t) => t.id === nextTheme)?.label
    }. Se quiser, posso testar outra combinação.`;
  } else if (/texto principal|t[íi]tulo|chamada/.test(text)) {
    next = {
      ...site,
      sections: site.sections.map((sec) =>
        sec.type === "hero"
          ? {
              ...sec,
              title: "Um atendimento que você sente na primeira visita.",
              subtitle: "Cuidado, técnica e uma experiência pensada nos mínimos detalhes.",
            }
          : sec,
      ),
    };
    reply = "Reescrevi o texto principal para algo mais convidativo e direto.";
  } else if (/pre[çc]o|valor/.test(text)) {
    reply =
      "Você pode ajustar os preços direto na seção Serviços: clique nela no preview e edite pelo painel da direita.";
  } else {
    reply =
      "Entendi! Apliquei pequenos ajustes de espaçamento e hierarquia. Se quiser algo mais específico, tente: “adicione depoimentos”, “deixe mais elegante” ou “remova a galeria”.";
  }

  return {
    reply,
    site: { ...next, updatedAt: new Date().toISOString() },
  };
}

export const CHAT_SUGGESTIONS = [
  "Deixe mais moderno",
  "Troque as cores",
  "Adicione uma seção de depoimentos",
  "Melhore o texto principal",
  "Adicione botão do WhatsApp",
];
