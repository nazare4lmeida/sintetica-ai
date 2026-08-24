import { z } from "zod";

/**
 * Contrato entre a IA e a aplicação.
 * A IA nunca devolve HTML: ela devolve esta estrutura, que o React interpreta.
 * As imagens não vêm da IA — ela escolhe apenas o "pacote visual" (nicho),
 * e a aplicação injeta as fotos correspondentes.
 */

export const THEMES = [
  "moderno",
  "minimalista",
  "elegante",
  "vibrante",
  "profissional",
  "luxuoso",
] as const;

export const PACKS = [
  "barbearia",
  "restaurante",
  "beleza",
  "clinica",
  "loja",
  "portfolio",
  "generico",
] as const;

export const SECTION_TYPES = [
  "header",
  "hero",
  "services",
  "about",
  "gallery",
  "testimonials",
  "pricing",
  "location",
  "contact",
  "cta",
  "footer",
] as const;

/**
 * Schema plano (sem unions) — modelos com saída estruturada lidam melhor
 * com um objeto único de campos opcionais do que com anyOf/discriminated union.
 * A validação semântica por tipo acontece na hidratação.
 */
export const aiSectionSchema = z.object({
  type: z.enum(SECTION_TYPES),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  text: z.string().optional(),
  logo: z.string().optional(),
  menu: z.array(z.string()).optional(),
  buttonLabel: z.string().optional(),
  align: z.enum(["left", "center"]).optional(),
  badge: z.string().optional(),
  count: z.number().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  hours: z.array(z.string()).optional(),
  stats: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  items: z
    .array(
      z.object({
        name: z.string().optional(),
        price: z.string().optional(),
        note: z.string().optional(),
        text: z.string().optional(),
        rating: z.number().optional(),
      }),
    )
    .optional(),
  plans: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        features: z.array(z.string()),
        highlight: z.boolean().optional(),
      }),
    )
    .optional(),
});

export const sitePlanSchema = z.object({
  name: z.string(),
  category: z.string(),
  theme: z.enum(THEMES),
  pack: z.enum(PACKS),
  sections: z.array(aiSectionSchema).min(4).max(12),
});

export const editPlanSchema = z.object({
  reply: z.string(),
  theme: z.enum(THEMES).optional(),
  sections: z.array(aiSectionSchema).min(3).max(14),
});

export type AiSection = z.infer<typeof aiSectionSchema>;
export type SitePlan = z.infer<typeof sitePlanSchema>;
export type EditPlan = z.infer<typeof editPlanSchema>;


export const STRUCTURE_RULES = `
Tipos de seção disponíveis: header, hero, services, about, gallery, testimonials, pricing, location, contact, cta, footer.
Cada seção é um objeto com "type" e apenas os campos daquele tipo:
- header: logo, menu (3 a 5 itens), buttonLabel
- hero: title, subtitle, buttonLabel, align ("left" ou "center"), badge
- services: title, items[] com name, price, note
- about: title, text, stats[] com label e value (até 4)
- gallery: title, count (entre 3 e 9)
- testimonials: title, items[] com name, text, rating (4 ou 5)
- pricing: title, plans[] com name, price, features[], highlight
- location: title, address, city
- contact: title, whatsapp, instagram, hours[] (até 4)
- cta: title, subtitle, buttonLabel
- footer: text
Regras:
- Sempre comece com header e termine com footer.
- Um site completo costuma ter: header, hero, services, about, gallery, testimonials, location, contact, cta, footer.
- Escreva em português do Brasil, com texto específico do negócio — nada genérico como "Bem-vindo ao nosso site".
- Preços em reais (R$). Telefones e endereços plausíveis para a cidade citada.
- "pack" é o conjunto de fotos: barbearia, restaurante, beleza, clinica, loja, portfolio ou generico.
- "theme" define o estilo visual: moderno, minimalista, elegante, vibrante, profissional ou luxuoso.
- Não preencha campos que não pertencem ao tipo da seção.
- Nunca devolva HTML ou markdown, apenas os campos do schema.
`;

