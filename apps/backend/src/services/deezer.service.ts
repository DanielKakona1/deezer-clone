import axios from 'axios';

import { env } from '../config/env';
import { type CacheKey, getCachedPayload, setCachedPayload } from './cache.service';

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

export const searchArtists = (query: string, limit: number, index: number) => {
  return getWithCache(
    {
      query: `artist-search:${query}`,
      limit,
      index,
    },
    '/search/artist',
    {
      q: query,
      limit,
      index,
    },
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
