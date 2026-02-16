# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar apenas arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências (incluindo dev para build)
RUN npm ci

# Gerar Prisma Client
RUN npx prisma generate

# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

# Copiar código fonte
COPY . .

# Build da aplicação TypeScript
RUN npm run build

# Stage 3: Runner (Produção)
FROM node:20-alpine AS runner

WORKDIR /app

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copiar apenas o necessário para produção
COPY --from=builder --chown=nodejs:nodejs /app/build ./build
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de início
CMD ["node", "build/server.js"]
