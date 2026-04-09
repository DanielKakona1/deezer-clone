import { fireEvent, render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components/native';

import { theme } from '@/styles/theme';
import type { Artist } from '@/types/artist.types';

import { ArtistCard } from './ArtistCard';

jest.mock('expo-image', () => {
  const { Image } = jest.requireActual('react-native');
  return { Image };
});

const artistFixture: Artist = {
  id: 13,
  name: 'Rihanna',
  picture: 'https://example.com/rihanna.jpg',
  picture_xl: 'https://example.com/rihanna-xl.jpg',
  nb_fan: 1_530_000,
};

const renderWithTheme = (ui: ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('ArtistCard', () => {
  it('renders artist name and formatted fan count', () => {
    const { getByText } = renderWithTheme(<ArtistCard artist={artistFixture} />);

    expect(getByText('Rihanna')).toBeTruthy();
    expect(getByText('1.5M fans')).toBeTruthy();
  });

  it('calls onPress with artist id', () => {
    const handlePress = jest.fn();
    const { getByRole } = renderWithTheme(
      <ArtistCard artist={artistFixture} onPress={handlePress} />,
    );

    fireEvent.press(getByRole('button'));

    expect(handlePress).toHaveBeenCalledTimes(1);
    expect(handlePress).toHaveBeenCalledWith(13);
  });
});
