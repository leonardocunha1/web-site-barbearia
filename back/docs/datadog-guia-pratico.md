# Guia Prático: Usando Datadog APM e Tracing

## 📋 Índice

1. [Conceitos Básicos](#conceitos-básicos)
2. [Custom Spans](#custom-spans)
3. [Tags e Metadados](#tags-e-metadados)
4. [Rastreamento de Erros](#rastreamento-de-erros)
5. [Métricas Customizadas](#métricas-customizadas)
6. [Best Practices](#best-practices)
7. [Exemplos Práticos](#exemplos-práticos)

---

## 🎯 Conceitos Básicos

### O que o Datadog já rastreia automaticamente:

- ✅ Requisições HTTP (rotas Fastify)
- ✅ Queries do Prisma (SELECT, INSERT, UPDATE, DELETE)
- ✅ Chamadas externas (fetch, axios)
- ✅ Erros e exceções não tratados

### O que você deve adicionar manualmente:

- ⚙️ Lógica de negócio importante (use cases)
- ⚙️ Operações complexas (validações, cálculos)
- ⚙️ Integrações externas (email, pagamentos)
- ⚙️ Background jobs e cron tasks

---

## 🔍 Custom Spans

### Como funciona

Um **span** representa uma operação no seu código. Spans são organizados hierarquicamente:

```
Request HTTP (/bookings)
  └─ CreateBookingUseCase
      ├─ Validar data
      ├─ Buscar usuário
      ├─ Validar cupom
      └─ Criar agendamento
```

### Sintaxe Básica

```typescript
import tracer from 'dd-trace';

async function minhaFuncao() {
  // Criar um span manualmente
  const span = tracer.startSpan('minha.operacao');

  try {
    // Seu código aqui
    const resultado = await fazerAlgo();

    // Adicionar informações úteis
    span.setTag('user_id', userId);
    span.setTag('resultado', resultado);

    return resultado;
  } catch (error) {
    // Marcar o span como erro
    span.setTag('error', true);
    span.setTag('error.message', error.message);
    throw error;
  } finally {
    // SEMPRE finalizar o span
    span.finish();
  }
}
```

### Usando o wrapper automático

```typescript
async function minhaFuncao() {
  return tracer.trace('minha.operacao', async (span) => {
    // Seu código aqui
    span.setTag('user_id', userId);

    const resultado = await fazerAlgo();
    return resultado;
    // Span é finalizado automaticamente, mesmo com erro
  });
}
```

---

## 🏷️ Tags e Metadados

### Tags Recomendadas

```typescript
// ✅ Identificadores de entidade
span.setTag('user.id', userId);
span.setTag('booking.id', bookingId);
span.setTag('service.name', serviceName);

// ✅ Contexto de negócio
span.setTag('booking.status', 'PENDING');
span.setTag('payment.method', 'credit_card');
span.setTag('coupon.applied', true);

// ✅ Métricas de performance
span.setTag('services.count', services.length);
span.setTag('total.price', totalPrice);
span.setTag('discount.amount', discount);

// ✅ Flags e condições
span.setTag('is_first_booking', isFirstBooking);
span.setTag('has_bonus', useBonusPoints);
span.setTag('is_weekend', isWeekend);
```

### Tags de Erro

```typescript
catch (error) {
  span.setTag('error', true);
  span.setTag('error.type', error.constructor.name);
  span.setTag('error.message', error.message);

  if (error.stack) {
    span.setTag('error.stack', error.stack);
  }

  throw error;
}
```

---

## ❌ Rastreamento de Erros

### Integração com Logger

```typescript
import logger from '@/config/logger';

try {
  // operação
} catch (error) {
  logger.error('Erro ao criar agendamento', {
    error: error.message,
    userId,
    bookingId,
    // O Datadog injeta automaticamente trace_id e span_id
  });

  span.setTag('error', true);
  throw error;
}
```

### Erros Customizados

```typescript
import { ResourceNotFoundError } from './errors/resource-not-found';

async function buscarAgendamento(id: string) {
  return tracer.trace('booking.find', async (span) => {
    span.setTag('booking.id', id);

    const booking = await this.repository.findById(id);

    if (!booking) {
      span.setTag('error', true);
      span.setTag('error.type', 'ResourceNotFoundError');

      throw new ResourceNotFoundError('Agendamento não encontrado');
    }

    return booking;
  });
}
```

---

## 📊 Métricas Customizadas

### Contadores

```typescript
// Incrementar um contador
tracer.dogstatsd.increment('booking.created', 1, {
  status: 'success',
  service: 'create-booking',
});

// Exemplo: contar agendamentos por status
tracer.dogstatsd.increment('booking.status', 1, {
  status: booking.status,
  professional: professional.name,
});
```

### Medições (Gauges)

```typescript
// Registrar um valor específico
tracer.dogstatsd.gauge('booking.total_price', totalPrice);
tracer.dogstatsd.gauge('user.bonus_points', userBonus.points);
tracer.dogstatsd.gauge('booking.duration_minutes', durationMinutes);
```

### Histogramas (para distribuições)

```typescript
// Tempo de processamento
const startTime = Date.now();
// ... fazer operação
const duration = Date.now() - startTime;

tracer.dogstatsd.histogram('booking.processing_time', duration, {
  service: 'create-booking',
});
```

---

## ✨ Best Practices

### 1. Nomenclatura de Spans

```typescript
// ✅ BOM: descritivo e hierárquico
'booking.create';
'booking.validate.time_slot';
'booking.calculate.discount';
'user.bonus.redeem';

// ❌ RUIM: genérico ou inconsistente
'process';
'doStuff';
'handleRequest';
```

### 2. Granularidade

```typescript
// ✅ BOM: spans para operações importantes
async execute(request: BookingRequest) {
  return tracer.trace('booking.create', async (rootSpan) => {
    rootSpan.setTag('user.id', request.userId);

    // Sub-operação importante
    const validation = await tracer.trace('booking.validate', async (span) => {
      span.setTag('services.count', request.services.length);
      return this.validateBooking(request);
    });

    // Sub-operação importante
    const booking = await tracer.trace('booking.save', async () => {
      return this.bookingsRepository.create(data);
    });

    return booking;
  });
}

// ❌ RUIM: spans demais (poluição)
const a = await tracer.trace('add.numbers', () => x + y);
const b = await tracer.trace('check.if.true', () => !!value);
```

### 3. Informações Sensíveis

```typescript
// ❌ NUNCA faça isso
span.setTag('user.password', password);
span.setTag('credit_card', cardNumber);
span.setTag('jwt_token', token);

// ✅ Use IDs e referências
span.setTag('user.id', userId);
span.setTag('payment.method', 'credit_card'); // tipo, não número
span.setTag('auth.has_token', !!token); // boolean, não valor
```

### 4. Async/Await

```typescript
// ✅ BOM: usar o wrapper tracer.trace
async function processar() {
  return tracer.trace('processar', async (span) => {
    const resultado = await operacaoAssincrona();
    span.setTag('resultado', resultado);
    return resultado;
  });
}

// ❌ RUIM: esquecer de await pode perder o contexto
function processar() {
  return tracer.trace('processar', (span) => {
    operacaoAssincrona(); // esqueceu await!
    span.finish();
  });
}
```

---

## 💡 Exemplos Práticos

### Use Case Completo

```typescript
import tracer from 'dd-trace';
import logger from '@/config/logger';

export class CreateBookingUseCase {
  async execute(request: BookingRequest): Promise<Booking> {
    return tracer.trace('booking.create', async (rootSpan) => {
      // Tags de contexto
      rootSpan.setTag('user.id', request.userId);
      rootSpan.setTag('professional.id', request.professionalId);
      rootSpan.setTag('services.count', request.services.length);
      rootSpan.setTag('has_coupon', !!request.couponCode);
      rootSpan.setTag('use_bonus', !!request.useBonusPoints);

      try {
        // 1. Validações
        await tracer.trace('booking.validate.date', () => {
          this.validateDate(request.startDateTime);
        });

        // 2. Buscar entidades
        const user = await tracer.trace('booking.fetch.user', async (span) => {
          span.setTag('user.id', request.userId);
          const u = await this.usersRepository.findById(request.userId);
          if (!u) throw new UserNotFoundError();
          return u;
        });

        // 3. Validar cupom (se houver)
        let coupon = null;
        if (request.couponCode) {
          coupon = await tracer.trace('booking.validate.coupon', async (span) => {
            span.setTag('coupon.code', request.couponCode);
            const c = await this.couponRepository.findByCode(request.couponCode!);

            if (!c) {
              span.setTag('error', true);
              span.setTag('error.type', 'CouponNotFound');
              throw new InvalidCouponError();
            }

            span.setTag('coupon.id', c.id);
            span.setTag('coupon.valid', c.isValid);
            return c;
          });
        }

        // 4. Calcular preços
        const pricing = await tracer.trace('booking.calculate.pricing', async (span) => {
          const result = this.calculatePricing(services, coupon, bonusPoints);

          span.setTag('price.original', result.originalPrice);
          span.setTag('price.discount', result.discount);
          span.setTag('price.final', result.finalPrice);

          return result;
        });

        // 5. Criar agendamento
        const booking = await tracer.trace('booking.save', async (span) => {
          const b = await this.bookingsRepository.create({
            userId: request.userId,
            professionalId: request.professionalId,
            // ...
          });

          span.setTag('booking.id', b.id);
          span.setTag('booking.status', b.status);

          return b;
        });

        // Métricas de sucesso
        tracer.dogstatsd.increment('booking.created', 1, {
          status: 'success',
          has_coupon: !!coupon,
          has_bonus: !!request.useBonusPoints,
        });

        tracer.dogstatsd.gauge('booking.final_price', pricing.finalPrice);

        logger.info('Agendamento criado com sucesso', {
          bookingId: booking.id,
          userId: request.userId,
          professionalId: request.professionalId,
        });

        return booking;
      } catch (error) {
        // Tags de erro
        rootSpan.setTag('error', true);
        rootSpan.setTag('error.type', error.constructor.name);
        rootSpan.setTag('error.message', error.message);

        // Métrica de erro
        tracer.dogstatsd.increment('booking.created', 1, {
          status: 'error',
          error_type: error.constructor.name,
        });

        // Log estruturado
        logger.error('Erro ao criar agendamento', {
          error: error.message,
          errorType: error.constructor.name,
          userId: request.userId,
          professionalId: request.professionalId,
        });

        throw error;
      }
    });
  }
}
```

### Repository com Tracing

```typescript
import tracer from 'dd-trace';

export class PrismaBookingsRepository implements IBookingsRepository {
  async findById(id: string): Promise<Booking | null> {
    return tracer.trace('repository.booking.find_by_id', async (span) => {
      span.setTag('booking.id', id);
      span.setTag('resource.name', 'booking');
      span.setTag('operation', 'read');

      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          user: true,
          professional: true,
          services: true,
        },
      });

      span.setTag('found', !!booking);
      return booking;
    });
  }

  async create(data: CreateBookingData): Promise<Booking> {
    return tracer.trace('repository.booking.create', async (span) => {
      span.setTag('resource.name', 'booking');
      span.setTag('operation', 'create');
      span.setTag('user.id', data.userId);
      span.setTag('professional.id', data.professionalId);

      const booking = await prisma.booking.create({
        data,
        include: {
          user: true,
          professional: true,
        },
      });

      span.setTag('booking.id', booking.id);
      return booking;
    });
  }
}
```

### Controller com Tratamento de Erro

```typescript
import tracer from 'dd-trace';
import logger from '@/config/logger';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function createBooking(
  request: FastifyRequest<{ Body: CreateBookingBody }>,
  reply: FastifyReply,
) {
  // O Fastify já cria um span para a rota automaticamente
  const span = tracer.scope().active();

  if (span) {
    // Adicionar contexto do usuário autenticado
    span.setTag('user.id', request.user.sub);
    span.setTag('request.path', request.url);
    span.setTag('request.method', request.method);
  }

  try {
    const useCase = makeCreateBookingUseCase();

    const booking = await useCase.execute({
      userId: request.user.sub,
      ...request.body,
    });

    logger.info('Booking created via API', {
      bookingId: booking.id,
      userId: request.user.sub,
    });

    return reply.status(201).send(booking);
  } catch (error) {
    if (span) {
      span.setTag('error', true);
      span.setTag('error.type', error.constructor.name);
    }

    logger.error('Error in createBooking controller', {
      error: error.message,
      userId: request.user.sub,
      body: request.body,
    });

    throw error; // O error handler do Fastify vai processar
  }
}
```

### Cron Job com Tracing

```typescript
import tracer from 'dd-trace';
import logger from '@/config/logger';

async function cancelExpiredBookings() {
  return tracer.trace('cron.cancel_expired_bookings', async (span) => {
    span.setTag('job.name', 'cancel-expired-bookings');
    span.setTag('job.type', 'cron');

    const startTime = Date.now();

    try {
      const useCase = makeCancelExpiredBookingsUseCase();
      const result = await useCase.execute();

      const duration = Date.now() - startTime;

      // Tags de resultado
      span.setTag('bookings.canceled', result.canceledCount);
      span.setTag('duration.ms', duration);

      // Métricas
      tracer.dogstatsd.increment('cron.executed', 1, {
        job: 'cancel-expired-bookings',
        status: 'success',
      });

      tracer.dogstatsd.gauge('cron.bookings_canceled', result.canceledCount);
      tracer.dogstatsd.histogram('cron.duration', duration, {
        job: 'cancel-expired-bookings',
      });

      logger.info('Cron job executed successfully', {
        job: 'cancel-expired-bookings',
        canceledCount: result.canceledCount,
        durationMs: duration,
      });

      return result;
    } catch (error) {
      span.setTag('error', true);
      span.setTag('error.message', error.message);

      tracer.dogstatsd.increment('cron.executed', 1, {
        job: 'cancel-expired-bookings',
        status: 'error',
      });

      logger.error('Cron job failed', {
        job: 'cancel-expired-bookings',
        error: error.message,
      });

      throw error;
    }
  });
}

// Executar
cancelExpiredBookings()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
```

---

## 🎯 Quando Adicionar Tracing Manual?

### ✅ Sempre adicione para:

- Use cases importantes (criar agendamento, pagamento, autenticação)
- Operações com lógica de negócio complexa
- Integrações externas (APIs, email, SMS)
- Cálculos importantes (preços, descontos, pontos)
- Validações críticas
- Background jobs e cron tasks

### ⚠️ Evite adicionar para:

- Operações triviais (getters, setters)
- Validações simples (IF básicos)
- Transformações simples de dados
- Loops pequenos
- Utilitários genéricos

---

## 📈 Visualizando no Datadog

### APM → Traces

1. Acesse **APM → Traces** no Datadog
2. Filtre por serviço: `barbearia-api`
3. Veja a lista de traces (cada requisição HTTP)
4. Clique em um trace para ver:
   - Todas as operações (spans)
   - Duração de cada operação
   - Tags customizadas
   - Logs relacionados (com mesmo trace_id)

### APM → Services

- Performance geral do serviço
- Endpoints mais lentos
- Taxa de erro por endpoint
- Throughput (requisições/segundo)

### Metrics → Explorer

- Suas métricas customizadas: `booking.created`, `booking.final_price`
- Crie dashboards customizados
- Configure alertas

### Logs → Search

- Todos os logs do Winston
- Correlação automática com traces (trace_id nos logs)
- Filtre por erro, userId, bookingId, etc.

---

## 🚀 Próximos Passos

1. **Instrumentar use cases principais**:

   - CreateBookingUseCase ✓
   - AuthenticateUserUseCase
   - ProcessPaymentUseCase
   - SendEmailUseCase

2. **Adicionar métricas de negócio**:

   ```typescript
   tracer.dogstatsd.increment('user.registered', 1);
   tracer.dogstatsd.increment('revenue.total', booking.finalPrice);
   tracer.dogstatsd.gauge('bookings.pending', pendingCount);
   ```

3. **Criar dashboards no Datadog**:

   - Agendamentos por dia/hora
   - Taxa de conversão de cupons
   - Tempo médio de resposta por endpoint
   - Taxa de erro por tipo

4. **Configurar alertas**:
   - Taxa de erro > 5%
   - Tempo de resposta > 3s
   - Fila de agendamentos muito grande

---

## 📚 Links Úteis

- [Datadog APM Docs](https://docs.datadoghq.com/tracing/)
- [dd-trace Node.js](https://datadoghq.dev/dd-trace-js/)
- [Custom Instrumentation](https://docs.datadoghq.com/tracing/custom_instrumentation/nodejs/)
- [DogStatsD Metrics](https://docs.datadoghq.com/developers/dogstatsd/)
