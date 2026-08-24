/**
 * Modelo de dados do site gerado.
 *
 * A IA (hoje simulada, futuramente uma API real) nunca produz marcação bruta:
 * ela manipula esta estrutura, e o React interpreta e renderiza as seções.
 * Isso mantém interface, estado, conversa e publicação separados.
 */

export type ThemeId =
  | "moderno"
  | "minimalista"
  | "elegante"
  | "vibrante"
  | "profissional"
  | "luxuoso"
  | "argila"
  | "editorial"
  | "aurora"
  | "botanico"
  | "solar"
  | "noturno";

export type SectionType =
  | "header"
  | "hero"
  | "services"
  | "about"
  | "gallery"
  | "testimonials"
  | "pricing"
  | "location"
  | "contact"
  | "cta"
  | "footer";

export interface SectionBase {
  id: string;
  type: SectionType;
}

export interface HeaderSection extends SectionBase {
  type: "header";
  logo: string;
  menu: string[];
  buttonLabel: string;
}

export interface HeroSection extends SectionBase {
  type: "hero";
  title: string;
  subtitle: string;
  buttonLabel: string;
  align: "left" | "center";
  image?: string | undefined;
  badge?: string | undefined;
}

export interface ServiceItem {
  name: string;
  price: string;
  note?: string | undefined;
  image?: string | undefined;
}

export interface ServicesSection extends SectionBase {
  type: "services";
  title: string;
  items: ServiceItem[];
}

export interface AboutSection extends SectionBase {
  type: "about";
  title: string;
  text: string;
  image?: string | undefined;
  stats?: { label: string; value: string }[] | undefined;
}

export interface GallerySection extends SectionBase {
  type: "gallery";
  title: string;
  count: number;
  images?: string[] | undefined;
}

export interface TestimonialItem {
  name: string;
  text: string;
  rating: number;
  avatar?: string | undefined;
}

export interface TestimonialsSection extends SectionBase {
  type: "testimonials";
  title: string;
  items: TestimonialItem[];
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean | undefined;
}

export interface PricingSection extends SectionBase {
  type: "pricing";
  title: string;
  plans: PricingPlan[];
}

export interface LocationSection extends SectionBase {
  type: "location";
  title: string;
  address: string;
  city: string;
  image?: string | undefined;
}

export interface ContactSection extends SectionBase {
  type: "contact";
  title: string;
  whatsapp: string;
  instagram: string;
  hours: string[];
}

export interface CtaSection extends SectionBase {
  type: "cta";
  title: string;
  subtitle: string;
  buttonLabel: string;
  image?: string | undefined;
}

export interface FooterSection extends SectionBase {
  type: "footer";
  text: string;
}

export type Section =
  | HeaderSection
  | HeroSection
  | ServicesSection
  | AboutSection
  | GallerySection
  | TestimonialsSection
  | PricingSection
  | LocationSection
  | ContactSection
  | CtaSection
  | FooterSection;

export type SiteStatus = "rascunho" | "publicado";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: string;
}

export interface Site {
  id: string;
  name: string;
  category: string;
  slug: string;
  status: SiteStatus;
  theme: ThemeId;
  prompt: string;
  updatedAt: string;
  sections: Section[];
  messages: ChatMessage[];
}

export const SECTION_LABELS: Record<SectionType, string> = {
  header: "Topo",
  hero: "Destaque",
  services: "Serviços",
  about: "Sobre",
  gallery: "Galeria",
  testimonials: "Depoimentos",
  pricing: "Planos",
  location: "Localização",
  contact: "Contato",
  cta: "Chamada final",
  footer: "Rodapé",
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
