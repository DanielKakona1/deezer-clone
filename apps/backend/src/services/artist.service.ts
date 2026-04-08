import axios from 'axios';

import { env } from '../config/env';
import { type CacheKey, getCachedPayload, setCachedPayload } from './cache.service';

export type DeezerSearchOptions = {
  strict?: 'on';
  order?: string;
};

const MIN_CACHEABLE_SEARCH_QUERY_LENGTH = 3;

const deezerClient = axios.create({
  baseURL: env.DEEZER_API_BASE_URL,
  timeout: 10_000,
});

const getWithCache = async <T>(cacheKey: CacheKey, path: string, params?: Record<string, unknown>) => {
  const cachedPayload = await getCachedPayload<T>(cacheKey);

  if (cachedPayload) {
    return cachedPayload;
  }

  const response = await deezerClient.get<T>(path, { params });
  await setCachedPayload(cacheKey, response.data);

  return response.data;
};

const getWithoutCache = async <T>(path: string, params?: Record<string, unknown>) => {
  const response = await deezerClient.get<T>(path, { params });

  return response.data;
};

const normalizeSearchQuery = (query: string) => {
  return query.trim().toLowerCase().replace(/\s+/g, ' ');
};

const buildSearchQueryKey = (
  prefix: string,
  query: string,
  options: DeezerSearchOptions | undefined,
) => {
  const strictValue = options?.strict ?? 'off';
  const orderValue = options?.order ?? 'none';

  return `${prefix}:${query}:strict=${strictValue}:order=${orderValue}`;
};

const getSearchParams = (
  query: string,
  limit: number,
  index: number,
  options: DeezerSearchOptions = {},
) => {
  return {
    q: query,
    limit,
    index,
    ...(options.strict ? { strict: options.strict } : {}),
    ...(options.order ? { order: options.order } : {}),
  };
};

export const searchTracks = (
  query: string,
  limit: number,
  index: number,
  options?: DeezerSearchOptions,
) => {
  const normalizedSearchQuery = normalizeSearchQuery(query);
  const searchParams = getSearchParams(query.trim(), limit, index, options);

  if (normalizedSearchQuery.length < MIN_CACHEABLE_SEARCH_QUERY_LENGTH) {
    return getWithoutCache('/search', searchParams);
  }

  return getWithCache(
    {
      query: buildSearchQueryKey('track-search', normalizedSearchQuery, options),
      limit,
      index,
    },
    '/search',
    searchParams,
  );
};

export const searchArtists = (
  query: string,
  limit: number,
  index: number,
  options?: DeezerSearchOptions,
) => {
  const normalizedSearchQuery = normalizeSearchQuery(query);
  const searchParams = getSearchParams(query.trim(), limit, index, options);

  if (normalizedSearchQuery.length < MIN_CACHEABLE_SEARCH_QUERY_LENGTH) {
    return getWithoutCache('/search/artist', searchParams);
  }

  return getWithCache(
    {
      query: buildSearchQueryKey('artist-search', normalizedSearchQuery, options),
      limit,
      index,
    },
    '/search/artist',
    searchParams,
  );
};

export const getArtistById = (artistId: number) => {
  return getWithCache(
    {
      query: `artist:${artistId}`,
      limit: 0,
      index: 0,
    },
    `/artist/${artistId}`,
  );
};

export const getArtistTopTracks = (artistId: number, limit: number) => {
  return getWithCache(
    {
      query: `artist-top:${artistId}`,
      limit,
      index: 0,
    },
    `/artist/${artistId}/top`,
    {
      limit,
    },
  );
};

export const getArtistAlbums = (artistId: number, limit: number, index: number) => {
  return getWithCache(
    {
      query: `artist-albums:${artistId}`,
      limit,
      index,
    },
    `/artist/${artistId}/albums`,
    {
      limit,
      index,
    },
  );
};
