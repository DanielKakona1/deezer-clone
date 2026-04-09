import { act, renderHook } from '@testing-library/react-native';

import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns the current value initially', () => {
    const { result } = renderHook(() => useDebounce('rihanna', 300));

    expect(result.current).toBe('rihanna');
  });

  it('updates the debounced value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      {
        initialProps: { value: 'rih' },
      },
    );

    rerender({ value: 'riha' });

    expect(result.current).toBe('rih');

    act(() => {
      jest.advanceTimersByTime(299);
    });
    expect(result.current).toBe('rih');

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('riha');
  });
});
