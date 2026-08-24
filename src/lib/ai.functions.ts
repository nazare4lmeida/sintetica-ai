import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createAiProvider, getAiModel, getAiApiKey } from "./ai-gateway.server";
import { editPlanSchema, sitePlanSchema, STRUCTURE_RULES } from "./ai-schema";

const generateInput = z.object({ prompt: z.string().min(3).max(2000) });

const editInput = z.object({
  message: z.string().min(1).max(2000),
  site: z.object({
    name: z.string(),
    category: z.string(),
    theme: z.string(),
    sections: z.unknown(),
  }),
});

/** Extrai o objeto JSON da resposta do modelo, tolerando cercas de markdown. */
function parseJson(text: string): unknown {
  const limpo = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const inicio = limpo.indexOf("{");
  const fim = limpo.lastIndexOf("}");
  if (inicio === -1 || fim === -1) throw new Error("AI_INVALID_JSON");
  return JSON.parse(limpo.slice(inicio, fim + 1));
}

export const aiGenerateSite = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => generateInput.parse(input))
  .handler(async ({ data }) => {
    const key = getAiApiKey();
    if (!key) throw new Error("AI_KEY_MISSING");

    const ai = createAiProvider(key);
    const result = await generateText({
      model: ai(getAiModel()),
      system: `Você é o motor de criação de sites da Sintética. A partir da descrição de um pequeno negócio, você projeta a estrutura e todo o conteúdo de um site institucional de alta qualidade.
Responda APENAS com um JSON válido, sem comentários, no formato:
{"name": string, "category": string, "theme": string, "pack": string, "sections": [ ... ]}${STRUCTURE_RULES}`,
      prompt: data.prompt,
    });

    return sitePlanSchema.parse(parseJson(result.text));
  });

export const aiEditSite = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => editInput.parse(input))
  .handler(async ({ data }) => {
    const key = getAiApiKey();
    if (!key) throw new Error("AI_KEY_MISSING");

    const ai = createAiProvider(key);
    const result = await generateText({
      model: ai(getAiModel()),
      system: `Você edita sites da Sintética. Recebe a estrutura atual do site e um pedido do dono do negócio, e devolve a estrutura completa já atualizada.
Responda APENAS com um JSON válido no formato:
{"reply": string, "theme": string opcional, "sections": [ ... ]}${STRUCTURE_RULES}
Regras extras:
- Devolva TODAS as seções, inclusive as que não mudaram, na ordem final.
- Altere apenas o que foi pedido; preserve o restante do texto exatamente.
- Em "reply", responda em uma ou duas frases, em português, dizendo o que foi feito.
- Só inclua "theme" se o pedido envolver mudança de estilo visual.`,
      prompt: `Site: ${data.site.name} (${data.site.category}), tema atual: ${data.site.theme}.
Estrutura atual (JSON):
${JSON.stringify(data.site.sections)}

Pedido do usuário: ${data.message}`,
    });

    return editPlanSchema.parse(parseJson(result.text));
  });
