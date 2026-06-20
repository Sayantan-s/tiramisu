import { View, type ViewProps } from 'react-native';
import { useTheme } from '../../theme';
import type { ThemeRadii } from '../../theme';

type SpacingProp = number | undefined;

export type BoxProps = ViewProps & {
  /** Padding in spacing units (×4px). */
  padding?: SpacingProp;
  paddingX?: SpacingProp;
  paddingY?: SpacingProp;
  /** Gap between children, in spacing units. */
  gap?: SpacingProp;
  /** Flex direction. */
  row?: boolean;
  /** Surface background color token. */
  background?: 'background' | 'card' | 'muted' | 'tile' | 'transparent';
  /** Corner radius token. */
  radius?: keyof ThemeRadii;
  /** Hairline border using the `border` token. */
  bordered?: boolean;
  flex?: number;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
};

/**
 * A themed `View`. Use it instead of a raw `View` when you want token-driven
 * padding, gaps, surfaces, radii, or borders without writing a style object.
 *
 * @example
 * <Box background="card" radius="lg" padding={4} gap={2}>…</Box>
 */
export function Box({
  padding,
  paddingX,
  paddingY,
  gap,
  row,
  background,
  radius,
  bordered,
  flex,
  align,
  justify,
  style,
  ...rest
}: BoxProps) {
  const theme = useTheme();
  const sp = theme.spacing;
  const bg =
    background === 'transparent'
      ? 'transparent'
      : background
        ? theme.colors[background]
        : undefined;

  return (
    <View
      style={[
        {
          padding: padding != null ? sp(padding) : undefined,
          paddingHorizontal: paddingX != null ? sp(paddingX) : undefined,
          paddingVertical: paddingY != null ? sp(paddingY) : undefined,
          gap: gap != null ? sp(gap) : undefined,
          flexDirection: row ? 'row' : 'column',
          backgroundColor: bg,
          borderRadius: radius ? theme.radii[radius] : undefined,
          borderWidth: bordered ? 1 : undefined,
          borderColor: bordered ? theme.colors.border : undefined,
          flex,
          alignItems: align,
          justifyContent: justify,
        },
        style,
      ]}
      {...rest}
    />
  );
}
