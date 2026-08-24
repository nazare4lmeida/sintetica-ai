import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Carrega o arquivo .env para process.env no servidor, preenchendo apenas as
 * chaves ainda ausentes (idempotente). Garante que AI_API_KEY / AI_BASE_URL /
 * AI_MODEL sejam lidos em qualquer ambiente, inclusive em dev.
 */
let envLoaded = false;
function loadEnv() {
  if (envLoaded) return;
  envLoaded = true;
  try {
    const content = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let value = t.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    /* .env ausente ou ilegível — usa apenas o process.env existente. */
  }
}
loadEnv();

/** Chave da IA lida do ambiente (undefined se não configurada). */
export function getAiApiKey(): string | undefined {
  loadEnv();
  const key = process.env["AI_API_KEY"];
  return key && key.trim() ? key.trim() : undefined;
}

/**
 * Provedor de IA (somente servidor). Compatível com qualquer API no formato
 * OpenAI (OpenAI, OpenRouter, Groq, Google Gemini via endpoint OpenAI, etc.).
 * Configure via .env:
 *   AI_API_KEY=...                          (obrigatório)
 *   AI_BASE_URL=https://api.openai.com/v1   (opcional)
 *   AI_MODEL=gpt-4.1-mini                    (opcional)
 */
export function createAiProvider(apiKey: string) {
  const baseURL = process.env["AI_BASE_URL"] ?? "https://api.openai.com/v1";
  return createOpenAICompatible({
    name: "sintetica",
    baseURL,
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}

export function getAiModel() {
  return process.env["AI_MODEL"] ?? "gpt-4.1-mini";
}
