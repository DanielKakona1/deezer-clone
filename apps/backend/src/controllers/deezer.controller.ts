import type { NextFunction, Request, Response } from 'express';

import {
  getArtistAlbums,
  getArtistById,
  getArtistTopTracks,
  searchArtists,
} from '../services/deezer.service';

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

const toArtistId = (value: string) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.floor(parsed);
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

    const payload = await searchArtists(query, limit, index);

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
