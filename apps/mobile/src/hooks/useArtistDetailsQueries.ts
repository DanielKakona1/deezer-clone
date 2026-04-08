import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { getArtistAlbums, getArtistById, getArtistTopTracks } from '@/services/artist.service';

export const useArtistDetailsQueries = (artistId: number) => {
  const isArtistIdValid = Number.isFinite(artistId) && artistId > 0;

  const artistQuery = useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => getArtistById(artistId),
    enabled: isArtistIdValid,
  });

  const topTracksQuery = useQuery({
    queryKey: ['artist-top-tracks', artistId],
    queryFn: () => getArtistTopTracks(artistId, 5),
    enabled: isArtistIdValid,
  });

  const albumsQuery = useQuery({
    queryKey: ['artist-albums', artistId],
    queryFn: () => getArtistAlbums({ artistId, limit: 20, index: 0 }),
    enabled: isArtistIdValid,
  });

  const isLoading =
    artistQuery.isLoading ||
    topTracksQuery.isLoading ||
    albumsQuery.isLoading;

  const isError = artistQuery.isError || topTracksQuery.isError || albumsQuery.isError;

  const refetchAll = async () => {
    await Promise.all([artistQuery.refetch(), topTracksQuery.refetch(), albumsQuery.refetch()]);
  };

  const topTracks = useMemo(() => {
    return topTracksQuery.data?.data ?? [];
  }, [topTracksQuery.data]);

  const albums = useMemo(() => {
    return albumsQuery.data?.data ?? [];
  }, [albumsQuery.data]);

  return {
    isArtistIdValid,
    artist: artistQuery.data,
    topTracks,
    albums,
    isLoading,
    isError,
    refetchAll,
  };
};
