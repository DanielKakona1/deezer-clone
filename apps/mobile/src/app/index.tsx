import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Easing, FlatList, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { ArtistCard } from '@/components/search/ArtistCard';
import { useArtistSearchQuery } from '@/hooks/useArtistSearchQuery';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchStore } from '@/store/search.store';
import type { Artist } from '@/types/artist.types';

export default function SearchScreen() {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const debouncedQuery = useDebounce(query, 260);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(16)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;
  const searchTranslateY = useRef(new Animated.Value(16)).current;
  const topLabelOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const topLabelTranslateX = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [0, -8],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 90],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 90],
    outputRange: [0, -18],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(searchOpacity, {
        toValue: 1,
        duration: 380,
        delay: 110,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(searchTranslateY, {
        toValue: 0,
        duration: 380,
        delay: 110,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerOpacity, headerTranslateY, searchOpacity, searchTranslateY]);

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

  const handleLoadMore = () => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const handleArtistPress = (artistId: number) => {
    router.push(`/artist/${artistId}`);
  };

  const renderArtist = ({ item, index }: { item: Artist; index: number }) => {
    return <ArtistCard artist={item} index={index} onPress={handleArtistPress} />;
  };

  const renderEmptyState = () => {
    if (!shouldSearch) {
      return <EmptyState>Search artists to discover Deezer profiles.</EmptyState>;
    }

    if (isLoading || isFetching) {
      return <EmptyState>Searching artists...</EmptyState>;
    }

    if (isError) {
      return <EmptyState>Could not load artists. Pull down to retry.</EmptyState>;
    }

    return <EmptyState>No artist matches this search.</EmptyState>;
  };

  return (
    <Container>
      <StatusBar style="light" />

      <HeaderIntro style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }}>
        <BrandRow>
          <BrandMark source={require('../../assets/Logo.png')} contentFit="contain" />
          <TopLabel style={{ opacity: topLabelOpacity, transform: [{ translateX: topLabelTranslateX }] }}>
            SEARCH
          </TopLabel>
        </BrandRow>
      </HeaderIntro>

      <StickySearchShell style={{ opacity: searchOpacity, transform: [{ translateY: searchTranslateY }] }}>
        <SearchBar>
          <SearchIcon name="search" size={18} color="#d2b0ff" />
          <SearchInput
            value={query}
            onChangeText={handleQueryChange}
            placeholder="Artists, tracks, albums"
            placeholderTextColor="#9886b3"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </SearchBar>
      </StickySearchShell>

      <FlatList
        data={artists}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        columnWrapperStyle={columnWrapperStyle}
        contentContainerStyle={listContentStyle}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        renderItem={renderArtist}
        onRefresh={() => {
          if (shouldSearch) {
            void refetch();
          }
        }}
        refreshing={isFetching && !isFetchingNextPage}
        ListHeaderComponent={
          <>
            <TitleShell style={{ opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] }}>
              <Title>What do you want to listen to?</Title>
            </TitleShell>

            <SectionHeader>
              <SectionTitle>Artists</SectionTitle>
            </SectionHeader>
          </>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <FooterLoader>
              <ActivityIndicator color="#a238ff" />
            </FooterLoader>
          ) : null
        }
        ListEmptyComponent={renderEmptyState()}
      />
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #1b191f;
`;

const HeaderIntro = styled(Animated.View)`
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px
    ${({ theme }) => theme.spacing.sm}px;
`;

const BrandRow = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const StickySearchShell = styled(Animated.View)`
  background-color: #1b191f;
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px
    ${({ theme }) => theme.spacing.md}px;
`;

const BrandMark = styled(Image)`
  width: 128px;
  height: 26px;
  align-self: flex-start;
`;

const SectionHeader = styled(View)`
  padding: ${({ theme }) => theme.spacing.md}px ${({ theme }) => theme.spacing.lg}px
    ${({ theme }) => theme.spacing.sm}px;
`;

const TopLabel = styled(Animated.Text)`
  margin-left: ${({ theme }) => theme.spacing.sm}px;
  color: #cda7ff;
  font-family: Poppins_600SemiBold;
  font-size: 11px;
  letter-spacing: 1.5px;
`;

const TitleShell = styled(Animated.View)`
  padding: ${({ theme }) => theme.spacing.sm}px ${({ theme }) => theme.spacing.lg}px 0;
`;

const Title = styled.Text`
  color: #f8f8ff;
  font-family: Poppins_700Bold;
  font-size: 30px;
  line-height: 37px;
`;

const SearchBar = styled(View)`
  height: 54px;
  border-radius: 27px;
  border-width: 1px;
  border-color: #5c3b7f;
  background-color: #110f14;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const SearchIcon = styled(Ionicons)`
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  color: #ffffff;
  font-family: Poppins_500Medium;
  font-size: 15px;
`;

const SectionTitle = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.xl}px;
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
  padding-top: ${({ theme }) => theme.spacing.sm}px;
  padding-bottom: ${({ theme }) => theme.spacing.xl}px;
`;

const listContentStyle = {
  paddingBottom: 44,
};

const columnWrapperStyle = {
  justifyContent: 'space-between' as const,
  paddingHorizontal: 16,
};
