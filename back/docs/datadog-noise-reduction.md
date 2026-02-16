# Datadog - Redução de Ruído em Traces

## 🎯 Abordagens Implementadas

### 1. Plugin-Level Configuration (✅ Implementado)

**Arquivo:** `src/config/tracer.ts`

Configuração de plugins individuais para **evitar a criação** de spans desnecessários:

```typescript
// Fastify: Desabilita spans de middleware (serialização)
tracer.use('fastify', {
  middleware: false, // Desabilita middleware spans
});

// HTTP: Filtra endpoints de infraestrutura
tracer.use('http', {
  blocklist: ['/health', '/metrics'],
});

// Prisma: Renomeia serviço para melhor organização
tracer.use('prisma', {
  service: 'barbearia-db',
});
```

**Quando usar:**

- ✅ **Sempre** - é a abordagem mais eficiente
- ✅ Você sabe quais plugins geram ruído
- ✅ Quer reduzir overhead no código

**Outras opções disponíveis:**

```typescript
// Desabilitar plugin completamente
tracer.use('dns', false); // Desliga instrumentação DNS

// Winston: Desabilitar se não usar correlação de logs
tracer.use('winston', false);

// FS: Desabilitar operações de sistema de arquivos
tracer.use('fs', false);
```

---

### 2. Agent-Side Filtering (💡 Opcional)

**Arquivo:** `docker-compose.yml`

Filtragem no Agent antes de enviar dados ao backend:

```yaml
datadog-agent:
  environment:
    # Rejeitar spans específicos por resource_name
    - DD_APM_FILTER_TAGS_REJECT=["resource_name:serialize","resource_name:count"]

    # Rejeitar spans por regex
    - DD_APM_FILTER_TAGS_REGEX_REJECT=["resource_name:.*\\.serialize.*"]

    # Aceitar apenas spans específicos (whitelist)
    - DD_APM_FILTER_TAGS_REQUIRE=["resource_name:http.request"]
```

**Quando usar:**

- ✅ Complementar ao plugin-level
- ✅ Filtrar spans de bibliotecas que você não controla
- ✅ Reduzir custos de ingestão

**Limitações:**

- ⚠️ Spans ainda são criados (overhead permanece)
- ⚠️ Economiza apenas banda e custo de armazenamento

---

### 3. Sampling Configuration

**Arquivo:** `src/config/tracer.ts`

Controla a taxa de amostragem de traces:

```typescript
tracer.init({
  // Amostragem global (50% dos traces)
  sampleRate: 0.5,

  // Regras de amostragem por serviço/rota
  samplingRules: [
    { service: 'barbearia-api', name: 'health', sampleRate: 0.1 }, // 10% health checks
    { service: 'barbearia-api', name: 'bookings.*', sampleRate: 1.0 }, // 100% bookings
  ],

  // Span sampling: preserva spans individuais quando trace é descartado
  spanSamplingRules: [{ service: 'barbearia-api', name: 'prisma.query', sampleRate: 1.0 }],
});
```

**Quando usar:**

- ✅ Alto volume de tráfego (centenas de req/s)
- ✅ Quer reduzir custos mantendo visibilidade
- ❌ **NÃO usar em dev/staging** - perde dados importantes

---

## 🔍 Plugins Disponíveis para Configuração

### Fastify

```typescript
tracer.use('fastify', {
  middleware: false, // ⭐ Recomendado: desabilita serialize spans
  hooks: false, // Desabilita instrumentação de hooks
  service: 'api-name', // Renomeia serviço
});
```

### Prisma

```typescript
tracer.use('prisma', {
  enabled: true,
  service: 'database-name', // ⭐ Recomendado: separa nos filtros
});
```

### HTTP/HTTPS

```typescript
tracer.use('http', {
  // Filtra URLs específicas
  blocklist: ['/health', '/metrics', /^\/internal\/.*/],

  // Apenas URLs permitidas (whitelist)
  allowlist: [/^\/api\/.*/],

  // Headers a incluir nos spans
  headers: ['user-agent', 'x-request-id'],

  // Validação customizada de status
  validateStatus: (code) => code < 500,
});
```

### Winston/Bunyan (Logs)

```typescript
tracer.use('winston', {
  enabled: true, // Mantém para correlação trace_id + logs
});

// OU desabilita se não usar correlação
tracer.use('winston', false);
```

### DNS

```typescript
tracer.use('dns', false); // ⭐ Recomendado: desabilita spans DNS
```

### FS (Sistema de Arquivos)

```typescript
tracer.use('fs', false); // ⭐ Recomendado: desabilita spans de I/O
```

---

## 📊 Comparativo de Abordagens

| Abordagem        | Overhead  | Custo Ingestão   | Facilidade | Quando Usar                         |
| ---------------- | --------- | ---------------- | ---------- | ----------------------------------- |
| **Plugin-Level** | ✅ Mínimo | ✅ Reduz         | ⚠️ Código  | Sempre - melhor performance         |
| **Agent-Side**   | ❌ Alto   | ✅ Reduz         | ✅ Config  | Complementar - bibliotecas externas |
| **Sampling**     | ⚠️ Médio  | ✅✅ Reduz muito | ✅ Config  | Alto volume - produção              |
| **UI-Side**      | ❌ Alto   | ❌ Não reduz     | ✅✅ Fácil | Apenas visualização                 |

---

## 🎯 Recomendação para Este Projeto

### Development/Staging

```typescript
// tracer.ts
tracer.use('fastify', { middleware: false });
tracer.use('http', { blocklist: ['/health'] });
tracer.use('dns', false);
tracer.use('fs', false);

// Sem sampling (100% dos traces)
```

### Production

```typescript
// tracer.ts
tracer.use('fastify', { middleware: false });
tracer.use('http', { blocklist: ['/health', '/metrics'] });
tracer.use('dns', false);
tracer.use('fs', false);

// Sampling inteligente
tracer.init({
  sampleRate: 1.0, // 100% inicial
  samplingRules: [
    { name: 'health', sampleRate: 0.05 }, // 5% health checks
    { name: 'bookings.*', sampleRate: 1.0 }, // 100% operações críticas
  ],
});
```

```yaml
# docker-compose.yml
datadog-agent:
  environment:
    # Filtrar apenas se necessário
    - DD_APM_FILTER_TAGS_REJECT=["resource_name:serialize"]
```

---

## 🔗 Referências

- [Datadog APM Configuration](https://docs.datadoghq.com/tracing/trace_collection/library_config/nodejs/)
- [Plugin Configuration](https://datadoghq.dev/dd-trace-js/interfaces/plugins.html)
- [Sampling Rules](https://docs.datadoghq.com/tracing/trace_pipeline/ingestion_mechanisms/)
