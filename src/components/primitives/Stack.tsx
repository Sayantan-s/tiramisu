import { View, type ViewProps } from 'react-native';
import { useTheme } from '../../theme';

export type StackProps = ViewProps & {
  /** Gap between children, in spacing units (×4px). */
  gap?: number;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
};

/**
 * A flex container with a token-driven `gap`. The workhorse layout primitive —
 * reach for `Stack` whenever you'd otherwise write `flexDirection` + `gap`.
 *
 * @example
 * <Stack gap={3}>…</Stack>
 * <Stack direction="row" gap={2} align="center">…</Stack>
 */
export function Stack({ gap = 3, direction = 'column', align, justify, style, ...rest }: StackProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        { flexDirection: direction, alignItems: align, justifyContent: justify, gap: theme.spacing(gap) },
        style,
      ]}
      {...rest}
    />
  );
}
