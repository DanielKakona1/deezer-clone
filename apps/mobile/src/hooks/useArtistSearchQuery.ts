import { useMemo } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';

import { searchArtists } from '@/services/artist.service';

const PAGE_SIZE = 10;

export const useArtistSearchQuery = (query: string) => {
  const normalizedQuery = query.trim();
  const shouldSearch = normalizedQuery.length > 0;

  const queryResult = useInfiniteQuery({
    queryKey: ['artist-search', normalizedQuery],
    queryFn: ({ pageParam }) => {
      return searchArtists({
        q: normalizedQuery,
        limit: PAGE_SIZE,
        index: Number(pageParam),
      });
    },
    initialPageParam: 0,
    enabled: shouldSearch,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((total, page) => total + page.data.length, 0);

      if (loadedCount >= lastPage.total) {
        return undefined;
      }

      return loadedCount;
    },
  });

  const artists = useMemo(() => {
    return queryResult.data?.pages.flatMap((page) => page.data) ?? [];
  }, [queryResult.data]);

  return {
    ...queryResult,
    artists,
    shouldSearch,
  };
};
