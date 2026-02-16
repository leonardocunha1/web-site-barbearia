import tracer from 'dd-trace';

tracer.init({
  logInjection: true, // ESSENCIAL: injeta trace_id e span_id nos logs do Winston automaticamente
  env: process.env.DD_ENV || 'development',
  service: process.env.DD_SERVICE || 'barbearia-api',
  version: process.env.DD_VERSION || '1.0.0',
  hostname: process.env.DD_AGENT_HOST || 'localhost',
  port: Number(process.env.DD_TRACE_AGENT_PORT) || 8126,

  // Span sampling rules: mantém spans individuais quando o trace completo é descartado
  spanSamplingRules: [
    { service: 'barbearia-api', name: 'http.request', sampleRate: 1.0 },
    { service: 'barbearia-api', name: 'prisma.query', sampleRate: 1.0 },
    { service: 'barbearia-api', name: 'email.send', sampleRate: 1.0 },
  ],
});

/**
 * Configuração de Plugins para Reduzir Ruído
 *
 * MELHOR ABORDAGEM: Configure plugins individuais para desabilitar
 * spans de baixo valor ANTES de serem criados (mais eficiente).
 */

// Fastify: Desabilitar spans de middleware (reduz ruído de serialização)
tracer.use('fastify', {
  middleware: false, // Desabilita spans automáticos de middleware
  // Mantém instrumentação de requisições HTTP (importante)
});

// Prisma: Configurar medição apenas em queries importantes
tracer.use('prisma', {
  // Por padrão mantém todas as queries, mas podemos desabilitar se necessário:
  // enabled: true, // true = mantém instrumentação
  service: 'barbearia-db', // Nome do serviço para queries do Prisma
});

// HTTP: Filtrar requisições internas/health checks (opcional)
tracer.use('http', {
  blocklist: [
    '/health', // Não rastreia health checks
    '/metrics', // Não rastreia métricas internas
  ],
});

export default tracer;
