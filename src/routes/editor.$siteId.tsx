import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Monitor, Tablet, Smartphone, Send, Sparkles, Check } from "lucide-react";
import { useSites } from "@/lib/sites-store";
import { SiteRenderer } from "@/components/site/SiteRenderer";
import { PropertiesPanel } from "@/components/editor/PropertiesPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CHAT_SUGGESTIONS, respondToMessage } from "@/lib/mock-ai";
import { aiEditSite } from "@/lib/ai.functions";
import { applyEditPlan } from "@/lib/ai-hydrate";
import { toast } from "sonner";

import { uid, type Section, type SectionType, type Site } from "@/lib/site-model";
import { createSection } from "@/lib/section-factory";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/editor/$siteId")({
  head: () => ({
    meta: [
      { title: "Editor — Sintética" },
      { name: "description", content: "Converse com a assistente e ajuste seu site em tempo real." },
      { property: "og:title", content: "Editor — Sintética" },
      { property: "og:description", content: "Edite e publique seu site conversando." },
    ],
  }),
  component: Editor,
});

const DEVICES = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "768px" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "390px" },
] as const;

function Editor() {
  const { siteId } = Route.useParams();
  const navigate = useNavigate();
  const { getSite, updateSite, ready } = useSites();
  const site = getSite(siteId);

  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("desktop");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [panel, setPanel] = useState<"chat" | "preview" | "props">("preview");
  const [publishOpen, setPublishOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [site?.messages.length, thinking]);

  if (!ready) {
    return <div className="min-h-screen bg-ink" />;
  }

  if (!site) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <p className="text-muted-foreground">Não encontramos esse site.</p>
        <Link to="/painel" className="rounded-full bg-foreground px-6 py-2.5 text-sm text-primary-foreground">
          Voltar ao painel
        </Link>
      </div>
    );
  }

  const selected = site.sections.find((s) => s.id === selectedId) ?? null;

  const send = (text: string) => {
    const message = text.trim();
    if (!message || thinking) return;
    setInput("");
    const withUser: Site = {
      ...site,
      messages: [
        ...site.messages,
        { id: uid(), role: "user", text: message, createdAt: new Date().toISOString() },
      ],
    };
    updateSite(withUser);
    setThinking(true);

    void (async () => {
      let reply: string;
      let nextSite: Site;
      try {
        const plan = await aiEditSite({
          data: {
            message,
            site: {
              name: withUser.name,
              category: withUser.category,
              theme: withUser.theme,
              sections: withUser.sections,
            },
          },
        });
        nextSite = applyEditPlan(withUser, plan);
        reply = plan.reply;
      } catch (err) {
        console.error("Falha na IA, usando edição local:", err);
        toast.error("IA indisponível — editei localmente. Verifique AI_API_KEY no .env.");
        const local = respondToMessage(withUser, message);
        nextSite = local.site;
        reply = local.reply;
      }
      updateSite({
        ...nextSite,
        messages: [
          ...nextSite.messages,
          { id: uid(), role: "assistant", text: reply, createdAt: new Date().toISOString() },
        ],
      });
      setThinking(false);
    })();
  };


  const changeSection = (section: Section) =>
    updateSite({
      ...site,
      updatedAt: new Date().toISOString(),
      sections: site.sections.map((s) => (s.id === section.id ? section : s)),
    });

  const persistSections = (sections: Section[]) =>
    updateSite({ ...site, sections, updatedAt: new Date().toISOString() });

  const moveSection = (id: string, direction: -1 | 1) => {
    const index = site.sections.findIndex((s) => s.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= site.sections.length) return;
    const sections = [...site.sections];
    const [item] = sections.splice(index, 1);
    sections.splice(target, 0, item as Section);
    persistSections(sections);
  };

  const duplicateSection = (id: string) => {
    const index = site.sections.findIndex((s) => s.id === id);
    const original = site.sections[index];
    if (!original) return;
    const copy = { ...structuredClone(original), id: uid() } as Section;
    const sections = [...site.sections];
    sections.splice(index + 1, 0, copy);
    persistSections(sections);
    setSelectedId(copy.id);
  };

  const deleteSection = (id: string) => {
    persistSections(site.sections.filter((s) => s.id !== id));
    setSelectedId(null);
  };

  const addSection = (type: SectionType) => {
    const section = createSection(type, site.category);
    const footerIndex = site.sections.findIndex((s) => s.type === "footer");
    const sections = [...site.sections];
    sections.splice(footerIndex >= 0 ? footerIndex : sections.length, 0, section);
    persistSections(sections);
    setSelectedId(section.id);
  };

  const publish = () => {
    updateSite({ ...site, status: "publicado", updatedAt: new Date().toISOString() });
    setPublished(true);
  };

  return (
    <div className="flex h-screen flex-col bg-ink text-ink-foreground">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-ink-line px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate({ to: "/painel" })}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink-muted hover:bg-ink-soft"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Painel</span>
          </button>
          <div className="h-5 w-px bg-ink-line" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{site.name}</div>
            <div className="text-[10px] uppercase tracking-widest text-ink-muted">
              {site.status === "publicado" ? "Publicado" : "Rascunho"}
            </div>
          </div>
        </div>

        <div className="hidden rounded-lg border border-ink-line bg-ink-soft p-1 md:flex">
          {DEVICES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setDevice(id)}
              title={label}
              className={cn(
                "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium",
                device === id ? "bg-ink-line text-ink-foreground" : "text-ink-muted",
              )}
            >
              <Icon className="size-3.5" />
              <span className="hidden lg:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle tone="ink" />
          <button
            onClick={() => setPublishOpen(true)}
            className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground"
          >
            Publicar
          </button>
        </div>

      </header>

      <div className="flex shrink-0 gap-1 border-b border-ink-line bg-ink-soft p-1 lg:hidden">
        {(
          [
            { id: "chat", label: "Chat" },
            { id: "preview", label: "Visualização" },
            { id: "props", label: "Propriedades" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setPanel(t.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              panel === t.id ? "bg-ink-line text-ink-foreground" : "text-ink-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[320px_1fr_300px]">
        {/* Conversa */}
        <aside
          className={cn(
            "min-h-0 flex-col border-ink-line bg-ink-soft lg:flex lg:border-r",
            panel === "chat" ? "flex" : "hidden",
          )}
        >

          <div className="flex items-center gap-2 border-b border-ink-line px-5 py-4">
            <span className="size-2 rounded-full bg-accent" />
            <span className="text-sm font-semibold">Assistente de criação</span>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {site.messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-lg p-3 text-sm leading-relaxed",
                  m.role === "assistant"
                    ? "border border-ink-line bg-ink/60 text-ink-foreground/85"
                    : "ml-auto bg-accent text-accent-foreground",
                )}
              >
                {m.text}
              </div>
            ))}

            {thinking && (
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <span className="size-1.5 animate-pulse rounded-full bg-accent" />
                Ajustando seu site...
              </div>
            )}

            {site.messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {CHAT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-ink-line px-2.5 py-1 text-[10px] text-ink-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            className="border-t border-ink-line p-4"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Descreva uma alteração..."
                className="w-full rounded-lg border border-ink-line bg-ink py-3 pl-4 pr-11 text-sm text-ink-foreground outline-none placeholder:text-ink-muted focus:border-accent"
              />
              <button
                type="submit"
                aria-label="Enviar"
                className="absolute right-2 top-1.5 flex size-8 items-center justify-center rounded-md bg-accent text-accent-foreground disabled:opacity-40"
                disabled={thinking}
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </form>
        </aside>

        {/* Preview */}
        <main
          className={cn(
            "min-h-0 overflow-y-auto bg-surface-2 p-4 sm:p-6 lg:block",
            panel === "preview" ? "block" : "hidden",
          )}
        >
          <div
            className="mx-auto overflow-hidden rounded-xl bg-background shadow-2xl transition-[max-width] duration-300"
            style={{ maxWidth: DEVICES.find((d) => d.id === device)!.width }}
          >
            <SiteRenderer
              site={site}
              interactive
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          <p className="mx-auto mt-4 max-w-md text-center text-[11px] text-ink-muted">
            Clique em uma parte do site para editar pelo painel da direita.
          </p>
        </main>

        {/* Propriedades */}
        <aside
          className={cn(
            "min-h-0 overflow-y-auto border-ink-line lg:block lg:border-l",
            panel === "props" ? "block" : "hidden",
          )}
        >
          <PropertiesPanel
            site={site}
            section={selected}
            onChangeSection={changeSection}
            onChangeTheme={(theme) => updateSite({ ...site, theme, updatedAt: new Date().toISOString() })}
            onChangeSite={(patch) =>
              updateSite({ ...site, ...patch, updatedAt: new Date().toISOString() })
            }
            onMoveSection={moveSection}
            onDuplicateSection={duplicateSection}
            onDeleteSection={deleteSection}
            onAddSection={addSection}
          />
        </aside>
      </div>

      <Dialog
        open={publishOpen}
        onOpenChange={(open) => {
          setPublishOpen(open);
          if (!open) setPublished(false);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {published ? "Seu site está no ar!" : "Seu site está pronto para ser publicado."}
            </DialogTitle>
            <DialogDescription>
              {published
                ? "Compartilhe o endereço abaixo com seus clientes."
                : "Confira o endereço e publique quando quiser. Você pode alterar tudo depois."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Endereço
              </div>
              <div className="mt-1 font-mono text-sm">{site.slug}.sintetica.site</div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full",
                  published ? "bg-accent text-accent-foreground" : "bg-surface-2 text-muted-foreground",
                )}
              >
                {published ? <Check className="size-3" /> : <Sparkles className="size-3" />}
              </span>
              {published ? "Publicado agora mesmo" : "Pronto para publicar"}
            </div>

            {published ? (
              <Link
                to="/site/$slug"
                params={{ slug: site.slug }}
                className="block rounded-full bg-foreground px-6 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Visitar site
              </Link>
            ) : (
              <button
                onClick={publish}
                className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
              >
                Publicar site
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
