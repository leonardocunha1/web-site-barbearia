#!/usr/bin/env node

/**
 * Script para cancelar automaticamente agendamentos expirados.
 *
 * Busca todos os agendamentos com status PENDING cujo horário já passou
 * e os cancela automaticamente.
 *
 * Uso:
 *   npm run cron:cancel-expired
 *
 * Recomendado configurar no cron para rodar a cada 15-30 minutos:
 *   - A cada 15 minutos: 0,15,30,45 * * * * cd /path/to/project/back && npm run cron:cancel-expired
 *   - A cada 30 minutos: 0,30 * * * * cd /path/to/project/back && npm run cron:cancel-expired
 */

import 'dotenv/config';
import '../config/tracer'; // Importar tracer primeiro para rastrear operações
import tracer from '@/observability/tracer';
import logger from '@/observability/logger';
import { makeCancelExpiredBookingsUseCase } from '../use-cases/factories/make-cancel-expired-bookings-use-case';
import { prisma } from '../lib/prisma';

async function main() {
  return tracer.trace('cron.cancel_expired_bookings', async (span) => {
    span.setTag('job.name', 'cancel-expired-bookings');
    span.setTag('job.type', 'cron');

    const startTime = Date.now();

    logger.info('Starting cron job: cancel expired bookings');

    try {
      const useCase = makeCancelExpiredBookingsUseCase();
      const result = await useCase.execute();

      const duration = Date.now() - startTime;

      // Tags de resultado
      span.setTag('bookings.canceled', result.canceledCount);
      span.setTag('duration.ms', duration);
      span.setTag('status', 'success');

      // Métricas do Datadog
      tracer.dogstatsd.increment('cron.executed', 1, {
        job: 'cancel-expired-bookings',
        status: 'success',
      });

      tracer.dogstatsd.gauge('cron.bookings_canceled', result.canceledCount);
      tracer.dogstatsd.histogram('cron.duration', duration, {
        job: 'cancel-expired-bookings',
      });

      logger.info('Cron job completed successfully', {
        job: 'cancel-expired-bookings',
        canceledCount: result.canceledCount,
        durationMs: duration,
      });

      console.log(
        `[${new Date().toISOString()}] ✅ Concluído: ${result.canceledCount} agendamento(s) cancelado(s)`,
      );

      process.exit(0);
    } catch (error) {
      const duration = Date.now() - startTime;

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';

      // Tags de erro
      span.setTag('error', true);
      span.setTag('error.type', errorType);
      span.setTag('error.message', errorMessage);
      span.setTag('duration.ms', duration);
      span.setTag('status', 'error');

      // Métricas de erro
      tracer.dogstatsd.increment('cron.executed', 1, {
        job: 'cancel-expired-bookings',
        status: 'error',
        error_type: errorType,
      });

      logger.error('Cron job failed', {
        job: 'cancel-expired-bookings',
        error: errorMessage,
        errorType,
        durationMs: duration,
      });

      console.error(`[${new Date().toISOString()}] ❌ Erro ao cancelar agendamentos:`, error);

      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  });
}

main();
