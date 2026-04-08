import { SearchCacheModel } from '../models/search-cache.model';

const CACHE_TTL_MS = 30 * 60 * 1000;

export type CacheKey = {
  query: string;
  limit: number;
  index: number;
};

export const getCachedPayload = async <T>(cacheKey: CacheKey): Promise<T | null> => {
  const cacheRecord = await SearchCacheModel.findOne(cacheKey).lean();

  if (!cacheRecord) {
    return null;
  }

  const cacheAgeMs = Date.now() - new Date(cacheRecord.fetchedAt).getTime();

  if (cacheAgeMs > CACHE_TTL_MS) {
    await SearchCacheModel.deleteOne(cacheKey);
    return null;
  }

  return cacheRecord.response as T;
};

export const setCachedPayload = async <T>(cacheKey: CacheKey, payload: T) => {
  await SearchCacheModel.findOneAndUpdate(
    cacheKey,
    {
      response: payload,
      fetchedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
};
