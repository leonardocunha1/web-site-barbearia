# El Bigodon Barber Shop

Sistema completo de agendamento e gestao para barbearia, com painel administrativo, painel do profissional e area do cliente.

<!-- TODO: Adicionar screenshots aqui -->
<!-- ![Home](./docs/screenshots/home.png) -->
<!-- ![Agendamento](./docs/screenshots/booking.png) -->
<!-- ![Dashboard Admin](./docs/screenshots/admin.png) -->
<!-- ![Dashboard Profissional](./docs/screenshots/professional.png) -->
<!-- ![Dashboard Cliente](./docs/screenshots/client.png) -->

---

## Indice

- [Visao Geral](#visao-geral)
- [Tech Stack](#tech-stack)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Backend](#backend)
- [Frontend](#frontend)
- [Como Rodar](#como-rodar)
- [Variaveis de Ambiente](#variaveis-de-ambiente)
- [API - Endpoints](#api---endpoints)
- [Banco de Dados](#banco-de-dados)
- [Testes](#testes)
- [Screenshots](#screenshots)

---

## Visao Geral

Plataforma web para barbearia com tres perfis de usuario:

| Perfil | Acesso | O que faz |
|--------|--------|-----------|
| **Cliente** | `/cliente` | Agenda horarios, acompanha reservas, acumula pontos bonus |
| **Profissional** | `/painel/professional` | Gerencia agenda, horarios de funcionamento, feriados, ve metricas |
| **Admin** | `/painel/admin` | Gerencia profissionais, servicos, cupons, ve dashboard geral |

Visitantes (sem login) podem navegar na landing page e iniciar o agendamento. O login e exigido apenas na confirmacao.

---

## Tech Stack

### Backend

| Tecnologia | Uso |
|------------|-----|
| **Fastify 5** | Framework HTTP |
| **Prisma 6** | ORM + migrations |
| **PostgreSQL** | Banco de dados |
| **Zod** | Validacao de schemas |
| **JWT** | Autenticacao (access + refresh token) |
| **bcryptjs** | Hash de senhas |
| **SendGrid** | Envio de emails (verificacao, reset de senha) |
| **Vitest** | Testes unitarios e E2E |
| **Swagger** | Documentacao automatica da API |
| **Winston** | Logging |
| **Datadog** | APM e tracing (opcional) |
| **TypeScript** | Tipagem estatica |

### Frontend

| Tecnologia | Uso |
|------------|-----|
| **Next.js 15** | Framework React (App Router) |
| **React 19** | UI library |
| **Tailwind CSS 4** | Estilizacao |
| **shadcn/ui + Radix** | Componentes UI |
| **React Query v5** | Cache e estado do servidor |
| **Zustand** | Estado local (draft do agendamento) |
| **React Hook Form + Zod** | Formularios com validacao |
| **Orval** | Geracao automatica de hooks a partir do Swagger |
| **Framer Motion** | Animacoes |
| **Recharts** | Graficos |
| **React Leaflet** | Mapa interativo |
| **Swiper** | Carrossel de depoimentos |
| **Sonner** | Notificacoes toast |
| **TypeScript** | Tipagem estatica |

---

## Funcionalidades

### Agendamento (Booking)

- Wizard de 4 etapas: Profissional > Servicos > Horario > Resumo
- Selecao de multiplos servicos por agendamento
- Verificacao de disponibilidade em tempo real (time slots)
- Deteccao de feriados e dias indisponiveis
- Preview de preco antes de confirmar
- Suporte a cupons de desconto e pontos bonus
- Persistencia de rascunho (auto-save no localStorage)
- Prevencao de conflito de horarios (double-booking)
- Cancelamento automatico de reservas expiradas (cron job)

### Sistema de Bonus

- Dois tipos de pontos: `BOOKING_POINTS` e `LOYALTY`
- Acumulo automatico ao completar agendamentos
- Resgate como desconto monetario na reserva
- Valor por ponto configuravel
- Historico de transacoes (credito/debito)
- Expiracao opcional de pontos

### Cupons de Desconto

- Tipos: percentual, valor fixo ou gratis
- Escopo: global, por servico ou por profissional
- Expiracao por data, quantidade de uso ou ambos
- Valor minimo de reserva para aplicacao
- Nao acumula com pontos bonus (validacao no backend)
- Rastreamento de uso

### Horario de Funcionamento

- Configuracao por dia da semana (dom-sab)
- Horario de abertura, fechamento e intervalo (almoco)
- Ativacao/desativacao por dia
- Feriados e folgas com motivo

### Dashboards

**Admin:**
- Profissionais ativos, novos cadastros, agendamentos do dia
- Receita total, ticket medio, agendamentos concluidos
- Top profissionais e servicos
- Filtro por periodo (hoje, semana, mes, personalizado)
- CRUD de profissionais, servicos e cupons

**Profissional:**
- Total de agendamentos, ganhos do periodo, taxa de conclusao
- Pendentes de confirmacao, cancelamentos, ticket medio
- Top 5 servicos (com percentual)
- Proximos agendamentos
- Configuracao de perfil, horarios e feriados

**Cliente:**
- Proximo agendamento
- Total de visitas
- Saldo de pontos bonus (com valor monetario)
- Historico de reservas com filtros
- Cancelamento de reservas (minimo 2h de antecedencia)

### Autenticacao

- Login e registro com validacao
- JWT com access token + refresh token (httpOnly cookies)
- Refresh automatico no interceptor Axios
- Verificacao de email via SendGrid
- Reset de senha por email
- Protecao de rotas por role (middleware Next.js + Fastify)
- Rate limiting em endpoints sensiveis

### Landing Page

- Hero com animacao de rotacao de palavras
- Showcase de servicos em grid masonry
- Carrossel de depoimentos (Swiper)
- Mapa interativo com localizacao (Leaflet)
- Secao VIP com cards animados
- Marquee com frases
- Botao flutuante do WhatsApp
- Totalmente responsivo (mobile-first)

---

## Arquitetura

```
web-site-barbearia/
├── back/                    # API REST (Fastify + Prisma)
│   ├── prisma/              # Schema, migrations, seed
│   └── src/
│       ├── http/
│       │   ├── controllers/  # Rotas organizadas por dominio
│       │   └── middlewares/   # JWT, roles, tracing
│       ├── use-cases/        # Logica de negocio (Clean Architecture)
│       ├── repositories/     # Interface de acesso a dados
│       ├── services/         # Token, email
│       ├── schemas/          # Validacao Zod
│       ├── dtos/             # Data Transfer Objects
│       └── scripts/          # Cron jobs
│
├── front/                   # Next.js 15 (App Router)
│   └── src/
│       ├── app/              # Pages e layouts (rotas)
│       ├── features/         # Modulos por dominio
│       │   ├── auth/         # Login/registro
│       │   ├── bookings/     # Agendamento (wizard)
│       │   ├── dashboard/    # Paineis (admin, profissional, cliente)
│       │   └── marketing/    # Landing page
│       ├── shared/           # Componentes, hooks, utils reutilizaveis
│       ├── api/              # Hooks gerados (Orval) + Axios
│       ├── contexts/         # React Context (user, query)
│       └── middleware.ts     # Protecao de rotas (JWT + roles)
│
└── docs/                    # Documentacao adicional
```

### Padroes do Backend

- **Clean Architecture**: Use Cases isolam logica de negocio
- **Repository Pattern**: Abstrai acesso ao banco
- **Factory Pattern**: Injecao de dependencias nos use cases
- **Error Handling**: 50+ classes de erro customizadas com `AppError`
- **Validacao**: Zod em todas as entradas (body, params, query)

### Padroes do Frontend

- **Feature-Based Architecture**: Cada dominio e autocontido
- **Server State**: React Query (cache, invalidacao, refetch)
- **Client State**: Zustand com persistencia (localStorage)
- **API Layer**: Hooks gerados automaticamente pelo Orval a partir do Swagger
- **Type Safety**: TypeScript strict + tipos gerados do backend
- **Forms**: React Hook Form + Zod (mesmos schemas do backend)

---

## Backend

### Dominios

| Dominio | Descricao |
|---------|-----------|
| **Auth** | Login, registro, refresh token, logout |
| **Users** | Perfil, listagem, anonimizacao (LGPD), troca de senha |
| **Professionals** | CRUD, status, schedule publico, dashboard |
| **Services** | CRUD, categorias, tipos (CORTE, BARBA, SOBRANCELHA, ESTETICA) |
| **Service-Professional** | Vincular servico a profissional com preco e duracao proprios |
| **Bookings** | Criar, listar, cancelar, atualizar status, preview de preco |
| **Business Hours** | Horarios por dia da semana com intervalo |
| **Holidays** | Feriados e folgas por profissional |
| **Coupons** | CRUD, tipos, escopos, expiracao, toggle ativo |
| **Bonus** | Atribuir pontos, consultar saldo |
| **Admin** | Dashboard com metricas gerais |
| **Tokens** | Verificacao de email, forgot/reset password |

### Cron Jobs

| Script | Comando | Descricao |
|--------|---------|-----------|
| Cancelar expirados | `npm run cron:cancel-expired` | Cancela reservas PENDING com horario ja passado |

Recomendado rodar a cada 15-30 minutos.

---

## Frontend

### Rotas

| Rota | Acesso | Descricao |
|------|--------|-----------|
| `/` | Publico | Landing page |
| `/login` | Publico | Login e registro |
| `/agendar` | Publico* | Wizard de agendamento (*login exigido na confirmacao) |
| `/cliente` | CLIENT | Dashboard do cliente |
| `/painel/admin` | ADMIN | Dashboard admin - visao geral |
| `/painel/admin/professionals` | ADMIN | Gestao de profissionais |
| `/painel/admin/professionals/[id]` | ADMIN | Servicos do profissional |
| `/painel/admin/services` | ADMIN | Gestao de servicos |
| `/painel/admin/coupons` | ADMIN | Gestao de cupons |
| `/painel/professional` | PROFESSIONAL | Dashboard profissional |
| `/painel/professional/bookings` | PROFESSIONAL | Agendamentos do profissional |
| `/painel/professional/settings/profile` | PROFESSIONAL | Perfil e senha |
| `/painel/professional/settings/business-hours` | PROFESSIONAL | Horarios de funcionamento |
| `/painel/professional/settings/holidays` | PROFESSIONAL | Feriados e folgas |
| `/unauthorized` | Publico | Pagina de acesso negado |

### Geracao de API (Orval)

O frontend gera automaticamente hooks React Query e schemas Zod a partir do Swagger do backend:

```bash
cd front
npm run generate-api
```

Isso cria em `src/api/`:
- `react-query/` - Hooks tipados para todas as rotas
- `schemas/` - Interfaces TypeScript
- `zod/` - Schemas de validacao

---

## Como Rodar

### Pre-requisitos

- Node.js 18+
- PostgreSQL
- npm

### Backend

```bash
cd back

# Instalar dependencias
npm install

# Configurar variaveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Rodar migrations
npx prisma migrate dev

# (Opcional) Seed do banco
npm run seed

# Iniciar em dev
npm run start:dev
```

O servidor roda em `http://localhost:3333`.
Documentacao Swagger em `http://localhost:3333/docs`.

### Frontend

```bash
cd front

# Instalar dependencias
npm install

# Configurar variaveis de ambiente
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3333

# Gerar hooks da API (requer backend rodando)
npm run generate-api

# Iniciar em dev (Turbopack)
npm run dev
```

O app roda em `http://localhost:3000`.

---

## Variaveis de Ambiente

### Backend (`back/.env`)

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| `NODE_ENV` | Ambiente | `dev` |
| `PORT` | Porta do servidor | `3333` |
| `DATABASE_URL` | URL do PostgreSQL | `postgresql://user:pass@localhost:5432/barbearia` |
| `JWT_SECRET` | Chave secreta do JWT | `sua-chave-secreta` |
| `SENDGRID_API_KEY` | API key do SendGrid | `SG.xxx` |
| `EMAIL_FROM` | Email remetente | `noreply@elbigodons.com` |
| `APP_URL` | URL do frontend | `http://localhost:3000` |
| `CORS_ORIGIN` | Origens permitidas (separadas por virgula) | `http://localhost:3000` |

### Frontend (`front/.env.local`)

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL da API | `http://localhost:3333` |
| `JWT_SECRET` | Mesma chave do backend (para middleware) | `sua-chave-secreta` |

---

## API - Endpoints

### Auth

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/auth/register` | - | Registrar usuario |
| POST | `/auth/login` | - | Login (retorna tokens) |
| POST | `/auth/logout` | - | Logout (limpa cookies) |
| POST | `/auth/refresh-token` | Cookie | Renovar access token |

### Users

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| GET | `/users/me` | JWT | Perfil do usuario autenticado |
| PATCH | `/users/me` | JWT | Atualizar perfil |
| PATCH | `/users/update-password` | JWT | Trocar senha |
| GET | `/users` | ADMIN/PROFESSIONAL | Listar usuarios (paginado) |
| PATCH | `/users/:userId/anonymize` | ADMIN/CLIENT | Anonimizar dados (LGPD) |

### Tokens (Verificacao e Reset)

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| GET | `/users/verify-email` | - | Verificar email com token |
| POST | `/users/send-verification-email` | - | Enviar email de verificacao |
| POST | `/users/forgot-password` | - | Solicitar reset de senha |
| POST | `/users/reset-password` | - | Resetar senha com token |

### Professionals

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/professionals` | ADMIN | Criar profissional |
| PATCH | `/professionals/:id` | ADMIN/PROFESSIONAL | Atualizar profissional |
| PATCH | `/professionals/:id/status` | ADMIN | Ativar/desativar |
| GET | `/professionals` | - | Listar/buscar profissionais |
| GET | `/professionals/:id/schedule` | - | Agenda publica (time slots) |
| GET | `/me/professional/schedule` | PROFESSIONAL | Minha agenda |
| GET | `/me/professional/dashboard` | PROFESSIONAL | Meu dashboard |

### Services

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/services` | ADMIN | Criar servico |
| GET | `/services` | - | Listar servicos (paginado) |
| GET | `/services/:id` | - | Detalhes do servico |
| PUT | `/services/:id` | ADMIN | Atualizar servico |
| DELETE | `/services/:id` | ADMIN | Deletar servico |
| PATCH | `/services/:id/status` | ADMIN | Ativar/desativar |

### Service-Professional

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/professionals/:id/services` | ADMIN | Vincular servico ao profissional |
| DELETE | `/professionals/:id/services/:serviceId` | ADMIN | Desvincular servico |
| GET | `/professionals/:id/services` | - | Servicos do profissional |
| PUT | `/professionals/:id/services` | ADMIN | Atualizar preco/duracao |

### Bookings

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/bookings` | CLIENT/PROFESSIONAL | Criar reserva |
| POST | `/bookings/preview` | CLIENT/PROFESSIONAL | Preview de preco |
| GET | `/bookings/me` | CLIENT | Minhas reservas |
| GET | `/bookings/professional` | PROFESSIONAL | Reservas do profissional |
| GET | `/bookings/:id` | JWT | Detalhes da reserva |
| PATCH | `/bookings/:id/status` | PROFESSIONAL | Atualizar status |
| PATCH | `/bookings/:id/cancel` | CLIENT/PROFESSIONAL | Cancelar reserva |

### Business Hours

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/business-hours` | PROFESSIONAL | Criar horario |
| PUT | `/business-hours/:professionalId` | PROFESSIONAL | Atualizar horario |
| GET | `/business-hours/:professionalId` | - | Listar horarios |
| DELETE | `/business-hours/:id` | PROFESSIONAL | Deletar horario |

### Holidays

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/holidays` | PROFESSIONAL | Criar feriado/folga |
| GET | `/holidays` | JWT | Listar feriados |
| DELETE | `/holidays/:id` | PROFESSIONAL | Deletar feriado |

### Coupons

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/coupons` | ADMIN | Criar cupom |
| GET | `/coupons` | ADMIN | Listar cupons |
| GET | `/coupons/:id` | ADMIN | Detalhes do cupom |
| PUT | `/coupons/:id` | ADMIN | Atualizar cupom |
| DELETE | `/coupons/:id` | ADMIN | Deletar cupom |
| PATCH | `/coupons/:id/toggle-status` | ADMIN | Ativar/desativar |

### Bonus

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | `/bonus/assign` | PROFESSIONAL | Atribuir pontos |
| GET | `/bonus/balance` | JWT | Consultar saldo |

### Admin

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| GET | `/admin/dashboard` | ADMIN | Dashboard com metricas |

### Outros

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |

---

## Banco de Dados

### Modelos Principais

```
User ─────────── Professional ─── BusinessHours
  │                   │               Holiday
  │                   │
  │              ServiceProfessional ── Service
  │                   │
  └──── Booking ──── BookingItem
          │
          ├── BonusTransaction
          ├── BonusRedemption
          ├── CouponRedemption
          └── Coupon
```

### Enums

| Enum | Valores |
|------|---------|
| **Role** | `ADMIN`, `CLIENT`, `PROFESSIONAL` |
| **Status** | `PENDING`, `CONFIRMED`, `CANCELED`, `COMPLETED` |
| **ServiceType** | `CORTE`, `BARBA`, `SOBRANCELHA`, `ESTETICA` |
| **CouponType** | `PERCENTAGE`, `FIXED`, `FREE` |
| **CouponScope** | `GLOBAL`, `SERVICE`, `PROFESSIONAL` |
| **BonusType** | `BOOKING_POINTS`, `LOYALTY` |

### Modelos

| Modelo | Descricao |
|--------|-----------|
| **User** | Usuarios com role, email verificado, status ativo |
| **Professional** | Perfil profissional (1:1 com User), especialidade, bio |
| **Service** | Servicos oferecidos (tipo, categoria, status) |
| **ServiceProfessional** | Vinculo servico-profissional com preco e duracao proprios |
| **Booking** | Reserva com horario, status, valor, pontos usados, cupom |
| **BookingItem** | Itens da reserva (servico, preco, duracao) |
| **BusinessHours** | Horario de funcionamento por dia da semana |
| **Holiday** | Feriados e folgas por profissional |
| **Coupon** | Cupons de desconto com tipo, escopo e expiracao |
| **CouponRedemption** | Registro de uso de cupom |
| **UserBonus** | Saldo de pontos por usuario e tipo |
| **BonusTransaction** | Historico de credito/debito de pontos |
| **BonusRedemption** | Registro de resgate de pontos |
| **VerificationToken** | Tokens de verificacao de email |
| **PasswordResetToken** | Tokens de reset de senha |
| **Log** | Logs de auditoria |

---

## Testes

### Backend

```bash
cd back

# Testes unitarios (use cases)
npm test

# Testes unitarios em watch mode
npm run test:watch

# Testes E2E (controllers com banco real)
npm run test:e2e

# Cobertura
npm run test:coverage

# UI do Vitest
npm run test:ui
```

**Estrutura:**
- `src/use-cases/**/*.spec.ts` - Testes unitarios (logica de negocio)
- `src/http/controllers/**/*.spec.ts` - Testes E2E (integracao HTTP)
- Ambiente Prisma customizado para testes E2E (banco isolado)

### Frontend

```bash
cd front

# Lint
npm run lint

# Build (verifica erros de compilacao)
npm run build
```

---

## Screenshots

<!-- Adicione suas screenshots abaixo -->

### Landing Page
<!-- ![Hero](./docs/screenshots/hero.png) -->
<!-- ![Servicos](./docs/screenshots/services.png) -->
<!-- ![Depoimentos](./docs/screenshots/reviews.png) -->
<!-- ![Localizacao](./docs/screenshots/location.png) -->

### Agendamento
<!-- ![Step 1 - Profissional](./docs/screenshots/booking-step1.png) -->
<!-- ![Step 2 - Servicos](./docs/screenshots/booking-step2.png) -->
<!-- ![Step 3 - Horario](./docs/screenshots/booking-step3.png) -->
<!-- ![Step 4 - Resumo](./docs/screenshots/booking-step4.png) -->

### Dashboard Admin
<!-- ![Admin Overview](./docs/screenshots/admin-overview.png) -->
<!-- ![Admin Profissionais](./docs/screenshots/admin-professionals.png) -->
<!-- ![Admin Servicos](./docs/screenshots/admin-services.png) -->
<!-- ![Admin Cupons](./docs/screenshots/admin-coupons.png) -->

### Dashboard Profissional
<!-- ![Professional Overview](./docs/screenshots/professional-overview.png) -->
<!-- ![Professional Agendamentos](./docs/screenshots/professional-bookings.png) -->
<!-- ![Professional Configuracoes](./docs/screenshots/professional-settings.png) -->

### Dashboard Cliente
<!-- ![Cliente Dashboard](./docs/screenshots/client-dashboard.png) -->
<!-- ![Cliente Reservas](./docs/screenshots/client-bookings.png) -->

### Login
<!-- ![Login](./docs/screenshots/login.png) -->
<!-- ![Registro](./docs/screenshots/register.png) -->

---

## Licenca

Projeto privado.
