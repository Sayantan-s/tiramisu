import { Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

export type ChipProps = Omit<PressableProps, 'style' | 'children'> & {
  label: string;
  /** Selected chips fill with the brand color. */
  selected?: boolean;
  icon?: IconName;
  disabled?: boolean;
  style?: ViewStyle;
};

/**
 * A selectable pill — used for filters and single/multi choice rows.
 *
 * @example
 * <Chip label="Groceries" selected={filter === 'groceries'} onPress={pick} />
 */
export function Chip({ label, selected = false, icon, disabled, style, ...rest }: ChipProps) {
  const theme = useTheme();
  const bg = selected ? theme.colors.primary : theme.colors.muted;
  const fg = selected ? theme.colors.primaryForeground : theme.colors.foreground;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      {...rest}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: theme.spacing(1),
          backgroundColor: bg,
          borderWidth: selected ? 0 : 1,
          borderColor: theme.colors.border,
          paddingVertical: theme.spacing(2),
          paddingHorizontal: theme.spacing(3),
          borderRadius: theme.radii.pill,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
        style,
      ]}>
      {icon ? <Icon name={icon} size={15} color={fg} /> : null}
      <Text variant="caption" weight="600" style={{ color: fg }}>
        {label}
      </Text>
    </Pressable>
  );
}
