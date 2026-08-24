import { uid, type Section, type SectionType } from "@/lib/site-model";
import { getPack } from "@/lib/site-images";

/** Cria uma seção nova com conteúdo de exemplo coerente com a categoria do site. */
export function createSection(type: SectionType, category = "generico"): Section {
  const pack = getPack(category);
  const id = uid();

  switch (type) {
    case "header":
      return { id, type, logo: "Meu Negócio", menu: ["Início", "Serviços", "Contato"], buttonLabel: "Fale conosco" };
    case "hero":
      return {
        id,
        type,
        title: "Um título que apresenta seu negócio",
        subtitle: "Escreva aqui uma frase curta explicando o que você faz e para quem.",
        buttonLabel: "Agendar agora",
        align: "left",
        image: pack.hero,
        badge: "Novidade",
      };
    case "services":
      return {
        id,
        type,
        title: "Nossos serviços",
        items: [
          { name: "Serviço um", price: "R$ 80", note: "Descrição breve do serviço.", image: pack.services[0] },
          { name: "Serviço dois", price: "R$ 120", note: "Descrição breve do serviço.", image: pack.services[1] },
          { name: "Serviço três", price: "R$ 150", note: "Descrição breve do serviço.", image: pack.services[2] },
        ],
      };
    case "about":
      return {
        id,
        type,
        title: "Sobre nós",
        text: "Conte a história do seu negócio, o que torna o atendimento diferente e por que os clientes voltam.",
        image: pack.about,
        stats: [
          { label: "Clientes atendidos", value: "1.200" },
          { label: "Anos de experiência", value: "8" },
        ],
      };
    case "gallery":
      return { id, type, title: "Galeria", count: pack.gallery.length, images: [...pack.gallery] };
    case "testimonials":
      return {
        id,
        type,
        title: "O que dizem sobre nós",
        items: [
          { name: "Ana Ribeiro", text: "Atendimento impecável do começo ao fim.", rating: 5, avatar: pack.avatars[0] },
          { name: "Carlos Duarte", text: "Resultado acima do que eu esperava.", rating: 5, avatar: pack.avatars[1] },
        ],
      };
    case "pricing":
      return {
        id,
        type,
        title: "Planos e pacotes",
        plans: [
          { name: "Essencial", price: "R$ 99", features: ["Benefício um", "Benefício dois"] },
          { name: "Completo", price: "R$ 199", features: ["Tudo do essencial", "Atendimento prioritário"], highlight: true },
        ],
      };
    case "location":
      return { id, type, title: "Onde estamos", address: "Rua Exemplo, 123", city: "São Paulo, SP", image: pack.location };
    case "contact":
      return {
        id,
        type,
        title: "Fale com a gente",
        whatsapp: "(11) 90000-0000",
        instagram: "@seunegocio",
        hours: ["Seg a Sex — 9h às 19h", "Sábado — 9h às 14h"],
      };
    case "cta":
      return {
        id,
        type,
        title: "Pronto para começar?",
        subtitle: "Agende agora e fale com nossa equipe.",
        buttonLabel: "Quero agendar",
        image: pack.hero,
      };
    case "footer":
    default:
      return { id, type: "footer", text: "© Meu Negócio — Todos os direitos reservados." };
  }
}
