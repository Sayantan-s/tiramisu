import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { useTheme } from '../theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'caption';
type Tone = 'default' | 'muted' | 'inverse' | 'accent' | 'danger' | 'success';

export type TextProps = RNTextProps & {
  variant?: Variant;
  tone?: Tone;
  weight?: TextStyle['fontWeight'];
  align?: TextStyle['textAlign'];
};

export function Text({
  variant = 'body',
  tone = 'default',
  weight,
  align,
  style,
  ...rest
}: TextProps) {
  const theme = useTheme();
  const baseTypography = theme.typography[variant];
  const color =
    tone === 'muted'
      ? theme.colors.textMuted
      : tone === 'inverse'
        ? theme.colors.textInverse
        : tone === 'accent'
          ? theme.colors.accent
          : tone === 'danger'
            ? theme.colors.danger
            : tone === 'success'
              ? theme.colors.success
              : theme.colors.text;

  return (
    <RNText
      style={[
        baseTypography,
        { color, textAlign: align },
        weight && { fontWeight: weight },
        style,
      ]}
      {...rest}
    />
  );
}
