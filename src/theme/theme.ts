export type ThemeName = 'light' | 'dark';

export type Theme = {
  name: ThemeName;
  colors: {
    bg: string;
    bgElevated: string;
    bgMuted: string;
    text: string;
    textMuted: string;
    textInverse: string;
    accent: string;
    accentMuted: string;
    danger: string;
    success: string;
    border: string;
    divider: string;
    overlay: string;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
  };
  spacing: (n: number) => number;
  typography: {
    display: { fontSize: number; fontWeight: '700' | '800' };
    title: { fontSize: number; fontWeight: '700' };
    heading: { fontSize: number; fontWeight: '600' };
    body: { fontSize: number; fontWeight: '400' };
    caption: { fontSize: number; fontWeight: '500' };
  };
};

const sharedTypography = {
  display: { fontSize: 40, fontWeight: '800' as const },
  title: { fontSize: 28, fontWeight: '700' as const },
  heading: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '500' as const },
};

const sharedRadii = { sm: 6, md: 12, lg: 18, xl: 24, pill: 999 };

const baseSpacing = (n: number) => n * 4;

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    bg: '#FBF7F2',
    bgElevated: '#FFFFFF',
    bgMuted: '#F1ECE3',
    text: '#1B1A17',
    textMuted: '#6B655B',
    textInverse: '#FBF7F2',
    accent: '#7B4B2A',
    accentMuted: '#E8D5C2',
    danger: '#B6342B',
    success: '#2E7D5B',
    border: '#E2DACB',
    divider: '#EDE6D8',
    overlay: 'rgba(27, 26, 23, 0.45)',
  },
  radii: sharedRadii,
  spacing: baseSpacing,
  typography: sharedTypography,
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    bg: '#15110D',
    bgElevated: '#221C16',
    bgMuted: '#1B1612',
    text: '#F5EFE3',
    textMuted: '#A89B86',
    textInverse: '#15110D',
    accent: '#E5A26A',
    accentMuted: '#553925',
    danger: '#F58E84',
    success: '#7CC9A6',
    border: '#2E251C',
    divider: '#2A2117',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  radii: sharedRadii,
  spacing: baseSpacing,
  typography: sharedTypography,
};
