import { SearchCacheModel } from '../models/searchCache.model';
import { type CacheKey, getCachedPayload, setCachedPayload } from './cache.service';

jest.mock('../models/searchCache.model', () => ({
  SearchCacheModel: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

describe('cache.service', () => {
  const cacheKey: CacheKey = {
    query: 'artist-search:rihanna',
    limit: 25,
    index: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when cache entry does not exist', async () => {
    (SearchCacheModel.findOne as unknown as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const payload = await getCachedPayload(cacheKey);

    expect(payload).toBeNull();
    expect(SearchCacheModel.deleteOne).not.toHaveBeenCalled();
  });

  it('returns cached payload when entry is fresh', async () => {
    (SearchCacheModel.findOne as unknown as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        response: { data: [{ id: 13 }] },
        fetchedAt: new Date().toISOString(),
      }),
    });

    const payload = await getCachedPayload<{ data: Array<{ id: number }> }>(cacheKey);

    expect(payload).toEqual({ data: [{ id: 13 }] });
    expect(SearchCacheModel.deleteOne).not.toHaveBeenCalled();
  });

  it('invalidates stale cache entries after 30 minutes', async () => {
    (SearchCacheModel.findOne as unknown as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        response: { data: [] },
        fetchedAt: new Date(Date.now() - 31 * 60 * 1000).toISOString(),
      }),
    });

    const payload = await getCachedPayload(cacheKey);

    expect(payload).toBeNull();
    expect(SearchCacheModel.deleteOne).toHaveBeenCalledWith(cacheKey);
  });

  it('upserts payload when setting cache', async () => {
    await setCachedPayload(cacheKey, { data: [{ id: 27 }] });

    expect(SearchCacheModel.findOneAndUpdate).toHaveBeenCalledWith(
      cacheKey,
      {
        response: { data: [{ id: 27 }] },
        fetchedAt: expect.any(Date),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  });
});
