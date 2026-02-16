# Datadog APM - Quick Start

## ✅ O que já está configurado

### 1. Inicialização do Tracer

✅ `src/server.ts` - Tracer importado como primeiro módulo  
✅ `src/config/tracer.ts` - Configuração do dd-trace com logInjection  
✅ `src/config/logger.ts` - Winston configurado para JSON (formato Datadog)

### 2. Middlewares Globais

✅ `src/http/middlewares/tracing.ts` - Middlewares de tracing  
✅ Registrados em `src/app.ts` para todas as requisições HTTP

**O que os middlewares fazem:**

- Adicionam user.id aos spans (se autenticado)
- Adicionam método HTTP, rota, IP, user-agent
- Capturam status code da resposta
- Marcam erros automaticamente (status >= 400)

### 3. Instrumentação de Use Cases

✅ `src/use-cases/bookings/create-booking-use-case.ts` - Exemplo completo com:

- Span principal (`booking.create`)
- Sub-spans para cada operação importante
- Tags descritivas (user.id, valores, descontos)
- Métricas customizadas (booking.created, booking.final_price)
- Logs estruturados correlacionados com traces

### 4. Cron Jobs com Tracing

✅ `src/scripts/cancel-expired-bookings.ts` - Script de cron instrumentado com:

- Span principal do job
- Métricas de execução (duração, quantidade)
- Tratamento de erros
- Logs correlacionados

---

## 🚀 Como Usar no Seu Código

### Use Cases

```typescript
import tracer from 'dd-trace';
import logger from '@/config/logger';

export class MeuUseCase {
  async execute(data: any) {
    return tracer.trace('meu.use_case', async (span) => {
      // Tags de contexto
      span.setTag('user.id', data.userId);
      span.setTag('operation', 'criar_algo');

      try {
        // Sua lógica aqui
        const result = await this.fazerAlgo(data);

        // Tags de resultado
        span.setTag('result.id', result.id);
        span.setTag('result.status', result.status);

        // Métricas
        tracer.dogstatsd.increment('meu.use_case.executed', 1, {
          status: 'success',
        });

        // Log
        logger.info('Use case executed', {
          userId: data.userId,
          resultId: result.id,
        });

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';

        span.setTag('error', true);
        span.setTag('error.type', errorType);

        tracer.dogstatsd.increment('meu.use_case.executed', 1, {
          status: 'error',
          error_type: errorType,
        });

        logger.error('Use case failed', {
          error: errorMessage,
          errorType,
        });

        throw error;
      }
    });
  }
}
```

### Controllers

```typescript
import tracer from 'dd-trace';
import logger from '@/config/logger';

export async function meuController(request: FastifyRequest, reply: FastifyReply) {
  // O span já existe (criado pelo Fastify + nosso middleware)
  // Você pode apenas adicionar tags extras se quiser
  const span = tracer.scope().active();

  if (span) {
    span.setTag('custom.tag', 'valor');
  }

  try {
    const useCase = makeMeuUseCase();
    const result = await useCase.execute(request.body);

    return reply.status(200).send(result);
  } catch (error) {
    // O error handler do Fastify vai processar
    // O span já foi marcado como erro pelo middleware
    throw error;
  }
}
```

### Operações Assíncronas Complexas

```typescript
async function processarEmLote(items: Item[]) {
  return tracer.trace('processar.lote', async (span) => {
    span.setTag('items.count', items.length);

    const results = [];

    for (const item of items) {
      // Criar sub-span para cada item
      const result = await tracer.trace('processar.item', async (itemSpan) => {
        itemSpan.setTag('item.id', item.id);
        itemSpan.setTag('item.type', item.type);

        const processed = await processar(item);

        itemSpan.setTag('success', true);
        return processed;
      });

      results.push(result);
    }

    span.setTag('processed.count', results.length);
    return results;
  });
}
```

---

## 📊 Métricas Customizadas

### Tipos de Métricas

```typescript
import tracer from 'dd-trace';

// CONTADOR: incrementa um valor
tracer.dogstatsd.increment('agendamento.criado', 1, {
  status: 'success',
  tipo: 'normal',
});

// GAUGE: valor pontual
tracer.dogstatsd.gauge('agendamentos.pendentes', 42);
tracer.dogstatsd.gauge('valor.total', 150.5);

// HISTOGRAMA: distribuição de valores
tracer.dogstatsd.histogram('operacao.duracao', durationMs, {
  operation: 'criar-agendamento',
});
```

### Métricas de Negócio Recomendadas

```typescript
// Agendamentos
tracer.dogstatsd.increment('booking.created');
tracer.dogstatsd.increment('booking.canceled');
tracer.dogstatsd.increment('booking.confirmed');
tracer.dogstatsd.gauge('booking.total_value', valor);

// Usuários
tracer.dogstatsd.increment('user.registered');
tracer.dogstatsd.increment('user.login');

// Cupons
tracer.dogstatsd.increment('coupon.applied', 1, {
  coupon_type: coupon.type,
});
tracer.dogstatsd.gauge('coupon.discount_amount', discount);

// Performance
tracer.dogstatsd.histogram('use_case.duration', duration, {
  use_case: 'create-booking',
});
```

