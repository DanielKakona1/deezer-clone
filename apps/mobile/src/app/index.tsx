import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { FlatList, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { ArtistCard } from '@/components/search/ArtistCard';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchStore } from '@/store/search.store';
import type { Artist } from '@/types/artist.types';
import { mockArtists } from '@/utils/mockArtists';

export default function SearchScreen() {
  const query = useSearchStore((state) => state.query);
  const setQuery = useSearchStore((state) => state.setQuery);
  const [visibleCount, setVisibleCount] = useState(8);
  const debouncedQuery = useDebounce(query, 260);

  const filteredArtists = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return mockArtists;
    }

    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    return mockArtists.filter((artist) => artist.name.toLowerCase().includes(normalizedQuery));
  }, [debouncedQuery]);

  const visibleArtists = useMemo(() => {
    return filteredArtists.slice(0, visibleCount);
  }, [filteredArtists, visibleCount]);

  const handleLoadMore = () => {
    if (visibleCount >= filteredArtists.length) {
      return;
    }

    setVisibleCount((prev) => prev + 6);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setVisibleCount(8);
  };

  const renderArtist = ({ item }: { item: Artist }) => <ArtistCard artist={item} />;

  return (
    <Container>
      <StatusBar style="light" />

      <FlatList
        data={visibleArtists}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        columnWrapperStyle={columnWrapperStyle}
        contentContainerStyle={listContentStyle}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        renderItem={renderArtist}
        ListHeaderComponent={
          <HeaderSection>
            <TopLabel>SEARCH</TopLabel>
            <Title>What do you want to listen to?</Title>

            <SearchBar>
              <SearchIcon name="search" size={18} color="#8E91A8" />
              <SearchInput
                value={query}
                onChangeText={handleQueryChange}
                placeholder="Artists, tracks, albums"
                placeholderTextColor="#7C7F96"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </SearchBar>

            <SectionTitle>Artists</SectionTitle>
          </HeaderSection>
        }
        ListEmptyComponent={<EmptyState>No artist matches this search.</EmptyState>}
      />
    </Container>
  );
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #0a0b13;
`;

const HeaderSection = styled(View)`
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px
    ${({ theme }) => theme.spacing.md}px;
`;

const TopLabel = styled.Text`
  color: #7e8198;
  font-family: Poppins_600SemiBold;
  font-size: 11px;
  letter-spacing: 1.5px;
`;

const Title = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
  color: #f8f8ff;
  font-family: Poppins_700Bold;
  font-size: 30px;
  line-height: 37px;
`;

const SearchBar = styled(View)`
  margin-top: ${({ theme }) => theme.spacing.xl}px;
  height: 54px;
  border-radius: 27px;
  border-width: 1px;
  border-color: #23273a;
  background-color: #111324;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
  flex-direction: row;
  align-items: center;
`;

const SearchIcon = styled(Ionicons)`
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  color: #f8f8ff;
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
  color: #8e91a8;
  font-family: Poppins_400Regular;
  font-size: 14px;
`;

const listContentStyle = {
  paddingBottom: 44,
};

const columnWrapperStyle = {
  justifyContent: 'space-between' as const,
  paddingHorizontal: 16,
};
