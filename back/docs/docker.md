# Docker - Guia de Uso

## Estrutura

- **Dockerfile**: Build otimizado multi-stage da aplicação
- **docker-compose.yml**: Orquestração completa (DB + API + Datadog)
- **.dockerignore**: Arquivos excluídos do build

## Build e Deploy

### 1. Build da imagem

```bash
# Build simples
docker build -t barbearia-api .

# Build com tag de versão
docker build -t barbearia-api:1.0.0 .

# Build sem cache (força rebuild completo)
docker build --no-cache -t barbearia-api .
```

### 2. Rodar com Docker Compose

```bash
# Subir todos os serviços (DB + API + Datadog)
docker-compose up -d

# Ver logs
docker-compose logs -f barber-api

# Parar tudo
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados do DB)
docker-compose down -v

# Rebuild da API e restart
docker-compose up -d --build barber-api
```

### 3. Rodar apenas o container da API

```bash
# Rodar a API (assumindo DB já rodando)
docker run -d \
  --name barber-api \
  -p 3333:3333 \
  -e DATABASE_URL="postgresql://user:pass@localhost:5432/db" \
  -e JWT_SECRET="seu-secret" \
  barbearia-api
```

## Migrations com Docker

### Rodar migrations

```bash
# Com docker-compose
docker-compose exec barber-api npx prisma migrate deploy

# Com container individual
docker exec barber-api npx prisma migrate deploy
```

### Seed do banco

```bash
docker-compose exec barber-api npm run seed
```

## Variáveis de Ambiente

Criar `.env` na raiz do projeto:

```env
# PostgreSQL
POSTGRESQL_USERNAME=postgres
POSTGRESQL_PASSWORD=senha123
POSTGRESQL_DATABASE=barbearia

# API
DATABASE_URL=postgresql://postgres:senha123@barber-db:5432/barbearia
JWT_SECRET=seu-jwt-secret-super-seguro

# Datadog (opcional)
DD_API_KEY=sua-chave-datadog
# IMPORTANTE: DD_SITE deve ser apenas o domínio, SEM https://
# Encontre sua região em: https://docs.datadoghq.com/getting_started/site/
# Exemplos: us5.datadoghq.com (US5), datadoghq.eu (EU), datadoghq.com (US1)
DD_SITE=us5.datadoghq.com
```

## Otimizações do Dockerfile

### Multi-stage Build

1. **Stage deps**: Instala dependências
2. **Stage builder**: Build TypeScript
3. **Stage runner**: Imagem final minimalista

### Benefícios

- ✅ Imagem final ~150MB (vs ~1GB sem multi-stage)
- ✅ Cache de dependências (build mais rápido)
- ✅ Usuário não-root (segurança)
- ✅ Health check integrado
- ✅ Prisma Client gerado automaticamente

## Comandos Úteis

### Ver tamanho das imagens

```bash
docker images barbearia-api
```

### Entrar no container

```bash
docker-compose exec barber-api sh
```

### Ver logs em tempo real

```bash
docker-compose logs -f --tail=100 barber-api
```

### Reiniciar apenas a API

```bash
docker-compose restart barber-api
```

### Verificar health check

```bash
docker inspect barber-api | grep -A 10 Health
```

## Troubleshooting

### Container não sobe

```bash
# Ver logs detalhados
docker-compose logs barber-api

# Ver último erro
docker-compose logs --tail=50 barber-api
```

### Migrations não aplicadas

```bash
# Aplicar manualmente
docker-compose exec barber-api npx prisma migrate deploy

# Verificar status
docker-compose exec barber-api npx prisma migrate status
```

### Rebuild completo

```bash
# Parar tudo, remover, e rebuildar
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Deploy em Produção

### Build para produção

```bash
docker build \
  --platform linux/amd64 \
  -t registry.example.com/barbearia-api:latest \
  .
```

### Push para registry

```bash
# Docker Hub
docker tag barbearia-api:latest seu-usuario/barbearia-api:latest
docker push seu-usuario/barbearia-api:latest

# AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag barbearia-api:latest <account>.dkr.ecr.us-east-1.amazonaws.com/barbearia-api:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/barbearia-api:latest
```

## CI/CD

### GitHub Actions (exemplo)

```yaml
name: Build and Push Docker

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v3
        with:
          context: ./back
          push: true
          tags: |
            user/barbearia-api:latest
            user/barbearia-api:${{ github.sha }}
```