---

## 🏷️ Tags Recomendadas

### Tags Essenciais

```typescript
// Identificadores
span.setTag('user.id', userId);
span.setTag('resource.id', resourceId);

// Contexto de negócio
span.setTag('operation', 'create');
span.setTag('resource.type', 'booking');
span.setTag('status', 'pending');

// Valores importantes
span.setTag('amount', 100.5);
span.setTag('items.count', 3);

// Flags booleanas (sempre como string!)
span.setTag('is_first_time', isFirst ? 'true' : 'false');
span.setTag('has_discount', hasDiscount ? 'true' : 'false');
```

### ⚠️ NUNCA adicione:

- Senhas
- Tokens JWT
- Números de cartão
- Dados pessoais sensíveis (CPF, etc)

---

## 📝 Logs Correlacionados

```typescript
import logger from '@/config/logger';

// O Datadog injeta automaticamente trace_id e span_id nos logs!
logger.info('Operação realizada', {
  userId: '123',
  operacao: 'criar-agendamento',
  valor: 100.5,
});

// No Datadog, você pode:
// 1. Ver o log
// 2. Clicar em "View Trace" para ver o trace completo
// 3. Ver todos os logs relacionados ao mesmo trace
```

---

## 🔍 Visualizando no Datadog

### 1. APM → Traces

- Lista de todas as requisições/operações
- Filtre por serviço: `barbearia-api`
- Filtre por tag: `user.id:123`, `error:true`, etc
- Veja waterfall de cada operação

### 2. APM → Services

- Performance geral do serviço
- Endpoints mais lentos
- Taxa de erro por endpoint
- Latência P50, P75, P99

### 3. Metrics → Explorer

- Crie gráficos das suas métricas customizadas
- `booking.created` por status
- `booking.final_price` (média, soma)
- `cron.duration` (histograma)

### 4. Logs → Search

- Todos os logs do Winston
- Correlação com traces (clique em "View Trace")
- Filtre por campo: `userId:123`, `error:*`

---

## 🎯 Próximos Passos

### 1. Instrumentar outros Use Cases importantes

- [ ] AuthenticateUserUseCase
- [ ] ConfirmBookingUseCase
- [ ] CancelBookingUseCase
- [ ] RedeemBonusPointsUseCase

### 2. Adicionar métricas de negócio

```typescript
// Receita
tracer.dogstatsd.gauge('revenue.daily', dailyRevenue);

// Conversão
tracer.dogstatsd.increment('coupon.conversion', 1, {
  converted: 'true',
});

// Performance
tracer.dogstatsd.histogram('api.response_time', duration);
```

### 3. Criar Dashboards no Datadog

- Taxa de criação de agendamentos
- Valor médio de agendamento
- Taxa de uso de cupons
- Taxa de erro por endpoint

### 4. Configurar Alertas

- Taxa de erro > 5%
- Latência P99 > 3s
- Agendamentos pendentes > 100

### 5. Correlacionar com Frontend

Se você adicionar Datadog RUM no frontend:

```typescript
// Backend envia trace-id no header
reply.header('x-datadog-trace-id', span.context().toTraceId());

// Frontend envia no próximo request
fetch('/api/bookings', {
  headers: {
    'x-datadog-parent-id': traceId,
  },
});
```

---

## 📚 Recursos Úteis

- [Guia Prático Completo](./datadog-guia-pratico.md) - Exemplos detalhados
- [Datadog APM Docs](https://docs.datadoghq.com/tracing/)
- [dd-trace Node.js](https://datadoghq.dev/dd-trace-js/)
- [Custom Instrumentation](https://docs.datadoghq.com/tracing/custom_instrumentation/nodejs/)

---

## ✅ Checklist de Implementação

Para cada use case importante:

- [ ] Adicionar span principal com nome descritivo
- [ ] Tags de contexto (user.id, resource.id)
- [ ] Sub-spans para operações importantes
- [ ] Tags de resultado (valores, status)
- [ ] Métricas de sucesso/erro
- [ ] Tratamento de erro adequado
- [ ] Logs estruturados correlacionados
- [ ] Testar no Datadog APM

---

## 🐛 Troubleshooting

### Spans não aparecem no Datadog

- Verifique se o tracer foi importado primeiro em `server.ts`
- Verifique se o Datadog Agent está rodando: `docker-compose ps`
- Verifique logs do Agent: `docker-compose logs datadog-agent`

### Logs não correlacionam com traces

- Verifique se `logInjection: true` está em `tracer.ts`
- Verifique se o logger está em formato JSON

### Métricas não aparecem

- DogStatsD só aceita strings ou números em tags
- Converta booleanos: `has_coupon: coupon ? 'true' : 'false'`

### Performance ruim

- Não crie spans demais (evite spans para operações triviais)
- Use tags ao invés de criar spans separados
- Configure sample rate se necessário
