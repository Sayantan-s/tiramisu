import type { TextStyle } from 'react-native';

/**
 * Design tokens for the Tiramisu design system.
 *
 * Values are sourced 1:1 from the Pencil design file (`.design/untitled.pen`,
 * "Tiramisu Design System" — light `OYvYX`, dark `ALtd2`). The palette is a
 * shadcn-style semantic token set built around a violet brand primary.
 *
 * Consume tokens via the `useTheme()` hook — never hard-code colors, radii, or
 * font sizes in components.
 */

export type ThemeName = 'light' | 'dark';

/** Font family names. These must be linked natively (see src/components/README.md). */
export const fonts = {
  /** Big, bold display headlines. */
  display: 'Anton',
  /** Default UI / body text. */
  body: 'Inter',
  /** Secondary / numeric text (amounts, tickers). */
  secondary: 'Geist',
} as const;

/** The canonical semantic color tokens. New code should only use these. */
export type ThemeColors = {
  /** App background. */
  background: string;
  /** Default text/icon color on `background`. */
  foreground: string;

  /** Raised surface (cards, sheets). */
  card: string;
  /** Text/icon color on `card`. */
  cardForeground: string;

  /** Popover / menu surface. */
  popover: string;
  /** Text/icon color on `popover`. */
  popoverForeground: string;

  /** Brand color — primary actions, active states, focus. */
  primary: string;
  /** Text/icon color on `primary`. */
  primaryForeground: string;

  /** Neutral secondary surface (secondary buttons, chips). */
  secondary: string;
  /** Text/icon color on `secondary`. */
  secondaryForeground: string;

  /** Low-emphasis surface (muted fills, input backgrounds). */
  muted: string;
  /** Low-emphasis text (labels, captions, placeholders). */
  mutedForeground: string;

  /** Danger / destructive actions. */
  destructive: string;
  /** Text/icon color on `destructive`. */
  destructiveForeground: string;

  /** Soft success surface. */
  success: string;
  /** Readable text/icon on `success`. */
  successForeground: string;
  /** Soft warning surface. */
  warning: string;
  /** Readable text/icon on `warning`. */
  warningForeground: string;
  /** Soft info surface. */
  info: string;
  /** Readable text/icon on `info`. */
  infoForeground: string;
  /** Soft error surface (distinct from solid `destructive`). */
  error: string;
  /** Readable text/icon on `error`. */
  errorForeground: string;

  /** Hairline borders. */
  border: string;
  /** Input borders. */
  input: string;
  /** Focus ring. */
  ring: string;
  /** Subtle tile / well background. */
  tile: string;
  /** Scrim behind modals / sheets. */
  overlay: string;

  // ── Deprecated back-compat aliases ──────────────────────────────────────
  // The pre-existing screens/components referenced these names. They map onto
  // the new tokens so the app keeps compiling and simply re-skins. Prefer the
  // canonical names above in all new code.
  /** @deprecated use `background` */
  bg: string;
  /** @deprecated use `card` */
  bgElevated: string;
  /** @deprecated use `muted` */
  bgMuted: string;
  /** @deprecated use `foreground` */
  text: string;
  /** @deprecated use `mutedForeground` */
  textMuted: string;
  /** @deprecated use `primaryForeground` */
  textInverse: string;
  /** @deprecated use `primary` */
  accent: string;
  /** @deprecated use `secondary` */
  accentMuted: string;
  /** @deprecated use `destructive` */
  danger: string;
  /** @deprecated use `border` */
  divider: string;
};

export type ThemeRadii = {
  none: number;
  /** 6 — chips, badges, small controls. */
  xs: number;
  /** 6 — alias of xs (legacy). */
  sm: number;
  /** 12 — inputs, list items (legacy md). */
  md: number;
  /** 18 — cards (legacy lg). */
  lg: number;
  /** 24 — large cards / Pencil `radius-m`. */
  xl: number;
  /** 24 — Pencil `radius-m`. */
  m: number;
  /** 40 — hero surfaces / Pencil `radius-l`. */
  l: number;
  /** Fully rounded. */
  pill: number;
};

export type TypographyToken = {
  fontFamily: string;
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
};

