# API Backend - Barbearia

Backend da aplicação de agendamentos para barbearia desenvolvido com Fastify, Prisma e TypeScript.

## 🚀 Quick Start

### Instalação de Dependências

```bash
npm install
```

### Configuração do Banco de Dados

1. Configure o arquivo `.env` com a URL do banco de dados:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/barbearia"
```

2. Execute as migrações:

```bash
npx prisma migrate dev --name init
```

### 🌱 Populando com Dados Iniciais

Para popular o banco com dados de teste, execute o seed:

```bash
npm run seed
```

Isso irá criar:

- 1 Administrador
- 5 Clientes
- 3 Profissionais
- 6 Serviços
- 7 Relacionamentos Serviço-Profissional
- 6 Agendamentos
- 4 Cupons
- Horários de funcionamento
- Bônus de usuários

### 📝 Credenciais Padrão

**Administrador:**

- Email: `admin@barbearia.com`
- Senha: `Admin@123`

**Profissional:**

- Email: `pedro@barbearia.com`
- Senha: `Senha@123`

**Cliente:**

- Email: `joao@email.com`
- Senha: `Senha@123`

## 🏃 Rodando a Aplicação

### Modo Desenvolvimento

```bash
npm run start:dev
```

Servidor rodará em `http://localhost:3000`

### Modo Produção

```bash
npm run build
npm run start
```

## 🧪 Testes

### Testes Unitários

```bash
npm run test          # Executa uma vez
npm run test:watch   # Modo watch
```

### Testes E2E

```bash
npm run test:e2e           # Executa uma vez
npm run test:watch:e2e    # Modo watch
```

### Cobertura de Testes

```bash
npm run test:coverage
```

## 🔍 Linting

```bash
npm run lint
```

## 📚 Documentação da API

A documentação Swagger está disponível em:

```
http://localhost:3000/api/docs
```

## 📁 Estrutura do Projeto

```
src/
├── app.ts                 # Configuração da aplicação Fastify
├── server.ts             # Inicialização do servidor
├── @types/               # Tipos customizados
├── consts/               # Constantes
├── dtos/                 # Data Transfer Objects
├── env/                  # Configuração de variáveis de ambiente
├── http/
│   ├── controllers/      # Controladores das rotas
│   └── middlewares/      # Middlewares
├── lib/                  # Bibliotecas e utilidades
├── mock/                 # Mocks para testes
├── repositories/         # Padrão Repository
├── schemas/              # Schemas Zod
├── services/             # Serviços auxiliares
├── use-cases/            # Casos de uso da aplicação
└── utils/                # Funções utilitárias

prisma/
├── schema.prisma         # Schema do banco de dados
├── migrations/           # Histórico de migrações
└── seed.ts              # Script de seed

```

## 🗄️ Banco de Dados

### Schema

O banco está configurado com PostgreSQL e gerenciado via Prisma ORM.

### Principais Modelos

- **User**: Usuários do sistema (Admin, Cliente, Profissional)
- **Professional**: Perfil de profissionais
- **Service**: Serviços oferecidos
- **ServiceProfessional**: Relacionamento entre profissionais e serviços
- **Booking**: Agendamentos
- **BookingItem**: Itens de um agendamento
- **UserBonus**: Bônus de usuários
- **Coupon**: Cupons de desconto

## 🔧 Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/barbearia

# JWT
JWT_SECRET=seu_secret_jwt

# Email (SendGrid)
SENDGRID_API_KEY=sua_api_key

# API
PORT=3000
NODE_ENV=development
```

## 📝 Observações

- O seed limpa os dados anteriores antes de popular, portanto execute com cuidado em produção
- Todas as senhas de seed estão usando hash bcrypt com 6 rounds
- Os dados incluem agendamentos de exemplo em diferentes status (PENDING, CONFIRMED, COMPLETED, CANCELED)

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

ISC
