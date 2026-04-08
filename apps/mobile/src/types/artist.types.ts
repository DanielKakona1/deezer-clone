export type Artist = {
  id: number;
  name: string;
  picture: string;
  picture_xl: string;
  nb_fan: number;
};

export type ArtistTrack = {
  id: number;
  title: string;
  title_short: string;
  duration: number;
  rank: number;
  preview: string;
};

export type ArtistAlbum = {
  id: number;
  title: string;
  cover: string;
  cover_medium: string;
  cover_big: string;
  release_date?: string;
};

export type DeezerListResponse<T> = {
  data: T[];
  total: number;
  next?: string;
};
