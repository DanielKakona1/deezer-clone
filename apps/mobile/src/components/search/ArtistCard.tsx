import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

import type { Artist } from '@/types/artist.types';

type ArtistCardProps = {
  artist: Artist;
  onPress?: (artistId: number) => void;
};

const formatFans = (fans: number) => {
  if (fans >= 1_000_000) {
    return `${(fans / 1_000_000).toFixed(1)}M fans`;
  }

  if (fans >= 1000) {
    return `${(fans / 1000).toFixed(1)}K fans`;
  }

  return `${fans} fans`;
};

export const ArtistCard = ({ artist, onPress }: ArtistCardProps) => {
  return (
    <CardButton onPress={() => onPress?.(artist.id)} accessibilityRole="button">
      <ArtistImage source={artist.picture_xl || artist.picture} contentFit="cover" transition={180} />
      <ArtistName numberOfLines={1}>{artist.name}</ArtistName>
      <FanCount>{formatFans(artist.nb_fan)}</FanCount>
    </CardButton>
  );
};

const CardButton = styled(Pressable)`
  width: 48.5%;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const ArtistImage = styled(Image)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: #181821;
`;

const ArtistName = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: Poppins_600SemiBold;
  font-size: 15px;
`;

const FanCount = styled.Text`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: Poppins_400Regular;
  font-size: 12px;
`;
