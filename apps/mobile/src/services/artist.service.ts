import { httpClient } from './httpClient';

import type { Artist, ArtistAlbum, ArtistTrack, DeezerListResponse } from '@/types/artist.types';

type SearchArtistsParams = {
  q: string;
  limit?: number;
  index?: number;
};

type GetArtistAlbumsParams = {
  artistId: number;
  limit?: number;
  index?: number;
};

export const searchArtists = async ({ q, limit = 10, index = 0 }: SearchArtistsParams) => {
  const response = await httpClient.get<DeezerListResponse<Artist>>('/deezer/search/artists', {
    params: {
      q,
      limit,
      index,
    },
  });

  return response.data;
};

export const getArtistById = async (artistId: number) => {
  const response = await httpClient.get<Artist>(`/deezer/artists/${artistId}`);

  return response.data;
};

export const getArtistTopTracks = async (artistId: number, limit = 5) => {
  const response = await httpClient.get<DeezerListResponse<ArtistTrack>>(
    `/deezer/artists/${artistId}/top-tracks`,
    {
      params: {
        limit,
      },
    },
  );

  return response.data;
};

export const getArtistAlbums = async ({ artistId, limit = 20, index = 0 }: GetArtistAlbumsParams) => {
  const response = await httpClient.get<DeezerListResponse<ArtistAlbum>>(
    `/deezer/artists/${artistId}/albums`,
    {
      params: {
        limit,
        index,
      },
    },
  );

  return response.data;
};
