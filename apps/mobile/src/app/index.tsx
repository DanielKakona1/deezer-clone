import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { ArtistCard } from '@/components/search/ArtistCard';
import { useArtistSearchQuery } from '@/hooks/useArtistSearchQuery';
import { useDebounce } from '@/hooks/useDebounce';
import type { Artist } from '@/types/artist.types';

const HEADER_EXPANDED_HEIGHT = 200;
const HEADER_COLLAPSED_HEIGHT = 96;
const HEADER_COLLAPSE_DISTANCE = HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT;
const HEADER_FADE_DISTANCE = HEADER_COLLAPSE_DISTANCE * 1.35;
const SEARCH_BAR_HEIGHT = 54;
const SEARCH_VERTICAL_GAP = 8;
const LOGO_TO_LABEL_GAP = 10;
const SEARCH_TO_SECTION_GAP = 2;
const SKELETON_PULSE_DURATION = 1050;

const SkeletonRows = ({ rows }: { rows: number }) => {
  const shimmerOpacity = useRef(new Animated.Value(0.58)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 1,
          duration: SKELETON_PULSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.58,
          duration: SKELETON_PULSE_DURATION,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerLoop.start();

    return () => {
      shimmerLoop.stop();
    };
  }, [shimmerOpacity]);

  return (
    <SkeletonGrid>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <SkeletonRow key={`skeleton-row-${rowIndex}`}>
          <SkeletonCard>
            <SkeletonArtwork style={{ opacity: shimmerOpacity }} />
            <SkeletonTitleLine style={{ opacity: shimmerOpacity }} />
            <SkeletonSubtitleLine style={{ opacity: shimmerOpacity }} />
          </SkeletonCard>

          <SkeletonCard>
            <SkeletonArtwork style={{ opacity: shimmerOpacity }} />
            <SkeletonTitleLine style={{ opacity: shimmerOpacity }} />
            <SkeletonSubtitleLine style={{ opacity: shimmerOpacity }} />
          </SkeletonCard>
        </SkeletonRow>
      ))}
    </SkeletonGrid>
  );
};

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [isPullRefreshing, setIsPullRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 260);
  const headerExpandedWithInset = HEADER_EXPANDED_HEIGHT + insets.top;
  const headerCollapsedWithInset = HEADER_COLLAPSED_HEIGHT + insets.top;
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_COLLAPSE_DISTANCE],
    outputRange: [headerExpandedWithInset, headerCollapsedWithInset],
    extrapolate: 'clamp',
  });
  const brandOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_COLLAPSE_DISTANCE * 0.7, HEADER_FADE_DISTANCE],
    outputRange: [1, 0.55, 0],
    extrapolate: 'clamp',
  });
  const brandTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_FADE_DISTANCE],
    outputRange: [0, -14],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_COLLAPSE_DISTANCE * 0.55, HEADER_FADE_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_FADE_DISTANCE],
    outputRange: [0, -22],
    extrapolate: 'clamp',
  });

  const {
    artists,
    shouldSearch,
    isError,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useArtistSearchQuery(debouncedQuery);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, [setQuery]);

  const handleClearQuery = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  const handleArtistPress = useCallback((artistId: number) => {
    router.push(`/artist/${artistId}`);
  }, []);

  const renderArtist = useCallback(({ item, index }: { item: Artist; index: number }) => {
    return <ArtistCard artist={item} index={index} onPress={handleArtistPress} />;
  }, [handleArtistPress]);

  const emptyState = useMemo(() => {
    if (!shouldSearch) {
      return <EmptyState>Search artists to discover Deezer profiles.</EmptyState>;
    }

    if (isLoading || (isFetching && artists.length === 0)) {
      return <SkeletonRows rows={2} />;
    }

    if (isError) {
      return <EmptyState>Could not load artists. Pull down to retry.</EmptyState>;
    }

    return <EmptyState>No artist matches this search.</EmptyState>;
  }, [artists.length, isError, isFetching, isLoading, shouldSearch]);

  const listContentStyle = useMemo(
    () => ({
      paddingTop: headerExpandedWithInset - (SEARCH_VERTICAL_GAP - SEARCH_TO_SECTION_GAP),
      paddingBottom: 44,
    }),
    [headerExpandedWithInset]
  );

  const onListScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      }),
    [scrollY]
  );

  const handleRefresh = useCallback(async () => {
    if (!shouldSearch) {
      return;
    }

    try {
      setIsPullRefreshing(true);
      await refetch();
    } finally {
      setIsPullRefreshing(false);
    }
  }, [refetch, shouldSearch]);

  return (
    <Container>
      <StatusBar style="light" />

      <HeaderShell style={{ height: headerHeight }}>
        <BrandRow
          style={{
            top: insets.top,
            opacity: brandOpacity,
            transform: [{ translateY: brandTranslateY }],
          }}
        >
          <BrandMark source={require('../../assets/Logo.png')} contentFit="contain" contentPosition="left" />
          <TopLabel>SEARCH</TopLabel>
        </BrandRow>

        <TitleShell style={{ opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }}>
          <Title>What do you want to listen to?</Title>
        </TitleShell>

        <SearchShell>
          <SearchBar>
            <SearchIcon name="search" size={18} color="#d2b0ff" />
            <SearchInput
              testID="search-input"
              value={query}
              onChangeText={handleQueryChange}
              placeholder="Artists, tracks, albums"
              placeholderTextColor="#9886b3"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {query.length > 0 ? (
              <ClearButton
                accessibilityRole="button"
                accessibilityLabel="Clear search input"
                onPress={handleClearQuery}
              >
                <Ionicons name="close-circle" size={18} color="#bca0dc" />
              </ClearButton>
            ) : null}
          </SearchBar>
        </SearchShell>
      </HeaderShell>

      <Animated.FlatList
        data={artists}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        columnWrapperStyle={columnWrapperStyle}
        contentContainerStyle={listContentStyle}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        onScroll={onListScroll}
        scrollEventThrottle={16}
        renderItem={renderArtist}
        onRefresh={handleRefresh}
        refreshing={isPullRefreshing}
        ListHeaderComponent={
          <SectionHeader>
            <SectionTitle>Artists</SectionTitle>
          </SectionHeader>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <FooterLoader>
              <SkeletonRows rows={1} />
            </FooterLoader>
          ) : null
        }
        ListEmptyComponent={emptyState}
      />
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #1b191f;
`;

const HeaderShell = styled(Animated.View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: #1b191f;
  overflow: hidden;
`;