export type Theme = {
  name: ThemeName;
  colors: ThemeColors;
  radii: ThemeRadii;
  /** 4px base spacing scale: `spacing(2)` → 8. */
  spacing: (n: number) => number;
  typography: {
    display: TypographyToken;
    title: TypographyToken;
    heading: TypographyToken;
    body: TypographyToken;
    label: TypographyToken;
    caption: TypographyToken;
  };
};

const sharedRadii: ThemeRadii = {
  none: 0,
  xs: 6,
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  m: 24,
  l: 40,
  pill: 999,
};

const baseSpacing = (n: number) => n * 4;

// Anton is a single-weight display face; the heavier `fontWeight` values keep
// the system fallback looking bold until the font is linked natively.
const sharedTypography = {
  display: { fontFamily: fonts.display, fontSize: 34, fontWeight: '800' as const, lineHeight: 38 },
  title: { fontFamily: fonts.display, fontSize: 26, fontWeight: '700' as const, lineHeight: 30 },
  heading: { fontFamily: fonts.body, fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
  body: { fontFamily: fonts.body, fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  label: { fontFamily: fonts.body, fontSize: 14, fontWeight: '600' as const, lineHeight: 18 },
  caption: { fontFamily: fonts.body, fontSize: 13, fontWeight: '500' as const, lineHeight: 16 },
};

/** Canonical tokens minus the deprecated aliases. */
type CanonicalColors = Omit<
  ThemeColors,
  'bg' | 'bgElevated' | 'bgMuted' | 'text' | 'textMuted' | 'textInverse' | 'accent' | 'accentMuted' | 'danger' | 'divider'
>;

/** Attach the deprecated aliases that map onto the canonical tokens. */
function withAliases(c: CanonicalColors): ThemeColors {
  return {
    ...c,
    bg: c.background,
    bgElevated: c.card,
    bgMuted: c.muted,
    text: c.foreground,
    textMuted: c.mutedForeground,
    textInverse: c.primaryForeground,
    accent: c.primary,
    accentMuted: c.secondary,
    danger: c.destructive,
    divider: c.border,
  };
}

export const lightTheme: Theme = {
  name: 'light',
  colors: withAliases({
    background: '#FFFFFF',
    foreground: '#2A2933',
    card: '#FFFFFF',
    cardForeground: '#2A2933',
    popover: '#FFFFFF',
    popoverForeground: '#2A2933',
    primary: '#5749F4',
    primaryForeground: '#FFFFFF',
    secondary: '#D9D9DB',
    secondaryForeground: '#2A2933',
    muted: '#F5F5F5',
    mutedForeground: '#616167',
    destructive: '#CC3314',
    destructiveForeground: '#FFFFFF',
    success: '#A1E5A1',
    successForeground: '#003300',
    warning: '#FFD9B2',
    warningForeground: '#4D2700',
    info: '#C9D6F0',
    infoForeground: '#001133',
    error: '#FFBFB2',
    errorForeground: '#590F00',
    border: '#C5C5CB',
    input: '#C5C5CB',
    ring: '#E1E2E5',
    tile: '#F5F5F5',
    overlay: 'rgba(0, 0, 0, 0.45)',
  }),
  radii: sharedRadii,
  spacing: baseSpacing,
  typography: sharedTypography,
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: withAliases({
    background: '#131124',
    foreground: '#E8E8EA',
    card: '#1A182E',
    cardForeground: '#FFFFFF',
    popover: '#1A182E',
    popoverForeground: '#FFFFFF',
    primary: '#5749F4',
    primaryForeground: '#FFFFFF',
    secondary: '#403F51',
    secondaryForeground: '#FFFFFF',
    muted: '#2E2E2E',
    mutedForeground: '#888799',
    destructive: '#CC3314',
    destructiveForeground: '#FFFFFF',
    success: '#3B4748',
    successForeground: '#A1E5A1',
    warning: '#53484F',
    warningForeground: '#FFD9B2',
    info: '#404562',
    infoForeground: '#B2CCFF',
    error: '#53424F',
    errorForeground: '#FFBFB2',
    border: '#2B283D',
    input: '#2B283D',
    ring: '#666666',
    tile: '#1A182E',
    overlay: 'rgba(0, 0, 0, 0.6)',
  }),
  radii: sharedRadii,
  spacing: baseSpacing,
  typography: sharedTypography,
};

export const themes: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
