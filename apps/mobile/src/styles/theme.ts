export const theme = {
  colors: {
    background: '#1B191F',
    surface: '#110F14',
    textPrimary: '#FFFFFF',
    textSecondary: '#D2C5E4',
    border: '#5C3B7F',
    accent: '#A238FF',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
} as const;

export type AppTheme = typeof theme;