const BrandRow = styled(Animated.View)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.lg}px;
  right: ${({ theme }) => theme.spacing.lg}px;
  flex-direction: column;
  align-items: flex-start;
`;

const SearchShell = styled(View)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.lg}px;
  right: ${({ theme }) => theme.spacing.lg}px;
  bottom: ${SEARCH_VERTICAL_GAP}px;
`;

const BrandMark = styled(Image)`
  width: 128px;
  height: 26px;
  align-self: flex-start;
`;

const SectionHeader = styled(View)`
  padding: 0 ${({ theme }) => theme.spacing.lg}px
    ${({ theme }) => theme.spacing.sm}px;
`;

const TopLabel = styled.Text`
  margin-top: ${LOGO_TO_LABEL_GAP}px;
  color: #cda7ff;
  font-family: Poppins_600SemiBold;
  font-size: 11px;
  letter-spacing: 1.5px;
`;

const TitleShell = styled(Animated.View)`
  position: absolute;
  left: ${({ theme }) => theme.spacing.lg}px;
  right: ${({ theme }) => theme.spacing.lg}px;
  bottom: ${SEARCH_BAR_HEIGHT + SEARCH_VERTICAL_GAP * 2}px;
`;

const Title = styled.Text`
  color: #f8f8ff;
  font-family: Poppins_700Bold;
  font-size: 30px;
  line-height: 37px;
`;

const SearchBar = styled(View)`
  height: ${SEARCH_BAR_HEIGHT}px;
  border-radius: 27px;
  border-width: 1px;
  border-color: #5c3b7f;
  background-color: #110f14;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const SearchIcon = styled(Ionicons)`
  margin-right: ${({ theme }) => theme.spacing.lg}px;
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  color: #ffffff;
  font-family: Poppins_500Medium;
  font-size: 15px;
`;

const ClearButton = styled(Pressable)`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  padding: 2px;
`;

const SectionTitle = styled.Text`
  margin-top: 0;
  color: #f8f8ff;
  font-family: Poppins_700Bold;
  font-size: 21px;
`;

const EmptyState = styled.Text`
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
  color: #d2ccdb;
  font-family: Poppins_400Regular;
  font-size: 14px;
`;

const FooterLoader = styled.View`
  padding-top: ${({ theme }) => theme.spacing.xs}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SkeletonGrid = styled(View)`
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
`;

const SkeletonRow = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const SkeletonCard = styled(View)`
  width: 48.5%;
`;

const SkeletonArtwork = styled(Animated.View)`
  height: 206px;
  border-radius: 18px;
  background-color: #2a2632;
`;

const SkeletonTitleLine = styled(Animated.View)`
  width: 72%;
  height: 16px;
  border-radius: 8px;
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  background-color: #332d3f;
`;

const SkeletonSubtitleLine = styled(Animated.View)`
  width: 44%;
  height: 13px;
  border-radius: 7px;
  margin-top: ${({ theme }) => theme.spacing.xs}px;
  background-color: #403554;
`;

const columnWrapperStyle = {
  justifyContent: 'space-between' as const,
  paddingHorizontal: 16,
};
