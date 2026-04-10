# 🛒 FMShop - E-commerce Full Stack

> Projeto de e-commerce completo desenvolvido com Next.js, focado em performance, qualidade de código e melhores práticas modernas de desenvolvimento.

[![Deploy with Vercel](https://vercel.com/button)](https://fm-ecommerce-jade.vercel.app/)
[![CI/CD](https://github.com/anomalyco/fm-ecommerce/actions/workflows/ci.yml/badge.svg)](https://github.com/FelipeMeloGomes/FM_Ecommerce/actions)
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
| **next-themes**   | Sistema de tema dark/light             |

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

- **next-themes**: Sistema de tema dark/light
- **sonner**: Notificações toast
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

### 💖 Wishlist (Lista de Desejos)

- Adicionar/remover produtos favoritos
- Persistência híbrida: Sanity CMS para usuários logados (via Clerk)
- localStorage para usuários não logados
- Migração automática de localStorage para banco ao fazer login
- Server Actions para operações CRUD (getWishlist, addToWishlist, removeFromWishlist, resetWishlist)
- Schema `wishlistType` no Sanity com campo `clerkUserId` para identificar usuário

### 🛒 Carrinho de Compras

- Adicionar/remover produtos
- Controle de quantidade com validação de estoque
- Cálculo de subtotal e total
- Persistência local (localStorage via Zustand)
- Remoção de itens
- Skeleton de carregamento

### 💳 Checkout e Pagamentos

- Integração com Stripe Checkout
- Cálculo de frete por CEP
- Validação de endereço
- Geração de pedidos
- Webhook para confirmação de pagamento

### 🔍 Busca e Filtros

- Busca por nome de produto
- Busca com suporte a acentos (normalização Unicode)
- Filtros por categoria
- Filtros por marca
- Ordenação por preço
- Busca client-side em memória no painel administrativo

### 👤 Sistema de Autenticação

- Login/cadastro via Clerk
- Rotas protegidas (conta, pedidos, wishlist)
- Integração com perfil do Clerk
- Gestão de endereços

### 📦 Gerenciamento de Imagens

- Upload de imagens via Sanity
- Otimização automática de imagens
- Múltiplas imagens por produto
- **Uploader redimensionado** para melhor usabilidade no mobile
- Upload integrado no formulário de edição de avaliações

### 🧪 Testes Unitários (Vitest)

- Testes de API (category, brand, product endpoints)
- Mocks de writeClient (Sanity)
- Testes de use cases (criação, atualização, exclusão)
- Factories para criação de dados de teste
- Padrão AAA (Arrange, Act, Assert)
-Mocks de apiRequest e outros serviços

### ⚙️ CI/CD

- GitHub Actions para automação
- Lint e typecheck em Pull Requests
- Deploy automático para Vercel (branch main)
- Preview deployments para PRs

---

## 🎨 Sistema de Tema Dark/Light

### ThemeProvider e ThemeToggle

- Implementação com `next-themes` para alternância entre temas
- Suporte a tema do sistema (`enableSystem`)
- Componente `ThemeToggle` no header para troca manual
- Transições suaves entre temas

### Clerk com Tema Dark

- `ClerkThemeProvider` com appearance dinâmico
- Localização em português (`ptBR`)
- Aparência customizada para light e dark mode
- Cores alinhadas com o tema do site (#063c28 para primary)

### Tema Dark Minimalista

Paleta monocromática escura para interface premium:

- **Background:** `#09090b` (zinc-950)
- **Foreground:** `#fafafa` (zinc-50)
- **Accent:** `#3f3f46` (zinc-700)
- **Muted:** `#27272a` (zinc-800)
- **Border:** `#3f3f46` (zinc-700)
- **Scrollbar customizado** com tema escuro
- **Selection** com cor accent

---

## 📱 Menu Mobile

### SideMenu Refatorado

- Menu mobile com Accordion (shadcn/ui)
- Seções: Navegação, Minha Conta, Administração
- Botão de alternar tema integrado
- Backdrop com animação de opacity
- Suporte completo dark mode
- Ícones e links para todas as funcionalidades
- **Link para Categorias** adicionado ao menu mobile

---

## 🎯 Componentes de Produto

### ProductActions Refatorado

Componente de ações do produto refatorado seguindo React best practices:

- **Arquitetura modular:** Dialogs extraídos para `components/dialogs/`
- **Responsabilidade única:** Cada componente tem sua própria lógica
- **Separação do estado:** Cada dialog gerencia seu próprio estado

```
components/
├── ProductActions.tsx          # Botões e callbacks (82 linhas)
└── dialogs/
    ├── ShippingDialog.tsx      # Info de entrega/devolução
    └── SimilarProductsDialog.tsx # Produtos similares
```

### ShippingDialog

Dialog de informações de entrega e devolução:

- **Prazo de Entrega:** Informações sobre calculadora de frete
- **Política de Devolução:** 30 dias para solicitação
- **Reembolso:** Processamento em até 10 dias úteis
- `useTransition` para abertura não-bloqueante

### SimilarProductsDialog

Dialog de produtos similares por categoria:

- Busca produtos da mesma categoria via GROQ
- Exibe até 6 produtos similares ordenados por criação
- Card com imagem, nome, preço e status de estoque
- Skeleton de carregamento durante fetch
- `useEffect` para buscar dados apenas quando dialog abre
- `useCallback` para fetch otimizado

### Componentes de Preço e Estoque

**PriceView** e **StockBadge** otimizados:

- Layout responsivo para preço com desconto
- Badge de desconto visível
- Status de estoque com cores semânticas
- Cores alinhadas ao tema: `shop_dark_green`, `shop_orange`

---

## 🔧 Refatorações Recentes

### Busca e Paginação Client-Side (Admin)

- Migração de busca/paginação server-side para client-side
- Carregamento de todos os dados via `findAll()` no servidor
- Componentes `AdminSearch` e `AdminPagination` simplificados
- Busca com normalização de acentos (acha "cafe" ao digitar "café")
- Contador de resultados abaixo do campo de busca

### Performance de Componentes

- `useCallback` nos handlers para evitar recriação de funções
- `useMemo` para filtragem e paginação em memória
- `React.memo` no componente `AdminPagination` para evitar re-renders desnecessários
- Função `normalize()` para busca insensitive com acentos

### Componentes Skeleton

- Extração de componentes skeleton reutilizáveis em `components/skeletons/`
- Uso de shadcn/ui `Skeleton` para estados de carregamento
- Arquivos loading.tsx simplificados nas rotas
- Skeletons para: ProductCard, ProductGrid, DealHero, WishlistTable, Cart, Orders, Admin (products, brands, categories), Account Addresses

### Prevenção de Hydration Mismatch

- Adicionado `isMounted` guard em `AddToCartButton`
- Framer Motion configurado com `initial={false}` para evitar SSR mismatch
- Fallback button antes da hidratação

### ImageView com Navegação

Galeria de imagens do produto com navegação melhorada:

- **Setas de navegação:** Anterior/Próximo com `useTransition`
- **Indicadores (dots):** Navegação visual para cada imagem
- **Keyboard support:** Navegação por setas do teclado
- `useCallback` para handlers de navegação estáveis

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

## ⚡ Otimizações de Performance React

Este projeto segue as melhores práticas de performance do React conforme documentado na skill [Vercel React Best Practices](https://vercel.com/blog/react-best-practices), focando em otimizações de re-render e redução de work desnecessário.

### Event Handlers Estáveis (useCallback)

Todos os event handlers são extraídos em callbacks estáveis para evitar recriação de funções a cada render:

```tsx
// ❌ Evitado: função criada em cada render
<button onClick={() => handleDelete(id)}>

// ✅ Correto: callback estável via useCallback
const handleDeleteWrapper = useCallback(
  (id: string) => () => handleDelete(id),
  [handleDelete],
);

<button onClick={handleDeleteWrapper(id)}>
```

**Componentes otimizados:**
- Admin lists (brands, categories, products)
- Review components (ReviewForm, ReviewActions, ReviewImagesGallery)
- Cart components (CartItemsList, CartClient)
- Product components (ProductSideMenu, ProductQuestionDialog, ImageView, **ShippingDialog**, **SimilarProductsDialog**)
- OrdersComponent
- WishListProducts
- BrandProducts, CategoryProducts
- HomeTabBar, MobileMenu
- Multi-select, Pagination, AdminSearch, AdminBackButton
- ShareDialog, ShippingCalculator
- SideMenu

### Valores Derivados Memorizados (useMemo)

Valores computados a partir de estado são memorizados para evitar cálculos repetidos:

```tsx
// ❌ Evitado: recalcula em cada render
const filteredProducts = products.filter(/* ... */);

// ✅ Correto: só recalcula quando dependencies mudam
const filteredProducts = useMemo(() => {
  return products.filter(/* ... */);
}, [products, searchQuery]);
```

**Exemplos implementados:**
- `filteredProducts` em `FilterableProductList`
- `itemsMap` em `CartItemsList` (Map para O(1) lookups)
- `selectedOptions` em `MultiSelect`
- `subtotal`/`total` em `CartClient`

### Subscribe Direto ao Estado (Zustand)

Padrão: subscribe diretamente ao array de items em vez de funções getter:

```tsx
// ❌ Evitado: subscribe a função (não re-renderiza quando items mudam)
const getItemCount = useStore((state) => state.getItemCount);
const itemCount = getItemCount(productId);

// ✅ Correto: subscribe ao array items
const items = useStore((state) => state.items);
const itemCount = useMemo(() => {
  const item = items.find((i) => i.product._id === productId);
  return item ? item.quantity : 0;
}, [items, productId]);
```

**Componentes corrigidos:**
- `CartClient`: `items` → `subtotal`/`total` derivados com useMemo
- `QuantityButtons`: `items` → `itemCount` derivado
- `CartItemsList`: `storeItems` → `itemsMap` para lookups eficientes

### Updates Não-Bloqueantes (useTransition)

Operações que não precisam bloquear a UI usam `useTransition`:

```tsx
const [isPending, startTransition] = useTransition();

const handleFilterChange = (filter: string) => {
  startTransition(() => {
    setSelectedFilter(filter);
  });
};
```

**Usado em:**
- BrandProducts, CategoryProducts
- Shop (filtros)
- Todos os componentes com mudanças de estado assíncronas

### Componentes Puros (React.memo)

Componentes que recebem props imutáveis são memoizados:

```tsx
const CartItemsList = React.memo(({ items }: CartItemsListProps) => {
  // ...
});

CartItemsList.displayName = "CartItemsList";
```

**Componentes memoizados:**
- `CartItemsList`
- `AdminPagination`

### Padrões Aplicados

| Padrão | Arquivo | Descrição |
|--------|---------|-----------|
| `rerender-functional-setstate` | Store hooks | Callbacks estáveis para setState |
| `rerender-memo` | Vários | useMemo para valores derivados |
| `rerender-transitions` | Filtros | useTransition para updates não-urgentes |
| `rerender-move-effect-to-event` | Handlers | Event handlers em vez de useEffect |
| `rerender-dependencies` | Hooks | Dependencies primitivas em effects |

### Limpeza de Dependências

- Remoção de pacotes não utilizados: `react-hot-toast`, `react-icons`, `dayjs`
- Substituição de `react-icons` por `lucide-react`
- Substituição de `react-hot-toast` por `sonner`

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
│   ├── admin/          # Componentes administrativos
│   ├── dialogs/         # Dialogs modulares (Shipping, SimilarProducts)
│   ├── skeletons/       # Componentes skeleton
│   └── ui/             # Componentes shadcn/ui
│   └── ...
├── core/                # Interfaces e tipos (Domain Driven Design)
│   └── types/         # Tipos compartilhados (Pagination, etc.)
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
- **`components/admin/`** - Componentes específicos do admin (Pagination)
- **`components/dialogs/`** - Dialogs modulares (ShippingDialog, SimilarProductsDialog)
- **`components/ui/`** - Componentes shadcn/ui base
- **`components/skeletons/`** - Skeletons para estados de loading
- **`core/`** - Interfaces de domínio e tipos (DDD)
- **`core/types/`** - Tipos compartilhados (PaginatedResult, etc.)
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
