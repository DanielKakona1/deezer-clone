import type { NextFunction, Request, Response } from 'express';

import {
  getAlbums,
  getArtist,
  getArtistSearch,
  getArtistTop,
  getTrackSearch,
} from './artist.controller';
import {
  getArtistAlbums,
  getArtistById,
  getArtistTopTracks,
  searchArtists,
  searchTracks,
} from '../services/artist.service';

jest.mock('../services/artist.service', () => ({
  searchTracks: jest.fn(),
  searchArtists: jest.fn(),
  getArtistById: jest.fn(),
  getArtistTopTracks: jest.fn(),
  getArtistAlbums: jest.fn(),
}));

const createRes = () => {
  const status = jest.fn().mockReturnThis();
  const json = jest.fn().mockReturnThis();

  return { status, json } as unknown as Response;
};

describe('artist.controller', () => {
  const next = jest.fn() as NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when track search query is missing', async () => {
    const req = { query: {} } as unknown as Request;
    const res = createRes();

    await getTrackSearch(req, res, next);

    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(400);
  });

  it('forwards track search to service with parsed params and options', async () => {
    (searchTracks as jest.Mock).mockResolvedValue({ data: [], total: 0 });

    const req = {
      query: {
        q: 'eminem',
        limit: '10',
        index: '2',
        strict: 'on',
        order: 'track_asc',
      },
    } as unknown as Request;
    const res = createRes();

    await getTrackSearch(req, res, next);

    expect(searchTracks).toHaveBeenCalledWith('eminem', 10, 2, {
      strict: 'on',
      order: 'TRACK_ASC',
    });
    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(200);
  });

  it('returns 400 when artistId is invalid for details route', async () => {
    const req = { params: { artistId: 'abc' } } as unknown as Request;
    const res = createRes();

    await getArtist(req, res, next);

    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(400);
  });

  it('returns artist details payload', async () => {
    (getArtistById as jest.Mock).mockResolvedValue({ id: 13, name: 'Rihanna' });

    const req = { params: { artistId: '13' } } as unknown as Request;
    const res = createRes();

    await getArtist(req, res, next);

    expect(getArtistById).toHaveBeenCalledWith(13);
    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(200);
  });

  it('returns top tracks payload with parsed limit', async () => {
    (getArtistTopTracks as jest.Mock).mockResolvedValue({ data: [] });

    const req = { params: { artistId: '13' }, query: { limit: '5' } } as unknown as Request;
    const res = createRes();

    await getArtistTop(req, res, next);

    expect(getArtistTopTracks).toHaveBeenCalledWith(13, 5);
    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(200);
  });

  it('returns albums payload with parsed pagination', async () => {
    (getArtistAlbums as jest.Mock).mockResolvedValue({ data: [] });

    const req = {
      params: { artistId: '13' },
      query: { limit: '20', index: '3' },
    } as unknown as Request;
    const res = createRes();

    await getAlbums(req, res, next);

    expect(getArtistAlbums).toHaveBeenCalledWith(13, 20, 3);
    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(200);
  });

  it('normalizes artist search query forwarding', async () => {
    (searchArtists as jest.Mock).mockResolvedValue({ data: [], total: 0 });

    const req = { query: { q: '  DaFt   Punk  ' } } as unknown as Request;
    const res = createRes();

    await getArtistSearch(req, res, next);

    expect(searchArtists).toHaveBeenCalledWith('DaFt   Punk', 25, 0, {});
    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(200);
  });
});
