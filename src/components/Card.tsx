import { View, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';

export type CardProps = ViewProps & {
  variant?: 'elevated' | 'muted' | 'outlined';
  padding?: number;
};

export function Card({ variant = 'elevated', padding = 4, style, ...rest }: CardProps) {
  const theme = useTheme();
  const styleByVariant: ViewStyle =
    variant === 'muted'
      ? { backgroundColor: theme.colors.bgMuted }
      : variant === 'outlined'
        ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.border }
        : { backgroundColor: theme.colors.bgElevated };

  return (
    <View
      style={[
        {
          borderRadius: theme.radii.lg,
          padding: theme.spacing(padding),
        },
        styleByVariant,
        style,
      ]}
      {...rest}
    />
  );
}
