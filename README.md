# FMShop

E-commerce full stack construído com **Next.js 16 (App Router)**, **Sanity CMS**, **Clerk**, **Stripe** e **Melhor Envio**. Catálogo, carrinho, wishlist, checkout, área do cliente e painel administrativo em uma única aplicação TypeScript.

[![Deploy with Vercel](https://vercel.com/button)](https://fm-ecommerce-jade.vercel.app/)
[![CI](https://github.com/FelipeMeloGomes/FM_Ecommerce/actions/workflows/ci.yml/badge.svg)](https://github.com/FelipeMeloGomes/FM_Ecommerce/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.4-f9f1e1)](https://bun.sh/)

**Demo:** https://fm-ecommerce-jade.vercel.app/

---

## Stack

| Camada          | Tecnologias                                                          |
| --------------- | -------------------------------------------------------------------- |
| Framework       | Next.js 16.4 (App Router, Turbopack), React 19, TypeScript 5        |
| UI              | Tailwind CSS 4, shadcn/ui, Radix UI, Motion, Lucide, next-themes     |
| Conteúdo        | Sanity 6 (schemas, GROQ, Studio em `/studio`)                        |
| Autenticação    | Clerk 6 (middleware, organização de usuários, metadados de admin)    |
| Pagamentos      | Stripe Checkout (cartão, boleto, Apple Pay/Google Pay)                |
| Frete           | Melhor Envio (cotação por CEP)                                       |
| Estado          | Zustand (carrinho) + React Hook Form + Zod                           |
| Qualidade       | Biome, Vitest 4, TypeScript strict, GitHub Actions                   |
| Runtime / build | Bun 1.4 (package manager, scripts e CI), Vercel (deploy)             |

## Funcionalidades

- **Catálogo** — produtos, variantes, controle de estoque, promoções, categorias e marcas vindos do Sanity.
- **Busca e filtros** — busca por nome com normalização de acentos, filtros por categoria/marca e ordenação por preço.
- **Carrinho** — persistido em `localStorage` via Zustand, com validação de quantidade e estoque.
- **Wishlist** — híbrida: `localStorage` para visitantes e Sanity para usuários logados, com migração automática no login.
- **Checkout** — Stripe Checkout com cartão, boleto e wallets; cotação de frete por CEP e criação de pedido no Sanity.
- **Conta do cliente** — login/cadastro customizados, endereços e histórico de pedidos.
- **Painel admin** — CRUD de produtos, categorias e marcas, pedidos e perguntas, protegido por role no Clerk.
- **Avaliações e perguntas** — reviews com upload de imagens e perguntas de clientes por produto.
- **UX** — tema claro/escuro, menu mobile, skeletons de carregamento, metadata SEO e imagens otimizadas.
- **API documentada** — Swagger UI e spec OpenAPI 3.1 geradas a partir dos schemas Zod.

## Arquitetura

O código separa domínio, casos de uso e integrações externas:

```
core/        Entidades, contratos e tipos de domínio
services/    Casos de uso + repositórios Sanity (produtos, marcas, categorias, pedidos)
infra/       Gateways externos (Stripe, Melhor Envio)
app/         Rotas do App Router, route groups e API Routes
sanity/      Schemas, queries GROQ e configuração do Studio
components/  Componentes React (UI, admin, dialogs, skeletons)
lib/         Schemas Zod, OpenAPI, rate limit, utilitários
tests/       Testes unitários e de integração (Vitest)
```

## Como rodar

### Pré-requisitos

- [Bun](https://bun.sh/) **1.4.4+** (o `bun.lock` usa `lockfileVersion: 3`)
- Node.js 20.9+ apenas se não for usar o Bun como runtime
- Contas no [Sanity](https://www.sanity.io/), [Clerk](https://clerk.com/), [Stripe](https://stripe.com/) e [Melhor Envio](https://melhorenvio.com.br/)

### Instalação

```bash
git clone https://github.com/FelipeMeloGomes/FM_Ecommerce.git
cd FM_Ecommerce

bun install
cp .env.example .env
# Preencha o .env com suas credenciais
```

> [!NOTE]
> O Next.js carrega `.env` automaticamente. Os scripts em `scripts/` usam `--env-file=.env`; se preferir manter segredos em `.env.local`, duplique as variáveis usadas pelos scripts.

### Banco de dados (Sanity)

Importe o dataset de exemplo e rode o Studio:

```bash
bunx sanity dataset import ./seed.tar.gz production
bun run dev
```

- Loja: http://localhost:3000
- Studio: http://localhost:3000/studio
- Swagger UI: http://localhost:3000/api-docs
- OpenAPI JSON: http://localhost:3000/api-docs/json

### Scripts auxiliares

```bash
# Preenche peso e dimensões dos produtos existentes
bun --env-file=.env scripts/updateProducts.ts

# Insere marcas com descrições e logos
bun --env-file=.env scripts/insertBrands.ts
```

## Scripts

| Comando                 | Descrição                            |
| ----------------------- | ------------------------------------ |
| `bun run dev`           | Servidor de desenvolvimento          |
| `bun run build`         | Build de produção                    |
| `bun run start`         | Servidor de produção                 |
| `bun run lint`          | Verificação com Biome                |
| `bun run lint:fix`      | Corrige lint e formatação            |
| `bun run analyze`       | Build com análise de bundle          |
| `bun run typegen`       | Extrai schema e gera tipos do Sanity |
| `bun run test`          | Testes (Vitest, jsdom)               |
| `bun run test:watch`    | Testes em modo watch                 |

Verificações usadas no CI:

```bash
bunx --no-install tsc --noEmit
bun audit
```

## Variáveis de ambiente

| Variável                            | Obrigatória | Descrição                                      |
| ----------------------------------- | ----------- | ---------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL`              | Sim         | URL pública da aplicação                       |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Sim         | Chave pública do Clerk                         |
| `CLERK_SECRET_KEY`                  | Sim         | Chave secreta do Clerk                         |
| `CSRF_SECRET`                       | Produção    | Assina o cookie CSRF (double-submit)           |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`     | Sim         | ID do projeto Sanity                           |
| `NEXT_PUBLIC_SANITY_DATASET`        | Sim         | Dataset do Sanity                              |
| `NEXT_PUBLIC_SANITY_API_VERSION`    | Não         | Versão da API (padrão `2026-01-28`)            |
| `SANITY_API_READ_TOKEN`             | Sim         | Token de leitura para queries                  |
| `SANITY_API_TOKEN`                  | Sim         | Token de escrita da aplicação                  |
| `SANITY_TOKEN_ADM`                  | Scripts     | Token administrativo para scripts de seed       |
| `STRIPE_RESTRICTED_KEY`             | Sim         | Chave restrita do Stripe                       |
| `STRIPE_WEBHOOK_SECRET`             | Sim         | Segredo do endpoint de webhook                 |
| `MELHOR_ENVIO_TOKEN`                | Sim         | Token da API do Melhor Envio                   |
| `MELHOR_ENVIO_ORIGIN_CEP`           | Sim         | CEP de origem para cálculo de frete            |

## Administração

O acesso ao painel usa o metadado público do Clerk:

```json
{ "role": "admin" }
```

1. Abra o [Clerk Dashboard](https://dashboard.clerk.com) e selecione o usuário.
2. Em **Public metadata**, adicione `{ "role": "admin" }`.
3. As rotas `/admin/*` e `/api/admin/*` passam a ser liberadas na próxima requisição.

A proteção acontece em três camadas: middleware (`proxy.ts`), guard por handler (`lib/requireAdmin.ts`) e layout guard em `app/(client)/admin/layout.tsx`.

## Segurança

- **Clerk** para autenticação e autorização; rotas admin exigem `role: admin`.
- **Rate limiting** por IP e rota em `/api/*` (`lib/rate-limit.ts`).
- **CSRF** com `@csrf-armor/nextjs` (double-submit assinado em produção).
- **Sanitização de HTML** com `sanitize-html` em conteúdos vindos do CMS.
- **Webhook Stripe** valida a assinatura antes de criar o pedido.
- **Zod** valida payloads de API, formulários e variáveis críticas.

> [!IMPORTANT]
> `CSRF_SECRET` é obrigatório em produção. Sem ele, a proteção CSRF fica desativada.

## API

| Método                | Rota                              | Descrição                    |
| --------------------- | --------------------------------- | ---------------------------- |
| `POST`                | `/api/webhook`                    | Webhook do Stripe            |
| `GET`                 | `/api/products`                   | Listagem pública de produtos |
| `POST/PUT/DELETE`     | `/api/admin/products[/{id}]`      | CRUD de produtos             |
| `POST/PUT/DELETE`     | `/api/admin/categories[/{id}]`    | CRUD de categorias           |
| `POST/PUT/DELETE`     | `/api/admin/brands[/{id}]`        | CRUD de marcas               |

A spec é gerada a partir dos schemas Zod em `lib/openapi/` com `@asteasolutions/zod-to-openapi`.

## Testes e CI

```bash
bun run lint
bunx --no-install tsc --noEmit
bun run test
bun run build
```

O workflow `.github/workflows/ci.yml` roda em Bun 1.4.4:

1. **Lint** — Biome
2. **Test** — TypeScript + Vitest
3. **Build** — build de produção
4. **Deploy** — Vercel em `main` (produção) e `beta` (preview)

## Estrutura do projeto

```
FM_Ecommerce/
├── app/
│   ├── (client)/        # Loja, conta, admin, API docs
│   ├── api/             # API Routes públicas
│   └── studio/          # Sanity Studio
├── components/          # UI, admin, dialogs, skeletons
├── core/                # Entidades e contratos
├── services/            # Casos de uso e repositórios
├── infra/               # Gateways Stripe e Melhor Envio
├── lib/                 # Schemas, OpenAPI, segurança, utils
├── sanity/              # Schemas, queries e configuração
├── scripts/             # Seed e manutenção de dados
├── tests/               # Vitest (unit + integration)
├── proxy.ts             # Middleware Clerk + CSRF + rate limit
└── next.config.ts
```

## Deploy

1. Importe o repositório na [Vercel](https://vercel.com/new).
2. Configure todas as variáveis de ambiente da tabela acima.
3. Cadastre o webhook do Stripe apontando para `https://SEU_DOMINIO/api/webhook`.
4. Faça push para `main` — o workflow valida lint, testes e build antes do deploy.

> [!TIP]
> Para testar webhooks localmente, exponha a porta 3000 com `ngrok http 3000` e use a URL gerada no dashboard do Stripe.
