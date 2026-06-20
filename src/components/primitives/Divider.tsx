import { View } from 'react-native';
import { useTheme } from '../../theme';

export type DividerProps = {
  /** Orientation. Horizontal spans width; vertical spans height. */
  orientation?: 'horizontal' | 'vertical';
  /** Outer spacing (margin) in spacing units, on the cross axis. */
  spacing?: number;
};

/** A one-pixel hairline using the `border` token. */
export function Divider({ orientation = 'horizontal', spacing = 0 }: DividerProps) {
  const theme = useTheme();
  const isH = orientation === 'horizontal';
  return (
    <View
      style={{
        backgroundColor: theme.colors.border,
        alignSelf: 'stretch',
        width: isH ? undefined : 1,
        height: isH ? 1 : undefined,
        marginVertical: isH ? theme.spacing(spacing) : 0,
        marginHorizontal: isH ? 0 : theme.spacing(spacing),
      }}
    />
  );
}
