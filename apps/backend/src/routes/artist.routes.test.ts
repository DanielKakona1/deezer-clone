import request from 'supertest';

import { app } from '../app';
import {
  getArtistAlbums,
  getArtistById,
  getArtistTopTracks,
  searchTracks,
  searchArtists,
} from '../services/artist.service';

jest.mock('../services/artist.service', () => ({
  searchTracks: jest.fn(),
  searchArtists: jest.fn(),
  getArtistById: jest.fn(),
  getArtistTopTracks: jest.fn(),
  getArtistAlbums: jest.fn(),
}));

describe('Artist routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when search q param is missing', async () => {
    const response = await request(app).get('/api/deezer/search/artists');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Query parameter q is required');
  });

  it('returns 400 when generic track search q param is missing', async () => {
    const response = await request(app).get('/api/deezer/search');

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Query parameter q is required');
  });

  it('returns track search payload and forwards strict/order', async () => {
    (searchTracks as unknown as jest.Mock).mockResolvedValue({
      data: [{ id: 501, title: 'Mockingbird' }],
      total: 1,
    });

    const response = await request(app).get(
      '/api/deezer/search?q=eminem&strict=on&order=TRACK_ASC&limit=10&index=2',
    );

    expect(response.status).toBe(200);
    expect(searchTracks).toHaveBeenCalledWith('eminem', 10, 2, {
      strict: 'on',
      order: 'TRACK_ASC',
    });
    expect(response.body.data[0].title).toBe('Mockingbird');
  });

  it('returns artist search payload using defaults', async () => {
    (searchArtists as unknown as jest.Mock).mockResolvedValue({
      data: [{ id: 1, name: 'Rihanna' }],
      total: 1,
    });

    const response = await request(app).get('/api/deezer/search/artists?q=rihanna');

    expect(response.status).toBe(200);
    expect(searchArtists).toHaveBeenCalledWith('rihanna', 25, 0, {});
    expect(response.body.data).toEqual([{ id: 1, name: 'Rihanna' }]);
  });

  it('forwards valid strict/order options for artist search', async () => {
    (searchArtists as unknown as jest.Mock).mockResolvedValue({
      data: [{ id: 7, name: 'Aloe Blacc' }],
      total: 1,
    });

    const response = await request(app).get(
      '/api/deezer/search/artists?q=aloe%20blacc&strict=on&order=ARTIST_ASC',
    );

    expect(response.status).toBe(200);
    expect(searchArtists).toHaveBeenCalledWith('aloe blacc', 25, 0, {
      strict: 'on',
      order: 'ARTIST_ASC',
    });
  });

  it('normalizes artist search query before forwarding to service', async () => {
    (searchArtists as unknown as jest.Mock).mockResolvedValue({
      data: [{ id: 15, name: 'Daft Punk' }],
      total: 1,
    });

    const response = await request(app).get(
      '/api/deezer/search/artists?q=%20%20DaFt%20%20Punk%20%20',
    );

    expect(response.status).toBe(200);
    expect(searchArtists).toHaveBeenCalledWith('DaFt  Punk', 25, 0, {});
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
