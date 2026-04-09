import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AppProviders } from './AppProviders';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('AppProviders', () => {
  it('renders children within providers', () => {
    const { getByTestId } = render(
      <AppProviders>
        <Text testID="providers-child">Child content</Text>
      </AppProviders>,
    );

    expect(getByTestId('providers-child')).toBeTruthy();
  });
});
