import { renderHook } from '@testing-library/react-native';

import { useArtistDetailsQueries } from './useArtistDetailsQueries';

const mockUseQuery = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));

jest.mock('@/services/artist.service', () => ({
  getArtistById: jest.fn(),
  getArtistTopTracks: jest.fn(),
  getArtistAlbums: jest.fn(),
}));

describe('useArtistDetailsQueries', () => {
  it('exposes loading and derived arrays', () => {
    mockUseQuery
      .mockReturnValueOnce({
        data: { id: 1, name: 'Rihanna' },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: jest.fn(),
      })
      .mockReturnValueOnce({
        data: { data: [{ id: 10, title: 'Track' }] },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: jest.fn(),
      })
      .mockReturnValueOnce({
        data: { data: [{ id: 20, title: 'Album' }] },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: jest.fn(),
      });

    const { result } = renderHook(() => useArtistDetailsQueries(13));

    expect(result.current.isArtistIdValid).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.topTracks).toHaveLength(1);
    expect(result.current.albums).toHaveLength(1);
  });

  it('marks refreshing when fetching after data exists', () => {
    mockUseQuery
      .mockReturnValueOnce({
        data: { id: 1, name: 'Rihanna' },
        isLoading: false,
        isFetching: true,
        isError: false,
        refetch: jest.fn(),
      })
      .mockReturnValueOnce({
        data: { data: [] },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: jest.fn(),
      })
      .mockReturnValueOnce({
        data: { data: [] },
        isLoading: false,
        isFetching: false,
        isError: false,
        refetch: jest.fn(),
      });

    const { result } = renderHook(() => useArtistDetailsQueries(13));

    expect(result.current.isRefreshing).toBe(true);
  });
});
