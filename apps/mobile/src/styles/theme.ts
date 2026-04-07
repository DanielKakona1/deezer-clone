export const theme = {
  colors: {
    background: '#121216',
    surface: '#1A1A22',
    textPrimary: '#F5F5F5',
    textSecondary: '#A8A8B3',
    border: '#2A2A36',
    accent: '#EF5466',
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
