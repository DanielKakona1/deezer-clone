import { Image } from 'expo-image';
import { Animated, Pressable } from 'react-native';
import { memo, useEffect, useRef } from 'react';
import styled from 'styled-components/native';

import type { Artist } from '@/types/artist.types';

type ArtistCardProps = {
  artist: Artist;
  index?: number;
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

export const ArtistCard = memo(({ artist, index = 0, onPress }: ArtistCardProps) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        delay: Math.min(index * 55, 330),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        delay: Math.min(index * 55, 330),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <CardWrapper style={{ opacity, transform: [{ translateY }] }}>
      <CardButton onPress={() => onPress?.(artist.id)} accessibilityRole="button">
        <ArtistImage source={artist.picture_xl || artist.picture} contentFit="cover" transition={180} />
        <ArtistName numberOfLines={1}>{artist.name}</ArtistName>
        <FanCount>{formatFans(artist.nb_fan)}</FanCount>
      </CardButton>
    </CardWrapper>
  );
});

const CardWrapper = styled(Animated.View)`
  width: 48.5%;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const CardButton = styled(Pressable)`
  width: 100%;
`;

const ArtistImage = styled(Image)`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  background-color: #110f14;
`;

const ArtistName = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: Poppins_600SemiBold;
  font-size: 15px;
`;

const FanCount = styled.Text`
  margin-top: 2px;
  color: #cda7ff;
  font-family: Poppins_400Regular;
  font-size: 12px;
`;
