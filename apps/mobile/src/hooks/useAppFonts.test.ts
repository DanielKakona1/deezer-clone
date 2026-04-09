import { useAppFonts } from './useAppFonts';

const mockUseFonts = jest.fn();

jest.mock('@expo-google-fonts/poppins', () => ({
  Poppins_100Thin: 'Poppins_100Thin',
  Poppins_100Thin_Italic: 'Poppins_100Thin_Italic',
  Poppins_200ExtraLight: 'Poppins_200ExtraLight',
  Poppins_200ExtraLight_Italic: 'Poppins_200ExtraLight_Italic',
  Poppins_300Light: 'Poppins_300Light',
  Poppins_300Light_Italic: 'Poppins_300Light_Italic',
  Poppins_400Regular: 'Poppins_400Regular',
  Poppins_400Regular_Italic: 'Poppins_400Regular_Italic',
  Poppins_500Medium: 'Poppins_500Medium',
  Poppins_500Medium_Italic: 'Poppins_500Medium_Italic',
  Poppins_600SemiBold: 'Poppins_600SemiBold',
  Poppins_600SemiBold_Italic: 'Poppins_600SemiBold_Italic',
  Poppins_700Bold: 'Poppins_700Bold',
  Poppins_700Bold_Italic: 'Poppins_700Bold_Italic',
  Poppins_800ExtraBold: 'Poppins_800ExtraBold',
  Poppins_800ExtraBold_Italic: 'Poppins_800ExtraBold_Italic',
  Poppins_900Black: 'Poppins_900Black',
  Poppins_900Black_Italic: 'Poppins_900Black_Italic',
  useFonts: (...args: unknown[]) => mockUseFonts(...args),
}));

describe('useAppFonts', () => {
  it('delegates to useFonts with full poppins family', () => {
    mockUseFonts.mockReturnValue([true]);

    const result = useAppFonts();

    expect(result).toEqual([true]);
    expect(mockUseFonts).toHaveBeenCalledTimes(1);

    const arg = mockUseFonts.mock.calls[0][0] as Record<string, unknown>;
    expect(Object.keys(arg)).toHaveLength(18);
    expect(arg).toHaveProperty('Poppins_700Bold');
    expect(arg).toHaveProperty('Poppins_900Black_Italic');
  });
});
