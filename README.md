# Sintética

**Plataforma SaaS de criação de sites com IA para pequenos negócios.**

O usuário descreve o negócio em uma frase, a IA gera a primeira versão do site e ele refina tudo conversando no editor — sem escrever uma linha de código.

<sub>React 19 · TanStack Start · Vite 8 · TypeScript · Tailwind CSS 4 · Supabase</sub>

</div>

---

## Sumário

- [Visão geral](#visão-geral)
- [Principais recursos](#principais-recursos)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Começando](#começando)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Configurando a IA](#configurando-a-ia)
- [Scripts](#scripts)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rotas](#rotas)
- [Imagens](#imagens)
- [Deploy](#deploy)
- [Status e limitações](#status-e-limitações)

---

## Visão geral

A Sintética transforma uma descrição simples ("uma barbearia moderna no centro da cidade") em um site completo e editável. O fluxo é:

1. **Descreva** — o usuário informa o tipo de negócio e o objetivo.
2. **Gere** — a IA monta a estrutura do site (seções, textos, tema e imagens coerentes com o nicho).
3. **Refine** — no editor, o usuário ajusta cada seção conversando com a IA ou editando os campos diretamente.
4. **Publique** — o site fica disponível em uma URL própria (`/site/{slug}`).

Quando não há chave de IA configurada, um **gerador local** assume automaticamente, então o produto continua funcional para desenvolvimento e demonstração.

## Principais recursos

- **Geração de sites por IA** a partir de uma descrição em linguagem natural.
- **Editor visual** com painel de propriedades e chat contextual para edições incrementais.
- **Temas e identidade visual** aplicados automaticamente por nicho.
- **Sites publicados** com rota pública por slug e renderização dedicada.
- **Painel do usuário** para gerenciar sites, modelos e configurações.
- **Área administrativa** com visão de usuários, sites e relatórios (gráficos via Recharts).
- **Autenticação** completa (entrar, cadastro e recuperação de senha) via Supabase.
- **Modo claro/escuro** com alternância persistente.
- **Camada de IA agnóstica** — funciona com qualquer provedor compatível com o formato OpenAI.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19, SSR + server functions) |
| Roteamento | TanStack Router (file-based) |
| Build | Vite 8 |
| Linguagem | TypeScript (modo estrito) |
| Estilo | Tailwind CSS 4 + componentes no padrão shadcn/ui (Radix UI) |
| Autenticação | Supabase Auth |
| IA | Vercel AI SDK (`ai`) + `@ai-sdk/openai-compatible` |
| Validação | Zod + React Hook Form |
| Gráficos | Recharts |
| Ícones / UX | lucide-react · sonner (toasts) |

## Arquitetura

- **SSR e server functions:** a lógica sensível (chamadas de IA, uso da chave, acesso privilegiado ao Supabase) roda no servidor via server functions do TanStack Start. A chave da IA nunca é exposta ao navegador.
- **IA com fallback:** `ai.functions.ts` decide entre o provedor real (`ai-gateway.server.ts`) e o gerador local (`site-generator.ts` / `mock-ai.ts`). O schema de saída é validado com Zod (`ai-schema.ts`) e hidratado no modelo de site (`ai-hydrate.ts`).
- **Modelo de site:** cada site é uma estrutura de seções tipadas (`site-model.ts`) que o `SiteRenderer` transforma em página.
- **Persistência:** a autenticação é gerenciada pelo Supabase; os sites criados são mantidos no armazenamento local do navegador (`sites-store.tsx`, store de protótipo) — pronto para evoluir para persistência no Supabase.

## Começando

**Pré-requisitos:** [Bun](https://bun.sh) (recomendado) ou Node.js 20+. Uma conta no [Supabase](https://supabase.com) para a autenticação e, opcionalmente, uma chave de IA compatível com OpenAI.

```bash
# 1. Instale as dependências
bun install            # ou: npm install

# 2. Configure o ambiente
cp .env.example .env   # preencha os valores (veja a seção abaixo)

# 3. Rode em desenvolvimento
bun run dev            # http://localhost:8080
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Obrigatória | Descrição |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Sim | URL do projeto Supabase (cliente). |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Sim | Chave pública (anon) do Supabase (cliente). |
| `SUPABASE_URL` | Sim | URL do projeto Supabase (servidor). |
| `SUPABASE_PUBLISHABLE_KEY` | Sim | Chave pública (anon) do Supabase (servidor). |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim | Chave de service role, usada apenas no servidor. |
| `AI_API_KEY` | Não | Chave do provedor de IA. Sem ela, o gerador local assume. |
| `AI_BASE_URL` | Não | Endpoint da API de IA (padrão: `https://api.openai.com/v1`). |
| `AI_MODEL` | Não | Modelo a usar (padrão: `gpt-4.1-mini`). |

> As variáveis do servidor (sem o prefixo `VITE_`) só são lidas no backend e nunca chegam ao navegador.

## Configurando a IA

A camada de IA é agnóstica: qualquer API no formato OpenAI funciona. Exemplos de configuração:

| Provedor | `AI_BASE_URL` | `AI_MODEL` |
| --- | --- | --- |
| OpenAI | `https://api.openai.com/v1` | `gpt-4.1-mini` |
| OpenRouter | `https://openrouter.ai/api/v1` | `openai/gpt-4o-mini` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.3-70b-versatile` |
| Together | `https://api.together.xyz/v1` | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |

**Passo a passo:**

1. Cole sua chave em `AI_API_KEY` (e ajuste `AI_BASE_URL` / `AI_MODEL` se usar outro provedor).
2. Reinicie o servidor (`bun run dev`).
3. Abra **Painel → Configurações**: o cartão "Inteligência Artificial" confirma se a IA está **conectada**, mostrando o modelo e o endpoint em uso.

Sem chave, nada quebra — o app apenas gera os sites localmente.

## Scripts

| Comando | Descrição |
| --- | --- |
| `bun run dev` | Servidor de desenvolvimento em `http://localhost:8080`. |
| `bun run build` | Build de produção. |
| `bun run build:dev` | Build em modo de desenvolvimento. |
| `bun run preview` | Pré-visualiza o build de produção. |
| `bun run lint` | Executa o ESLint. |
| `bun run format` | Formata o código com o Prettier. |

## Estrutura do projeto

```
src/
├── components/
│   ├── admin/            # UI da área administrativa
│   ├── editor/           # Painel de propriedades do editor
│   ├── site/             # SiteRenderer (renderização das seções)
│   ├── ui/               # Componentes base (padrão shadcn/ui)
│   ├── AuthShell.tsx     # Layout das telas de autenticação
│   ├── SiteCard.tsx
│   └── ThemeToggle.tsx   # Alternância de tema claro/escuro
├── integrations/
│   └── supabase/         # Cliente, middleware de auth e tipos
├── lib/
│   ├── ai.functions.ts       # Server functions de IA (+ status)
│   ├── ai-gateway.server.ts  # Chamada ao provedor real
│   ├── ai-schema.ts          # Schema Zod da saída da IA
│   ├── ai-hydrate.ts         # Hidrata a resposta no modelo de site
│   ├── site-generator.ts     # Gerador local (fallback)
│   ├── mock-ai.ts            # Respostas simuladas p/ o fallback
│   ├── site-model.ts         # Tipos das seções do site
│   ├── site-images.ts        # Bancos de imagens por nicho
│   ├── site-themes.ts        # Temas visuais
│   ├── sites-store.tsx       # Store dos sites (localStorage)
│   └── admin-store.tsx       # Store da área administrativa
├── routes/               # Rotas (file-based routing)
├── router.tsx            # Configuração do router
├── server.ts             # Entrada do servidor
├── start.ts              # Bootstrap do TanStack Start
└── styles.css            # Estilos globais e tokens de tema
```

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Landing page. |
| `/entrar`, `/cadastro`, `/recuperar-senha` | Autenticação. |
| `/criar` | Fluxo de criação a partir de uma descrição. |
| `/editor/$siteId` | Editor visual com chat e painel de propriedades. |
| `/site/$slug` | Site publicado (rota pública). |
| `/painel`, `/painel/sites`, `/painel/modelos`, `/painel/configuracoes` | Painel do usuário. |
| `/admin`, `/admin/usuarios`, `/admin/sites`, `/admin/relatorios` | Área administrativa. |

## Imagens

Os sites gerados usam fotos coerentes com o nicho, organizadas em `lib/site-images.ts`. O renderizador exibe um placeholder discreto caso alguma imagem fique indisponível, então o layout nunca aparece quebrado. Para personalizar, edite os pacotes de imagens nesse arquivo.

## Deploy

O `bun run build` gera a saída do TanStack Start (baseado em Nitro), que pode ser publicada em qualquer provedor com suporte a Node/serverless. Garanta que todas as variáveis de ambiente estejam definidas no ambiente de produção — em especial as chaves do Supabase e, se desejar IA em produção, a `AI_API_KEY`.

## Status e limitações

- Os sites criados são persistidos no **armazenamento local do navegador** (store de protótipo). A integração com o Supabase para persistência de sites por usuário é o próximo passo natural de evolução.
- A camada de IA é opcional: sem chave, o gerador local assume automaticamente.

---

Feito com Sintética.
