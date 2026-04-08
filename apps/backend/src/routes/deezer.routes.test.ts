import request from 'supertest';

import { app } from '../app';
import {
  getArtistAlbums,
  getArtistById,
  getArtistTopTracks,
  searchArtists,
} from '../services/deezer.service';

jest.mock('../services/deezer.service', () => ({
  searchArtists: jest.fn(),
  getArtistById: jest.fn(),
  getArtistTopTracks: jest.fn(),
  getArtistAlbums: jest.fn(),
}));

describe('Deezer routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when search q param is missing', async () => {
    const response = await request(app).get('/api/deezer/search/artists');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Query parameter q is required');
  });

  it('returns artist search payload using defaults', async () => {
    (searchArtists as unknown as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: 'Rihanna' }],
      total: 1,
    });

    const response = await request(app).get('/api/deezer/search/artists?q=rihanna');

    expect(response.status).toBe(200);
    expect(searchArtists).toHaveBeenCalledWith('rihanna', 25, 0);
    expect(response.body.data).toEqual([{ id: 1, name: 'Rihanna' }]);
  });

  it('returns artist details payload', async () => {
    (getArtistById as unknown as jest.Mock).mockResolvedValue({
      id: 13,
      name: 'Eminem',
    });

    const response = await request(app).get('/api/deezer/artists/13');

    expect(response.status).toBe(200);
    expect(getArtistById).toHaveBeenCalledWith(13);
    expect(response.body.name).toBe('Eminem');
  });

  it('returns artist top tracks payload', async () => {
    (getArtistTopTracks as unknown as jest.Mock).mockResolvedValue({
      data: [{ id: 101, title: 'Lose Yourself' }],
    });

    const response = await request(app).get('/api/deezer/artists/13/top-tracks?limit=5');

    expect(response.status).toBe(200);
    expect(getArtistTopTracks).toHaveBeenCalledWith(13, 5);
    expect(response.body.data).toHaveLength(1);
  });

  it('returns artist albums payload', async () => {
    (getArtistAlbums as unknown as jest.Mock).mockResolvedValue({
      data: [{ id: 202, title: 'The Marshall Mathers LP' }],
    });

    const response = await request(app).get('/api/deezer/artists/13/albums?limit=20&index=0');

    expect(response.status).toBe(200);
    expect(getArtistAlbums).toHaveBeenCalledWith(13, 20, 0);
    expect(response.body.data[0].id).toBe(202);
  });
});
