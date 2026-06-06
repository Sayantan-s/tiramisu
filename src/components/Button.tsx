import { Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const padV = size === 'lg' ? theme.spacing(4) : size === 'sm' ? theme.spacing(2) : theme.spacing(3);
  const padH = size === 'lg' ? theme.spacing(6) : size === 'sm' ? theme.spacing(3) : theme.spacing(4);

  const bg =
    variant === 'primary'
      ? theme.colors.accent
      : variant === 'secondary'
        ? theme.colors.accentMuted
        : variant === 'danger'
          ? theme.colors.danger
          : 'transparent';
  const color =
    variant === 'primary' || variant === 'danger'
      ? theme.colors.textInverse
      : variant === 'secondary'
        ? theme.colors.text
        : theme.colors.accent;

  return (
    <Pressable
      {...rest}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          paddingVertical: padV,
          paddingHorizontal: padH,
          borderRadius: theme.radii.pill,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}>
      <Text style={{ color, fontWeight: '700' }}>{title}</Text>
    </Pressable>
  );
}
