import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { useTheme } from '../../theme';

/** Typographic role. Maps to a `theme.typography` token. */
export type TextVariant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';

/**
 * Semantic text color.
 * `accent` and `danger` are kept as deprecated aliases of `primary`/`destructive`.
 */
export type TextTone =
  | 'default'
  | 'muted'
  | 'inverse'
  | 'primary'
  | 'destructive'
  | 'success'
  /** @deprecated use `primary` */
  | 'accent'
  /** @deprecated use `destructive` */
  | 'danger';

export type TextProps = RNTextProps & {
  /** Typographic role — controls size, weight, line-height, and font family. */
  variant?: TextVariant;
  /** Semantic color. */
  tone?: TextTone;
  /** Override the variant's font weight. */
  weight?: TextStyle['fontWeight'];
  /** Horizontal alignment. */
  align?: TextStyle['textAlign'];
};

/**
 * The single text primitive. Always render copy through `Text` so it inherits
 * the design system's type scale, fonts, and themed colors.
 *
 * @example
 * <Text variant="title">Split it fair</Text>
 * <Text variant="caption" tone="muted">3 roommates</Text>
 */
export function Text({ variant = 'body', tone = 'default', weight, align, style, ...rest }: TextProps) {
  const theme = useTheme();
  const c = theme.colors;
  const color: string =
    tone === 'muted'
      ? c.mutedForeground
      : tone === 'inverse'
        ? c.primaryForeground
        : tone === 'primary' || tone === 'accent'
          ? c.primary
          : tone === 'destructive' || tone === 'danger'
            ? c.destructive
            : tone === 'success'
              ? c.successForeground
              : c.foreground;

  return (
    <RNText
      style={[theme.typography[variant], { color, textAlign: align }, weight ? { fontWeight: weight } : null, style]}
      {...rest}
    />
  );
}
