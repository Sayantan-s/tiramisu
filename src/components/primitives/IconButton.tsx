import { ActivityIndicator, Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Icon, type IconName } from './Icon';
import type { ButtonVariant, ButtonSize } from './Button';

export type IconButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  /** Icon to render. */
  icon: IconName;
  /** Required for screen readers — describes the action. */
  accessibilityLabel: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

const DIMENSIONS: Record<ButtonSize, { box: number; icon: number }> = {
  sm: { box: 32, icon: 16 },
  md: { box: 40, icon: 20 },
  lg: { box: 48, icon: 24 },
};

/** Map each variant to its background / foreground / border colors. */
function useVariantTokens(variant: ButtonVariant) {
  const { colors } = useTheme();
  switch (variant) {
    case 'secondary':
      return { bg: colors.secondary, fg: colors.secondaryForeground, border: undefined };
    case 'outline':
      return { bg: 'transparent', fg: colors.foreground, border: colors.border };
    case 'ghost':
      return { bg: 'transparent', fg: colors.foreground, border: undefined };
    case 'destructive':
    case 'danger':
      return { bg: colors.destructive, fg: colors.destructiveForeground, border: undefined };
    case 'primary':
    default:
      return { bg: colors.primary, fg: colors.primaryForeground, border: undefined };
  }
}

/**
 * A square, icon-only button. Shares Button's variants and sizes. Always pass an
 * `accessibilityLabel` since there is no visible text.
 *
 * @example
 * <IconButton icon="plus" accessibilityLabel="Add expense" />
 * <IconButton icon="trash" variant="destructive" accessibilityLabel="Delete" />
 */
export function IconButton({
  icon,
  accessibilityLabel,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  style,
  ...rest
}: IconButtonProps) {
  const theme = useTheme();
  const { bg, fg, border } = useVariantTokens(variant);
  const dims = DIMENSIONS[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      {...rest}
      style={({ pressed }) => [
        {
          width: dims.box,
          height: dims.box,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          borderWidth: border ? 1 : 0,
          borderColor: border,
          borderRadius: theme.radii.pill,
          opacity: isDisabled ? 0.4 : pressed ? 0.85 : 1,
        },
        style,
      ]}>
      {loading ? <ActivityIndicator color={fg} size="small" /> : <Icon name={icon} size={dims.icon} color={fg} />}
    </Pressable>
  );
}
