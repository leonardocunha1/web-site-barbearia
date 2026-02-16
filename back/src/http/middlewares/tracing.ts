import { FastifyRequest, FastifyReply } from 'fastify';
import tracer from '@/observability/tracer';

/**
 * Middleware para adicionar contexto de tracing em todas as requisições
 *
 * Este middleware enriquece os spans do Datadog com informações úteis:
 * - Usuário autenticado (se houver)
 * - Método e rota da requisição
 * - Query params (sem dados sensíveis)
 * - Informações do cliente (user-agent, IP)
 */
export async function tracingMiddleware(request: FastifyRequest, _: FastifyReply) {
  // Pegar o span ativo (criado automaticamente pelo Fastify)
  const span = tracer.scope().active();

  if (!span) {
    // Se não houver span, continua normalmente
    return;
  }

  // Tags básicas da requisição
  span.setTag('http.method', request.method);
  span.setTag('http.url', request.url);
  span.setTag('http.route', request.routeOptions?.url || 'unknown');

  // Informações do cliente
  span.setTag('http.client_ip', request.ip);
  span.setTag('http.user_agent', request.headers['user-agent'] || 'unknown');

  // Usuário autenticado (se existir)
  // O Fastify JWT injeta request.user após autenticação
  if (request.user && typeof request.user === 'object' && 'sub' in request.user) {
    span.setTag('user.id', request.user.sub);

    // Se tiver mais informações no token, adicione aqui
    if ('role' in request.user) {
      span.setTag('user.role', request.user.role);
    }
  }

  // Query params (cuidado com dados sensíveis!)
  const queryKeys = Object.keys(request.query || {});
  if (queryKeys.length > 0) {
    span.setTag('http.query_params.count', queryKeys.length);

    // Lista os nomes dos params (não os valores, por segurança)
    span.setTag('http.query_params.keys', queryKeys.join(','));
  }

  // Tamanho do body (se houver)
  if (request.body && typeof request.body === 'object') {
    const bodyKeys = Object.keys(request.body);
    span.setTag('http.body.keys_count', bodyKeys.length);
  }
}

/**
 * Middleware para adicionar status code da resposta ao span
 * Deve ser registrado com addHook('onResponse')
 */
export async function tracingResponseMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const span = tracer.scope().active();

  if (!span) {
    return;
  }

  // Adicionar status code da resposta
  span.setTag('http.status_code', reply.statusCode);

  // Marcar como erro se status >= 400
  if (reply.statusCode >= 400) {
    span.setTag('error', true);
    span.setTag('error.status_code', reply.statusCode);
  }
}
