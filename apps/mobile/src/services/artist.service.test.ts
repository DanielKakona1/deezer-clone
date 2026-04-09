import {
  getArtistAlbums,
  getArtistById,
  getArtistTopTracks,
  searchArtists,
} from './artist.service';
import { httpClient } from '@/services/httpClient';

jest.mock('@/services/httpClient', () => ({
  httpClient: {
    get: jest.fn(),
  },
}));

describe('artist.service', () => {
  it('calls search artists endpoint with params', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({ data: { data: [], total: 0 } });

    await searchArtists({ q: 'rihanna', limit: 10, index: 20 });

    expect(httpClient.get).toHaveBeenCalledWith('/deezer/search/artists', {
      params: {
        q: 'rihanna',
        limit: 10,
        index: 20,
      },
    });
  });

  it('calls artist by id endpoint', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({ data: { id: 13 } });

    await getArtistById(13);

    expect(httpClient.get).toHaveBeenCalledWith('/deezer/artists/13');
  });

  it('calls top tracks endpoint with limit', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

    await getArtistTopTracks(13, 5);

    expect(httpClient.get).toHaveBeenCalledWith('/deezer/artists/13/top-tracks', {
      params: {
        limit: 5,
      },
    });
  });

  it('calls albums endpoint with pagination params', async () => {
    (httpClient.get as jest.Mock).mockResolvedValue({ data: { data: [] } });

    await getArtistAlbums({ artistId: 13, limit: 20, index: 0 });

    expect(httpClient.get).toHaveBeenCalledWith('/deezer/artists/13/albums', {
      params: {
        limit: 20,
        index: 0,
      },
    });
  });
});
