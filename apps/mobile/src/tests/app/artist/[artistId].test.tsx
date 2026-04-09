import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider } from 'styled-components/native';

import ArtistDetailsScreen from '@/app/artist/[artistId]';
import { useArtistDetailsQueries } from '@/hooks/useArtistDetailsQueries';
import { theme } from '@/styles/theme';

const mockBack = jest.fn();

jest.mock('expo-image', () => {
  const { Image } = jest.requireActual('react-native');
  return { Image };
});

jest.mock('expo-router', () => ({
  router: {
    back: mockBack,
  },
  useLocalSearchParams: () => ({ artistId: '13' }),
}));

jest.mock('@/hooks/useArtistDetailsQueries', () => ({
  useArtistDetailsQueries: jest.fn(),
}));

describe('ArtistDetailsScreen', () => {
  it('renders invalid state when artist id is invalid', () => {
    (useArtistDetailsQueries as jest.Mock).mockReturnValue({
      isArtistIdValid: false,
      artist: null,
      topTracks: [],
      albums: [],
      isLoading: false,
      isRefreshing: false,
      isError: false,
      refetchAll: jest.fn(),
    });

    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <ArtistDetailsScreen />
      </ThemeProvider>,
    );

    expect(getByText('Invalid artist.')).toBeTruthy();
  });

  it('renders error state and retries on button press', () => {
    const refetchAll = jest.fn();

    (useArtistDetailsQueries as jest.Mock).mockReturnValue({
      isArtistIdValid: true,
      artist: null,
      topTracks: [],
      albums: [],
      isLoading: false,
      isRefreshing: false,
      isError: true,
      refetchAll,
    });

    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <ArtistDetailsScreen />
      </ThemeProvider>,
    );

    fireEvent.press(getByText('Retry'));
    expect(refetchAll).toHaveBeenCalled();
  });

  it('renders artist details content when loaded', () => {
    (useArtistDetailsQueries as jest.Mock).mockReturnValue({
      isArtistIdValid: true,
      artist: {
        id: 13,
        name: 'Rihanna',
        picture: 'https://example.com/rihanna.jpg',
        picture_xl: 'https://example.com/rihanna-xl.jpg',
        nb_fan: 27100000,
      },
      topTracks: [
        {
          id: 1,
          title: 'Diamonds',
          title_short: 'Diamonds',
          duration: 220,
          rank: 9999,
          preview: '',
          explicit_lyrics: false,
        },
      ],
      albums: [
        {
          id: 10,
          title: 'ANTI',
          cover: 'https://example.com/cover.jpg',
          cover_medium: 'https://example.com/cover-medium.jpg',
          cover_big: 'https://example.com/cover-big.jpg',
          release_date: '2016-01-28',
        },
      ],
      isLoading: false,
      isRefreshing: false,
      isError: false,
      refetchAll: jest.fn(),
    });

    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <ArtistDetailsScreen />
      </ThemeProvider>,
    );

    expect(getByText('Rihanna')).toBeTruthy();
    expect(getByText('Top 5 Tracks')).toBeTruthy();
    expect(getByText('Albums')).toBeTruthy();
    expect(getByText('Diamonds')).toBeTruthy();
    expect(getByText('ANTI')).toBeTruthy();
  });
});
