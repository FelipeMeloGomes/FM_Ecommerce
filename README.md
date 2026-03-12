# 🛒 FMShop - E-commerce Full Stack

> Projeto de e-commerce completo desenvolvido com Next.js, focado em performance, qualidade de código e melhores práticas modernas de desenvolvimento.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anomalyco/fm-ecommerce)
[![CI/CD](https://github.com/anomalyco/fm-ecommerce/actions/workflows/ci.yml/badge.svg)](https://github.com/anomalyco/fm-ecommerce/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Descrição do Projeto

FMShop é um e-commerce completo desenvolvido para demonstrar habilidades avançadas como **desenvolvedor Full Stack**, com foco no ecossistema **Next.js App Router** e tecnologias modernas que aumentam produtividade, segurança e qualidade do código.

### Objetivos do Projeto

- Criar uma experiência de compra moderna e responsiva
- Demonstrar boas práticas de arquitetura de software
- Implementar integração com serviços externos (CMS, Pagamentos, Autenticação)
- Garantir qualidade com testes unitários e linting
- Configurar CI/CD automatizado com GitHub Actions

### Público-Alvo

- Desenvolvedores que desejam aprender Next.js e práticas modernas de e-commerce
- Profissionais que buscam referência de arquitetura Front-end
- Projetos de estudo e portfólio

---

## 🚀 Tecnologias Usadas

### Framework & Linguagem

| Tecnologia     | Versão | Descrição                      |
| -------------- | ------ | ------------------------------ |
| **Next.js**    | 16.x   | Framework React com App Router |
| **TypeScript** | 5.x    | Tipagem estática               |
| **React**      | 19.x   | Biblioteca de UI               |

### Estilização & UI

| Tecnologia        | Descrição                              |
| ----------------- | -------------------------------------- |
| **Tailwind CSS**  | Framework de CSS utilitário            |
| **shadcn/ui**     | Componentes acessíveis e customizáveis |
| **Framer Motion** | Animações declarativas                 |
| **Lucide React**  | Ícones                                 |

### Backend-as-a-Service

| Serviço        | Funcionalidade                                           |
| -------------- | -------------------------------------------------------- |
| **Sanity CMS** | Gerenciamento de conteúdo (produtos, categorias, marcas) |
| **Clerk**      | Autenticação e gerenciamento de usuários                 |
| **Stripe**     | Processamento de pagamentos                              |

### Desenvolvimento & Qualidade

| Ferramenta         | Funcionalidade                 |
| ------------------ | ------------------------------ |
| **Biome**          | Linting e formatação de código |
| **Vitest**         | Testes unitários               |
| **GitHub Actions** | CI/CD automatizado             |
| **Vercel**         | Deploy e preview deployments   |

### Outras Bibliotecas

- **react-hot-toast**: Notificações toast
- **zustand**: Gerenciamento de estado global (carrinho)
- **clsx** e **tailwind-merge**: Utilitários de classes

---

## ✨ Funcionalidades Implementadas

### 🛍️ Sistema de Produtos

- Catálogo de produtos dinâmico via Sanity CMS
- Páginas de produto com detalhes, imagens e especificações
- Sistema de variantes (new, hot, sale, gadget, etc.)
- Controle de estoque
- Produtos em promoção com desconto

### 📂 Categorias e Marcas

- Gerenciamento de categorias no CMS
- Sistema de marcas com logos e descrições
- Filtros por categoria e marca
- Páginas dedicadas por marca/categoria

### 🛒 Carrinho de Compras

- Adicionar/remover produtos
- Controle de quantidade com validação de estoque
- Cálculo de subtotal e total
- Persistência local (localStorage via Zustand)
- Remoção de itens

### 💳 Checkout e Pagamentos

- Integração com Stripe Checkout
- Cálculo de frete por CEP
- Validação de endereço
- Geração de pedidos
- Webhook para confirmação de pagamento

### 🔍 Busca e Filtros

- Busca por nome de produto
- Filtros por categoria
- Filtros por marca
- Ordenação por preço

### 👤 Sistema de Autenticação

- Login/cadastro via Clerk
- Rotas protegidas (conta, pedidos, wishlist)
- Integração com perfil do Clerk
- Gestão de endereços

### 📦 Gerenciamento de Imagens

- Upload de imagens via Sanity
- Otimização automática de imagens
- Múltiplas imagens por produto

### 🧪 Testes Unitários (Vitest)

- Testes de API (category endpoints)
- Mocks de writeClient (Sanity)
- Testes de use cases (criação, atualização, exclusão)
- Factories para criação de dados de teste
- Padrão AAA (Arrange, Act, Assert)

### ⚙️ CI/CD

- GitHub Actions para automação
- Lint e typecheck em Pull Requests
- Deploy automático para Vercel (branch main)
- Preview deployments para PRs

---

## 🔧 Refatorações Recentes

### Componentes Skeleton

- Extração de componentes skeleton reutilizáveis em `components/skeletons/`
- Uso de shadcn/ui `Skeleton` para estados de carregamento
- Arquivos loading.tsx simplificados nas rotas

### Prevenção de Hydration Mismatch

- Adicionado `isMounted` guard em `AddToCartButton`
- Framer Motion configurado com `initial={false}` para evitar SSR mismatch
- Fallback button antes da hidratação

### Next.js App Router

- Adicionado `loading.tsx` para streaming/Suspense
- Implementado `generateMetadata()` para SEO
- Migração de `useSearchParams()` para Server Components
- Adicionado cache strategy com `revalidate`

### Padronização de Código

- Biome configurado com regras de lint
- Correção automática de formatação
- Imports organizados automaticamente

---

## ⚙️ Configurações de Ambiente

### Variáveis Obrigatórias (.env)

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=seu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=seu_api_token

# Clerk (Autenticação)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_chave_publica
CLERK_SECRET_KEY=sua_chave_secreta
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Stripe (Pagamentos)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua_chave_publica
STRIPE_SECRET_KEY=sua_chave_secreta
STRIPE_WEBHOOK_SECRET=seu_webhook_secret

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Variáveis Opcionais

```env
# Vercel
VERCEL_URL=seu-projeto.vercel.app
```

---

## ▶️ Como Rodar o Projeto

### Pré-requisitos

- Node.js 20.x ou superior
- pnpm (ou npm/yarn/bun)
- Conta no Sanity CMS
- Conta no Clerk
- Conta no Stripe

### Instalação

```bash
# Clone o repositório
git clone https://github.com/anomalyco/fm-ecommerce.git
cd fm-ecommerce

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### Executar Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Acesse http://localhost:3000
```

### Comandos Disponíveis

| Comando              | Descrição                           |
| -------------------- | ----------------------------------- |
| `pnpm dev`           | Iniciar servidor de desenvolvimento |
| `pnpm build`         | Build de produção                   |
| `pnpm start`         | Iniciar servidor de produção        |
| `pnpm lint`          | Verificar lint                      |
| `pnpm lint:fix`      | Corrigir problemas de lint          |
| `pnpm test`          | Executar testes                     |
| `pnpm test:watch`    | Executar testes em modo watch       |
| `pnpm test:coverage` | Executar testes com coverage        |

### Seed de Dados

Para importar dados iniciais no Sanity:

```bash
pnpm dlx sanity@latest dataset import seed.tar.gz
```

---

## 📁 Estrutura de Pastas

```
fm-ecommerce/
├── .github/workflows/     # GitHub Actions CI/CD
├── app/                   # Next.js App Router
│   ├── (client)/         # Páginas públicas
│   │   ├── admin/       # Dashboard administrativo
│   │   ├── cart/        # Carrinho
│   │   ├── product/     # Página de produto
│   │   ├── category/    # Página de categoria
│   │   └── ...
│   └── api/             # API Routes
├── components/           # Componentes React
│   ├── skeletons/       # Componentes skeleton
│   ├── ui/             # Componentes shadcn/ui
│   └── ...
├── lib/                  # Utilitários e configurações
│   ├── sanity/          # Cliente e queries Sanity
│   └── ...
├── sanity/               # Schema do CMS
├── tests/                # Testes
│   ├── setup.ts        # Configuração de testes
│   └── unit/           # Testes unitários
└── ...
```

### Descrição dos Diretórios

- **`app/`** - Todas as rotas e páginas usando App Router
- **`components/`** - Componentes React reutilizáveis
- **`components/ui/`** - Componentes shadcn/ui base
- **`components/skeletons/`** - Skeletons para estados de loading
- **`lib/`** - Utilitários, clientes e configurações
- **`sanity/`** - Schemas do CMS (produtos, categorias, marcas)
- **`tests/`** - Testes unitários e configuração

---

## 🔄 Workflow CI/CD

### GitHub Actions

O projeto utiliza GitHub Actions para automatizar:

1. **Lint** - Verificação de código com Biome
2. **Test** - Execução de testes unitários
3. **Build** - Verificação de build

### Vercel Deploy

- Deploy automático ao fazer push para `main`
- Preview deployments para Pull Requests
- Proteções de ambiente configuradas

### Verificações Obrigatórias

Antes de fazer merge na branch `main`:

```bash
# Verificar lint
pnpm lint

# Executar testes
pnpm test

# Verificar build
pnpm build
```

---

## 🤝 Como Contribuir

1. **Fork** o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das alterações (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um **Pull Request**

### Padrão de Commits

Este projeto segue o padrão [Conventional Commits](https://conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige um bug
refactor: refatora código
chore: atualiza configurações
test: adiciona ou corrige testes
docs: atualiza documentação
```

### Boas Práticas

- Sempre rode `pnpm lint` antes de commit
- Execute os testes antes de abrir PR
- Mantenha o código coberto por testes quando possível
- Use TypeScript para novas implementações

---

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [Sanity](https://www.sanity.io/)
- [Clerk](https://clerk.com/)
- [Stripe](https://stripe.com/)
- [Vercel](https://vercel.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
