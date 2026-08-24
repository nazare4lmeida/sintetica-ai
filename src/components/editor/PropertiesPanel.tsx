import { useState } from "react";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2, X } from "lucide-react";
import type { Section, SectionType, Site } from "@/lib/site-model";
import { SECTION_LABELS } from "@/lib/site-model";
import { SITE_THEMES } from "@/lib/site-themes";
import { ALL_IMAGES } from "@/lib/site-images";

const inputClass =
  "w-full rounded-md border border-ink-line bg-ink px-3 py-2 text-xs text-ink-foreground outline-none focus:border-accent";

const labelClass = "mb-2 block text-[10px] uppercase tracking-widest text-ink-muted";

const miniButton =
  "inline-flex items-center gap-1 rounded border border-ink-line px-2 py-1 text-[10px] font-semibold text-ink-muted transition-colors hover:border-accent hover:text-accent";

const ADD_TYPES: SectionType[] = [
  "hero",
  "services",
  "about",
  "gallery",
  "testimonials",
  "pricing",
  "location",
  "contact",
  "cta",
];

function Field({
  label,
  value,
  onChange,
  rows,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  rows?: number;
  type?: string;
}) {
  return (
    <div>
      <span className={labelClass}>{label}</span>
      {rows ? (
        <textarea
          className={inputClass}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className={inputClass}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/** Campo de imagem: caminho editável + galeria local + remoção. */
function ImageField({
  label,
  value,
  onChange,
  onRemove,
}: {
  label: string;
  value?: string | undefined;
  onChange: (value: string) => void;
  onRemove?: (() => void) | undefined;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="mb-2 flex items-center gap-2">
        {value ? (
          <img
            src={value}
            alt=""
            className="size-12 shrink-0 rounded object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        ) : (
          <div className="size-12 shrink-0 rounded border border-dashed border-ink-line" />
        )}
        <input
          className={inputClass}
          placeholder="/site-images/... ou https://..."
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <button type="button" className={miniButton} onClick={() => setOpen((v) => !v)}>
          {open ? "Fechar galeria" : "Escolher imagem"}
        </button>
        {onRemove && value && (
          <button type="button" className={miniButton} onClick={onRemove}>
            <Trash2 className="size-3" /> Remover
          </button>
        )}
      </div>
      {open && (
        <div className="mt-2 grid max-h-48 grid-cols-4 gap-1 overflow-y-auto rounded border border-ink-line p-1">
          {ALL_IMAGES.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => {
                onChange(src);
                setOpen(false);
              }}
              className="aspect-square overflow-hidden rounded"
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ListHeader({
  title,
  onAdd,
  addLabel = "Adicionar",
}: {
  title: string;
  onAdd: () => void;
  addLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] uppercase tracking-widest text-ink-muted">{title}</span>
      <button type="button" className={miniButton} onClick={onAdd}>
        <Plus className="size-3" /> {addLabel}
      </button>
    </div>
  );
}

function ItemCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="relative space-y-2 rounded-md border border-ink-line p-3">
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remover item"
        className="absolute right-2 top-2 text-ink-muted transition-colors hover:text-destructive"
      >
        <X className="size-3.5" />
      </button>
      {children}
    </div>
  );
}

export function PropertiesPanel({
  site,
  section,
  onChangeSection,
  onChangeTheme,
  onChangeSite,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
  onAddSection,
}: {
  site: Site;
  section: Section | null;
  onChangeSection: (section: Section) => void;
  onChangeTheme: (theme: Site["theme"]) => void;
  onChangeSite?: ((patch: Partial<Pick<Site, "name" | "slug">>) => void) | undefined;
  onMoveSection?: ((id: string, direction: -1 | 1) => void) | undefined;
  onDuplicateSection?: ((id: string) => void) | undefined;
  onDeleteSection?: ((id: string) => void) | undefined;
  onAddSection?: ((type: SectionType) => void) | undefined;
}) {
  const patch = (values: Partial<Section>) =>
    onChangeSection({ ...(section as Section), ...values } as Section);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-ink-soft p-5 text-ink-foreground">
      <div className="mb-5 text-xs font-bold uppercase tracking-widest text-ink-muted">
        Propriedades
      </div>

      {/* Dados gerais do site */}
      {onChangeSite && (
        <div className="mb-6 space-y-3 border-b border-ink-line pb-5">
          <Field
            label="Nome do site"
            value={site.name}
            onChange={(v) => onChangeSite({ name: v })}
          />
          <Field
            label="Endereço (slug)"
            value={site.slug}
            onChange={(v) =>
              onChangeSite({
                slug: v
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .replace(/[^a-z0-9-]+/g, "-"),
              })
            }
          />
        </div>
      )}

      {!section ? (
        <p className="text-xs leading-relaxed text-ink-muted">
          Clique em qualquer parte do site ao lado para editar textos, imagens, botões e estilo
          daquela seção.
        </p>
      ) : (
        <div className="space-y-5">
          <div>
            <span className={labelClass}>Seção selecionada</span>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{SECTION_LABELS[section.type]}</span>
              <div className="flex gap-1">
                {onMoveSection && (
                  <>
                    <button
                      type="button"
                      aria-label="Mover para cima"
                      className={miniButton}
                      onClick={() => onMoveSection(section.id, -1)}
                    >
                      <ChevronUp className="size-3" />
                    </button>
                    <button
                      type="button"
                      aria-label="Mover para baixo"
                      className={miniButton}
                      onClick={() => onMoveSection(section.id, 1)}
                    >
                      <ChevronDown className="size-3" />
                    </button>
                  </>
                )}
                {onDuplicateSection && (
                  <button
                    type="button"
                    aria-label="Duplicar seção"
                    className={miniButton}
                    onClick={() => onDuplicateSection(section.id)}
                  >
                    <Copy className="size-3" />
                  </button>
                )}
                {onDeleteSection && section.type !== "header" && section.type !== "footer" && (
                  <button
                    type="button"
                    aria-label="Excluir seção"
                    className={miniButton}
                    onClick={() => onDeleteSection(section.id)}
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {section.type === "header" && (
            <>
              <Field
                label="Nome do negócio"
                value={section.logo}
                onChange={(v) => patch({ logo: v } as Partial<Section>)}
              />
              <div className="space-y-2">
                <ListHeader
                  title="Itens do menu"
                  onAdd={() => patch({ menu: [...section.menu, "Novo item"] } as Partial<Section>)}
                />
                {section.menu.map((item, i) => (
                  <ItemCard
                    key={i}
                    onRemove={() =>
                      patch({ menu: section.menu.filter((_, j) => j !== i) } as Partial<Section>)
                    }
                  >
                    <input
                      className={inputClass}
                      value={item}
                      onChange={(e) => {
                        const menu = [...section.menu];
                        menu[i] = e.target.value;
                        patch({ menu } as Partial<Section>);
                      }}
                    />
                  </ItemCard>
                ))}
              </div>
              <Field
                label="Botão"
                value={section.buttonLabel}
                onChange={(v) => patch({ buttonLabel: v } as Partial<Section>)}
              />
            </>
          )}

          {section.type === "hero" && (
            <>
              <Field
                label="Selo"
                value={section.badge ?? ""}
                onChange={(v) => patch({ badge: v } as Partial<Section>)}
              />
              <Field
                label="Título"
                rows={3}
                value={section.title}
                onChange={(v) => patch({ title: v } as Partial<Section>)}
              />
              <Field
                label="Subtítulo"
                rows={3}
                value={section.subtitle}
                onChange={(v) => patch({ subtitle: v } as Partial<Section>)}
              />
              <Field
                label="Botão"
                value={section.buttonLabel}
                onChange={(v) => patch({ buttonLabel: v } as Partial<Section>)}
              />
              <ImageField
                label="Imagem de fundo"
                value={section.image}
                onChange={(v) => patch({ image: v } as Partial<Section>)}
                onRemove={() => patch({ image: undefined } as Partial<Section>)}
              />
              <div>
                <span className={labelClass}>Alinhamento</span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                  {(["left", "center"] as const).map((a) => (
                    <button
                      key={a}
                      onClick={() => patch({ align: a } as Partial<Section>)}
                      className={
                        section.align === a
                          ? "rounded bg-accent py-2 text-accent-foreground"
                          : "rounded bg-ink-line py-2"
                      }
                    >
                      {a === "left" ? "Esquerda" : "Centro"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {section.type === "services" && (
            <>
              <Field
                label="Título"
                value={section.title}
                onChange={(v) => patch({ title: v } as Partial<Section>)}
              />
              <div className="space-y-3">
                <ListHeader
                  title="Serviços"
                  onAdd={() =>
                    patch({
                      items: [...section.items, { name: "Novo serviço", price: "R$ 0" }],
                    } as Partial<Section>)
                  }
                />
                {section.items.map((item, i) => {
                  const update = (values: Partial<typeof item>) => {
                    const items = [...section.items];
                    items[i] = { ...item, ...values };
                    patch({ items } as Partial<Section>);
                  };
                  return (
                    <ItemCard
                      key={i}
                      onRemove={() =>
                        patch({
                          items: section.items.filter((_, j) => j !== i),
                        } as Partial<Section>)
                      }
                    >
                      <Field label="Nome" value={item.name} onChange={(v) => update({ name: v })} />
                      <Field
                        label="Preço"
                        value={item.price}
                        onChange={(v) => update({ price: v })}
                      />
                      <Field
                        label="Descrição"
                        rows={2}
                        value={item.note ?? ""}
                        onChange={(v) => update({ note: v })}
                      />
                      <ImageField
                        label="Imagem"
                        value={item.image}
                        onChange={(v) => update({ image: v })}
                        onRemove={() => update({ image: undefined })}
                      />
                    </ItemCard>
                  );
                })}
              </div>
            </>
          )}

          {section.type === "about" && (
            <>
              <Field
                label="Título"
                value={section.title}
                onChange={(v) => patch({ title: v } as Partial<Section>)}
              />
              <Field
                label="Texto"
                rows={6}
                value={section.text}
                onChange={(v) => patch({ text: v } as Partial<Section>)}
              />
              <ImageField
                label="Imagem"
                value={section.image}
                onChange={(v) => patch({ image: v } as Partial<Section>)}
                onRemove={() => patch({ image: undefined } as Partial<Section>)}
              />
              <div className="space-y-3">
                <ListHeader
                  title="Números em destaque"
                  onAdd={() =>
                    patch({
                      stats: [...(section.stats ?? []), { label: "Novo dado", value: "100" }],
                    } as Partial<Section>)
                  }
                />
                {(section.stats ?? []).map((stat, i) => {
                  const update = (values: Partial<typeof stat>) => {
                    const stats = [...(section.stats ?? [])];
                    stats[i] = { ...stat, ...values };
                    patch({ stats } as Partial<Section>);
                  };
                  return (
                    <ItemCard
                      key={i}
                      onRemove={() =>
                        patch({
                          stats: (section.stats ?? []).filter((_, j) => j !== i),
                        } as Partial<Section>)
                      }
                    >
                      <Field
                        label="Valor"
                        value={stat.value}
                        onChange={(v) => update({ value: v })}
                      />
                      <Field
                        label="Legenda"
                        value={stat.label}
                        onChange={(v) => update({ label: v })}
                      />
                    </ItemCard>
                  );
                })}
              </div>
            </>
          )}

          {section.type === "gallery" && (
            <>
              <Field
                label="Título"
                value={section.title}
                onChange={(v) => patch({ title: v } as Partial<Section>)}
              />
              <div className="space-y-3">
                <ListHeader
                  title="Imagens"
                  onAdd={() => {
                    const images = [...(section.images ?? []), ALL_IMAGES[0] ?? ""];
                    patch({ images, count: images.length } as Partial<Section>);
                  }}
                />
                {(section.images ?? []).map((src, i) => (
                  <ItemCard
                    key={i}
                    onRemove={() => {
                      const images = (section.images ?? []).filter((_, j) => j !== i);
                      patch({ images, count: images.length } as Partial<Section>);
                    }}
                  >
                    <ImageField
                      label={`Imagem ${i + 1}`}
                      value={src}
                      onChange={(v) => {
                        const images = [...(section.images ?? [])];
                        images[i] = v;
                        patch({ images } as Partial<Section>);
                      }}
                    />
                  </ItemCard>
                ))}
              </div>
            </>
          )}

          {section.type === "testimonials" && (
            <>
              <Field
                label="Título"
                value={section.title}
                onChange={(v) => patch({ title: v } as Partial<Section>)}
              />
              <div className="space-y-3">
                <ListHeader
                  title="Depoimentos"
                  onAdd={() =>
                    patch({
                      items: [
                        ...section.items,
                        { name: "Novo cliente", text: "Escreva o depoimento.", rating: 5 },
                      ],
                    } as Partial<Section>)
                  }
                />
                {section.items.map((item, i) => {
                  const update = (values: Partial<typeof item>) => {
                    const items = [...section.items];
                    items[i] = { ...item, ...values };
                    patch({ items } as Partial<Section>);
                  };
                  return (
                    <ItemCard
                      key={i}
                      onRemove={() =>
                        patch({
                          items: section.items.filter((_, j) => j !== i),
                        } as Partial<Section>)
                      }
                    >
                      <Field label="Nome" value={item.name} onChange={(v) => update({ name: v })} />
                      <Field
                        label="Depoimento"
                        rows={3}
                        value={item.text}
                        onChange={(v) => update({ text: v })}
                      />
                      <Field
                        label="Nota (1 a 5)"
                        type="number"
                        value={item.rating}
                        onChange={(v) =>
                          update({ rating: Math.min(5, Math.max(1, Number(v) || 5)) })
                        }
                      />
                      <ImageField
                        label="Foto"
                        value={item.avatar}
                        onChange={(v) => update({ avatar: v })}
                        onRemove={() => update({ avatar: undefined })}
                      />
                    </ItemCard>
                  );
                })}
              </div>
            </>
          )}

          {section.type === "pricing" && (
            <>
              <Field
                label="Título"
                value={section.title}
                onChange={(v) => patch({ title: v } as Partial<Section>)}
              />
              <div className="space-y-3">
                <ListHeader
                  title="Planos"
                  onAdd={() =>
                    patch({
                      plans: [
                        ...section.plans,
                        { name: "Novo plano", price: "R$ 0", features: ["Benefício"] },
                      ],
                    } as Partial<Section>)
                  }
                />
                {section.plans.map((plan, i) => {
                  const update = (values: Partial<typeof plan>) => {
                    const plans = [...section.plans];
                    plans[i] = { ...plan, ...values };
                    patch({ plans } as Partial<Section>);
                  };
                  return (
                    <ItemCard
                      key={i}
                      onRemove={() =>
                        patch({
                          plans: section.plans.filter((_, j) => j !== i),
                        } as Partial<Section>)
                      }
                    >
                      <Field label="Nome" value={plan.name} onChange={(v) => update({ name: v })} />
                      <Field
                        label="Preço"
                        value={plan.price}
                        onChange={(v) => update({ price: v })}
                      />
                      <Field
                        label="Benefícios (um por linha)"
                        rows={4}
                        value={plan.features.join("\n")}
                        onChange={(v) => update({ features: v.split("\n") })}
                      />
                      <button
                        type="button"
                        className={miniButton}
                        onClick={() => update({ highlight: !plan.highlight })}
                      >
                        {plan.highlight ? "Remover destaque" : "Marcar como destaque"}
                      </button>
                    </ItemCard>
                  );
                })}
              </div>
            </>
          )}

          {section.type === "location" && (
            <>
              <Field
                label="Título"
                value={section.title}
                onChange={(v) => patch({ title: v } as Partial<Section>)}
              />
              <Field
                label="Endereço"
                value={section.address}
                onChange={(v) => patch({ address: v } as Partial<Section>)}
              />
              <Field
                label="Cidade"
                value={section.city}
                onChange={(v) => patch({ city: v } as Partial<Section>)}
              />
              <ImageField
                label="Imagem"
                value={section.image}
                onChange={(v) => patch({ image: v } as Partial<Section>)}
                onRemove={() => patch({ image: undefined } as Partial<Section>)}
              />
            </>
          )}

          {section.type === "contact" && (
            <>
              <Field
                label="Título"
                value={section.title}
                onChange={(v) => patch({ title: v } as Partial<Section>)}
              />
              <Field
                label="WhatsApp"
                value={section.whatsapp}
                onChange={(v) => patch({ whatsapp: v } as Partial<Section>)}
              />
              <Field
                label="Instagram"
                value={section.instagram}
                onChange={(v) => patch({ instagram: v } as Partial<Section>)}
              />
              <Field
                label="Horários (um por linha)"
                rows={4}
                value={section.hours.join("\n")}
                onChange={(v) => patch({ hours: v.split("\n") } as Partial<Section>)}
              />
            </>
          )}

          {section.type === "cta" && (
            <>
              <Field
                label="Título"
                value={section.title}
                onChange={(v) => patch({ title: v } as Partial<Section>)}
              />
              <Field
                label="Subtítulo"
                rows={3}
                value={section.subtitle}
                onChange={(v) => patch({ subtitle: v } as Partial<Section>)}
              />
              <Field
                label="Botão"
                value={section.buttonLabel}
                onChange={(v) => patch({ buttonLabel: v } as Partial<Section>)}
              />
              <ImageField
                label="Imagem de fundo"
                value={section.image}
                onChange={(v) => patch({ image: v } as Partial<Section>)}
                onRemove={() => patch({ image: undefined } as Partial<Section>)}
              />
            </>
          )}

          {section.type === "footer" && (
            <Field
              label="Texto do rodapé"
              value={section.text}
              onChange={(v) => patch({ text: v } as Partial<Section>)}
            />
          )}
        </div>
      )}

      {onAddSection && (
        <div className="mt-8 border-t border-ink-line pt-5">
          <span className={labelClass}>Adicionar seção</span>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
            {ADD_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => onAddSection(type)}
                className="rounded bg-ink-line py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                + {SECTION_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-ink-line pt-5">
        <span className={labelClass}>Estilo visual do site</span>
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
          {SITE_THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => onChangeTheme(t.id)}
              className={
                site.theme === t.id
                  ? "rounded bg-accent py-2 text-accent-foreground"
                  : "rounded bg-ink-line py-2 hover:bg-ink-line/70"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-ink-muted">
          O estilo define cores, tipografia e espaçamento de todas as seções.
        </p>
      </div>
    </div>
  );
}
