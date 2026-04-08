import type { NextFunction, Request, Response } from 'express';

import {
  type DeezerSearchOptions,
  getArtistAlbums,
  getArtistById,
  getArtistTopTracks,
  searchTracks,
  searchArtists,
} from '../services/artist.service';

const ALLOWED_ORDER_VALUES = new Set([
  'RANKING',
  'TRACK_ASC',
  'TRACK_DESC',
  'ARTIST_ASC',
  'ARTIST_DESC',
  'ALBUM_ASC',
  'ALBUM_DESC',
  'RATING_ASC',
  'RATING_DESC',
  'DURATION_ASC',
  'DURATION_DESC',
]);

const toPositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
};

const toStringValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const toStrict = (value: string | undefined) => {
  return value === 'on' ? 'on' : undefined;
};

const toOrder = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const normalized = value.toUpperCase();

  return ALLOWED_ORDER_VALUES.has(normalized) ? normalized : undefined;
};

const toArtistId = (value: string) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
};

const toSearchOptions = (req: Request): DeezerSearchOptions => {
  const strict = toStrict(toStringValue(req.query.strict as string | string[] | undefined));
  const order = toOrder(toStringValue(req.query.order as string | string[] | undefined));

  return {
    ...(strict ? { strict } : {}),
    ...(order ? { order } : {}),
  };
};

export const getTrackSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = String(req.query.q ?? '').trim();

    if (!query) {
      return res.status(400).json({
        message: 'Query parameter q is required',
      });
    }

    const limit = toPositiveInt(String(req.query.limit ?? ''), 25);
    const index = toPositiveInt(String(req.query.index ?? ''), 0);
    const payload = await searchTracks(query, limit, index, toSearchOptions(req));

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

export const getArtistSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = String(req.query.q ?? '').trim();

    if (!query) {
      return res.status(400).json({
        message: 'Query parameter q is required',
      });
    }

    const limit = toPositiveInt(String(req.query.limit ?? ''), 25);
    const index = toPositiveInt(String(req.query.index ?? ''), 0);

    const payload = await searchArtists(query, limit, index, toSearchOptions(req));

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

export const getArtist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistId = toArtistId(toStringValue(req.params.artistId) ?? '');

    if (!artistId) {
      return res.status(400).json({
        message: 'artistId must be a positive number',
      });
    }

    const payload = await getArtistById(artistId);

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

export const getArtistTop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistId = toArtistId(toStringValue(req.params.artistId) ?? '');

    if (!artistId) {
      return res.status(400).json({
        message: 'artistId must be a positive number',
      });
    }

    const limit = toPositiveInt(String(req.query.limit ?? ''), 5);
    const payload = await getArtistTopTracks(artistId, limit);

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};

export const getAlbums = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistId = toArtistId(toStringValue(req.params.artistId) ?? '');

    if (!artistId) {
      return res.status(400).json({
        message: 'artistId must be a positive number',
      });
    }

    const limit = toPositiveInt(String(req.query.limit ?? ''), 20);
    const index = toPositiveInt(String(req.query.index ?? ''), 0);
    const payload = await getArtistAlbums(artistId, limit, index);

    return res.status(200).json(payload);
  } catch (error) {
    return next(error);
  }
};
