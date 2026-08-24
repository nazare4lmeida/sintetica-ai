import type { AiSection, EditPlan, SitePlan } from "./ai-schema";
import { getPack } from "./site-images";
import type { Section, Site, ThemeId } from "./site-model";
import { slugify, uid } from "./site-model";

/**
 * Converte o plano devolvido pela IA na estrutura usada pela aplicação,
 * injetando ids estáveis e as imagens do pacote visual escolhido.
 */
export function hydrateSections(sections: AiSection[], packName: string): Section[] {
  const pack = getPack(packName);
  const txt = (v: string | undefined, fb: string) => (v && v.trim() ? v.trim() : fb);

  return sections.map((section) => {
    const id = uid();
    switch (section.type) {
      case "header":
        return {
          id,
          type: "header",
          logo: txt(section.logo, txt(section.title, "Minha Empresa")),
          menu: section.menu?.length ? section.menu.slice(0, 6) : ["Início", "Serviços", "Contato"],
          buttonLabel: txt(section.buttonLabel, "Fale conosco"),
        } as Section;
      case "hero":
        return {
          id,
          type: "hero",
          title: txt(section.title, "Qualidade que você reconhece"),
          subtitle: txt(section.subtitle, "Atendimento próximo, resultado profissional."),
          buttonLabel: txt(section.buttonLabel, "Falar no WhatsApp"),
          align: section.align ?? "center",
          ...(section.badge ? { badge: section.badge } : {}),
          image: pack.hero,
        } as Section;
      case "about":
        return {
          id,
          type: "about",
          title: txt(section.title, "Sobre nós"),
          text: txt(section.text, section.subtitle ?? "Uma equipe dedicada a entregar o melhor."),
          ...(section.stats?.length ? { stats: section.stats.slice(0, 4) } : {}),
          image: pack.about,
        } as Section;
      case "location":
        return {
          id,
          type: "location",
          title: txt(section.title, "Onde estamos"),
          address: txt(section.address, "Rua Principal, 100"),
          city: txt(section.city, "Brasil"),
          image: pack.location,
        } as Section;
      case "cta":
        return {
          id,
          type: "cta",
          title: txt(section.title, "Vamos começar?"),
          subtitle: txt(section.subtitle, "Fale com a gente e receba um atendimento personalizado."),
          buttonLabel: txt(section.buttonLabel, "Entrar em contato"),
          image: pack.hero,
        } as Section;
      case "footer":
        return { id, type: "footer", text: txt(section.text, "Todos os direitos reservados.") } as Section;
      case "contact":
        return {
          id,
          type: "contact",
          title: txt(section.title, "Contato"),
          whatsapp: txt(section.whatsapp, "(11) 90000-0000"),
          instagram: txt(section.instagram, "@minhaempresa"),
          hours: section.hours?.length ? section.hours.slice(0, 4) : ["Seg a Sex: 9h às 19h"],
        } as Section;
      case "gallery": {
        const count = Math.min(Math.max(Math.round(section.count ?? 6), 3), pack.gallery.length);
        return {
          id,
          type: "gallery",
          title: txt(section.title, "Galeria"),
          images: pack.gallery.slice(0, count),
          count,
        } as Section;
      }
      case "services": {
        const items = (section.items ?? []).slice(0, 6).map((item, i) => ({
          name: txt(item.name, `Serviço ${i + 1}`),
          price: txt(item.price, "Sob consulta"),
          ...(item.note ? { note: item.note } : {}),
          image: pack.services[i % pack.services.length],
        }));
        return {
          id,
          type: "services",
          title: txt(section.title, "Serviços"),
          items: items.length ? items : [{ name: "Serviço", price: "Sob consulta", image: pack.services[0] }],
        } as Section;
      }
      case "testimonials": {
        const items = (section.items ?? []).slice(0, 4).map((item, i) => ({
          name: txt(item.name, "Cliente"),
          text: txt(item.text, "Atendimento excelente, recomendo."),
          rating: item.rating && item.rating >= 4 ? 5 : 5,
          avatar: pack.avatars[i % pack.avatars.length],
        }));
        return {
          id,
          type: "testimonials",
          title: txt(section.title, "Depoimentos"),
          items: items.length
            ? items
            : [{ name: "Cliente", text: "Atendimento excelente.", rating: 5, avatar: pack.avatars[0] }],
        } as Section;
      }
      case "pricing":
        return {
          id,
          type: "pricing",
          title: txt(section.title, "Planos"),
          plans: (section.plans ?? []).slice(0, 4),
        } as Section;
      default:
        return { ...section, id } as Section;
    }
  });
}


export function siteFromPlan(plan: SitePlan, prompt: string): Site {
  const now = new Date().toISOString();
  return {
    id: uid(),
    name: plan.name,
    category: plan.category,
    slug: slugify(plan.name),
    status: "rascunho",
    theme: plan.theme as ThemeId,
    prompt,
    updatedAt: now,
    sections: hydrateSections(plan.sections, plan.pack),
    messages: [
      {
        id: uid(),
        role: "assistant",
        text: `Criei o site da ${plan.name} com ${plan.sections.length} seções. O que você quer ajustar primeiro?`,
        createdAt: now,
      },
    ],
  };
}

/** Deduz o pacote de imagens a partir da categoria do site já existente. */
export function packForCategory(category: string): string {
  const c = category.toLowerCase();
  if (/barbe/.test(c)) return "barbearia";
  if (/restaur|pizz|hambur|caf|bistr|gastro/.test(c)) return "restaurante";
  if (/sal[ãa]o|beleza|est[ée]tica/.test(c)) return "beleza";
  if (/cl[íi]nic|consult|odont|sa[úu]de|psic/.test(c)) return "clinica";
  if (/loja|comérc|comerc|boutique/.test(c)) return "loja";
  if (/portf[óo]lio|fot[óo]|design|arquitet|est[úu]dio/.test(c)) return "portfolio";
  return "generico";
}

export function applyEditPlan(site: Site, plan: EditPlan): Site {
  return {
    ...site,
    theme: (plan.theme as ThemeId) ?? site.theme,
    sections: hydrateSections(plan.sections, packForCategory(site.category)),
    updatedAt: new Date().toISOString(),
  };
}
