import tracer from '@/observability/tracer';
import logger from '@/observability/logger';
import type { UseCase } from '@/core/use-case';

type TagValue = string | number | boolean | null | undefined;

type Tags = Record<string, TagValue>;

const COMMON_KEYS = [
  'userId',
  'professionalId',
  'bookingId',
  'couponId',
  'serviceId',
  'role',
  'status',
  'page',
  'limit',
];

const normalizeTagValue = (value: TagValue): string | number | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return value;
};

const extractTagsFromObject = (obj: Record<string, unknown>): Tags => {
  const tags: Tags = {};
  for (const key of COMMON_KEYS) {
    if (key in obj) {
      tags[key] = obj[key] as TagValue;
    }
  }
  return tags;
};

const extractTagsFromArgs = (args: unknown[]): Tags => {
  if (args.length === 0) return {};
  const first = args[0];

  if (first && typeof first === 'object' && !Array.isArray(first)) {
    return extractTagsFromObject(first as Record<string, unknown>);
  }

  if (typeof first === 'string') {
    return { id: first };
  }

  return {};
};

const toMetricTags = (tags: Tags): Record<string, string | number> => {
  const normalized: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(tags)) {
    const safeValue = normalizeTagValue(value);
    if (safeValue !== undefined) {
      normalized[key] = safeValue;
    }
  }
  return normalized;
};

export class TracedUseCase<Req, Res> implements UseCase<Req, Res> {
  constructor(
    private name: string,
    private useCase: UseCase<Req, Res>,
  ) {}

  async execute(...args: Req extends unknown[] ? Req : [Req]): Promise<Res> {
    return tracer.trace(this.name, async (span) => {
      const baseTags = extractTagsFromArgs(args as unknown[]);
      for (const [key, value] of Object.entries(baseTags)) {
        const normalized = normalizeTagValue(value);
        if (normalized !== undefined) {
          span.setTag(key, normalized);
        }
      }

      try {
        const result = await this.useCase.execute(...(args as Req extends unknown[] ? Req : [Req]));

        tracer.dogstatsd.increment('usecase.executed', 1, {
          name: this.name,
          status: 'success',
          ...toMetricTags(baseTags),
        });

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorType = error instanceof Error ? error.constructor.name : 'UnknownError';

        span.setTag('error', true);
        span.setTag('error.type', errorType);

        tracer.dogstatsd.increment('usecase.executed', 1, {
          name: this.name,
          status: 'error',
          error_type: errorType,
          ...toMetricTags(baseTags),
        });

        logger.error('Use case failed', {
          name: this.name,
          error: errorMessage,
          errorType,
          ...baseTags,
        });

        throw error;
      }
    });
  }
}

export const traceUseCase = <Req, Res>(name: string, useCase: UseCase<Req, Res>) =>
  new TracedUseCase(name, useCase);
