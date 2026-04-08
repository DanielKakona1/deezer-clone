import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, FlatList, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { useArtistDetailsQueries } from '@/hooks/useArtistDetailsQueries';
import type { ArtistAlbum } from '@/types/artist.types';

const formatFans = (fans: number) => {
  if (fans >= 1_000_000) {
    return `${(fans / 1_000_000).toFixed(1)}M fans`;
  }

  if (fans >= 1000) {
    return `${(fans / 1000).toFixed(1)}K fans`;
  }

  return `${fans} fans`;
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default function ArtistDetailsScreen() {
  const params = useLocalSearchParams<{ artistId: string }>();
  const artistId = Number(params.artistId);
  const { isArtistIdValid, artist, topTracks, albums, isLoading, isError, refetchAll } =
    useArtistDetailsQueries(artistId);

  if (!isArtistIdValid) {
    return (
      <Container>
        <StatusBar style="light" />
        <CenterState>
          <StateText>Invalid artist.</StateText>
        </CenterState>
      </Container>
    );
  }

  if (isLoading && !artist) {
    return (
      <Container>
        <StatusBar style="light" />
        <CenterState>
          <ActivityIndicator color="#a238ff" />
          <StateText>Loading artist details...</StateText>
        </CenterState>
      </Container>
    );
  }

  if (isError || !artist) {
    return (
      <Container>
        <StatusBar style="light" />
        <CenterState>
          <StateText>Could not load this artist.</StateText>
          <RetryButton
            onPress={() => {
              void refetchAll();
            }}
          >
            <RetryLabel>Retry</RetryLabel>
          </RetryButton>
        </CenterState>
      </Container>
    );
  }

  return (
    <Container>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={scrollContentStyle} showsVerticalScrollIndicator={false}>
        <Hero>
          <HeroImage source={artist.picture_xl || artist.picture} contentFit="cover" transition={180} />
          <HeroOverlay />

          <BrandBadge source={require('../../../assets/Logo.png')} contentFit="contain" />

          <TopBar>
            <BackButton accessibilityRole="button" onPress={() => router.back()}>
              <Ionicons name="chevron-back" color="#ffffff" size={24} />
            </BackButton>
          </TopBar>

          <HeroContent>
            <ArtistName>{artist.name}</ArtistName>
            <FanCount>{formatFans(artist.nb_fan)}</FanCount>
          </HeroContent>
        </Hero>

        <Section>
          <SectionTitle>Top tracks</SectionTitle>

          {topTracks.map((track, index) => (
            <TrackRow key={track.id}>
              <TrackIndex>{index + 1}</TrackIndex>
              <TrackMeta>
                <TrackTitle numberOfLines={1}>{track.title_short || track.title}</TrackTitle>
                <TrackSubText>Rank {track.rank.toLocaleString()}</TrackSubText>
              </TrackMeta>
              <TrackDuration>{formatDuration(track.duration)}</TrackDuration>
            </TrackRow>
          ))}
        </Section>

        <Section>
          <SectionTitle>Albums</SectionTitle>

          <FlatList
            horizontal
            data={albums}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={albumsListContentStyle}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: ArtistAlbum }) => (
              <AlbumCard>
                <AlbumCover source={item.cover_big || item.cover_medium || item.cover} contentFit="cover" />
                <AlbumTitle numberOfLines={2}>{item.title}</AlbumTitle>
              </AlbumCard>
            )}
            ListEmptyComponent={<StateText>No albums found.</StateText>}
          />
        </Section>
      </ScrollView>
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #1b191f;
`;

const Hero = styled(View)`
  height: 420px;
  position: relative;
`;

const HeroImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const HeroOverlay = styled(View)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60%;
  background-color: rgba(27, 25, 31, 0.8);
`;

const BrandBadge = styled(Image)`
  position: absolute;
  right: ${({ theme }) => theme.spacing.lg}px;
  top: ${({ theme }) => theme.spacing.lg}px;
  width: 90px;
  height: 22px;
  opacity: 0.9;
`;

const TopBar = styled(View)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg}px;
  left: ${({ theme }) => theme.spacing.lg}px;
`;

const BackButton = styled(Pressable)`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.35);
`;

const HeroContent = styled(View)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.lg}px;
  right: ${({ theme }) => theme.spacing.lg}px;
  bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const ArtistName = styled.Text`
  color: #f8f8ff;
  font-family: Poppins_700Bold;
  font-size: 34px;
`;

const FanCount = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  color: #d7bbff;
  font-family: Poppins_500Medium;
  font-size: 14px;
`;

const Section = styled(View)`
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled.Text`
  color: #f8f8ff;
  font-family: Poppins_700Bold;
  font-size: 21px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const TrackRow = styled(View)`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

const TrackIndex = styled.Text`
  width: 22px;
  color: #7e8198;
  font-family: Poppins_600SemiBold;
  font-size: 13px;
`;

const TrackMeta = styled(View)`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const TrackTitle = styled.Text`
  color: #f8f8ff;
  font-family: Poppins_600SemiBold;
  font-size: 14px;
`;

const TrackSubText = styled.Text`
  margin-top: 2px;
  color: #d0b2ff;
  font-family: Poppins_400Regular;
  font-size: 11px;
`;

const TrackDuration = styled.Text`
  color: #d0b2ff;
  font-family: Poppins_500Medium;
  font-size: 12px;
`;

const AlbumCard = styled(View)`
  width: 150px;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const AlbumCover = styled(Image)`
  width: 150px;
  height: 150px;
  border-radius: ${({ theme }) => theme.radius.md}px;
  background-color: #110f14;
`;

const AlbumTitle = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: #f8f8ff;
  font-family: Poppins_500Medium;
  font-size: 13px;
  line-height: 18px;
`;

const CenterState = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const StateText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: #d2c5e4;
  font-family: Poppins_400Regular;
  font-size: 14px;
  text-align: center;
`;

const RetryButton = styled(Pressable)`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  background-color: #a238ff;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px;
  border-radius: 999px;
`;

const RetryLabel = styled.Text`
  color: #ffffff;
  font-family: Poppins_600SemiBold;
  font-size: 13px;
`;

const scrollContentStyle = {
  paddingBottom: 44,
};

const albumsListContentStyle = {
  paddingBottom: 12,
};
