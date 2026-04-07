import { StatusBar } from 'expo-status-bar';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

export default function SearchScreen() {
  return (
    <Container>
      <StatusBar style="light" />
      <Header>Search</Header>
      <SearchBarButton accessibilityRole="button">
        <SearchBarText>Artists, tracks, albums...</SearchBarText>
      </SearchBarButton>
      <HintText>Search feature UI implementation is next step.</HintText>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl}px ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.Text`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: Poppins_700Bold;
  font-size: 28px;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SearchBarButton = styled(Pressable)`
  height: 52px;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.lg}px;
  padding: 0 ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const SearchBarText = styled.Text`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: Poppins_400Regular;
  font-size: 15px;
`;

const HintText = styled.Text`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: Poppins_400Regular;
  font-size: 13px;
`;
