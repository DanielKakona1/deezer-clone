import { SearchCacheModel } from '../models/search-cache.model';
import { logger } from '../utils/logger';

const CACHE_TTL_MS = 30 * 60 * 1000;

export type CacheKey = {
  query: string;
  limit: number;
  index: number;
};

export const getCachedPayload = async <T>(cacheKey: CacheKey): Promise<T | null> => {
  const cacheRecord = await SearchCacheModel.findOne(cacheKey).lean();

  if (!cacheRecord) {
    logger.info('Cache miss', { cacheKey });
    return null;
  }

  const cacheAgeMs = Date.now() - new Date(cacheRecord.fetchedAt).getTime();

  if (cacheAgeMs > CACHE_TTL_MS) {
    await SearchCacheModel.deleteOne(cacheKey);
    logger.info('Cache expired', { cacheKey, cacheAgeMs });
    return null;
  }

  logger.info('Cache hit', { cacheKey, cacheAgeMs });

  return cacheRecord.response as T;
};

export const setCachedPayload = async <T>(cacheKey: CacheKey, payload: T) => {
  await SearchCacheModel.findOneAndUpdate(
    cacheKey,
    {
      $set: {
        response: payload,
        fetchedAt: new Date(),
      },
      $setOnInsert: {
        query: cacheKey.query,
        limit: cacheKey.limit,
        index: cacheKey.index,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  logger.info('Cache stored', { cacheKey });
};
