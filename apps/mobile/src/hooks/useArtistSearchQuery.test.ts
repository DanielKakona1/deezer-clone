import { renderHook } from '@testing-library/react-native';

import { useArtistSearchQuery } from './useArtistSearchQuery';

const mockUseInfiniteQuery = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: (...args: unknown[]) => mockUseInfiniteQuery(...args),
}));

jest.mock('@/services/artist.service', () => ({
  searchArtists: jest.fn(),
}));

describe('useArtistSearchQuery', () => {
  it('returns shouldSearch false for blank query', () => {
    mockUseInfiniteQuery.mockReturnValue({ data: undefined });

    const { result } = renderHook(() => useArtistSearchQuery('   '));

    expect(result.current.shouldSearch).toBe(false);
    expect(result.current.artists).toEqual([]);
  });

  it('flattens artists from paginated pages', () => {
    mockUseInfiniteQuery.mockReturnValue({
      data: {
        pages: [
          {
            data: [
              { id: 1, name: 'A' },
              { id: 2, name: 'B' },
            ],
          },
          { data: [{ id: 3, name: 'C' }] },
        ],
      },
    });

    const { result } = renderHook(() => useArtistSearchQuery('rihanna'));

    expect(result.current.shouldSearch).toBe(true);
    expect(result.current.artists).toHaveLength(3);
  });
});
