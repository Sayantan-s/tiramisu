import { ActivityIndicator, Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  /** @deprecated use `destructive` */
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'style' | 'children'> & {
  /** Button label. */
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon shown before the label. */
  leadingIcon?: IconName;
  /** Icon shown after the label. */
  trailingIcon?: IconName;
  /** Show a spinner and block presses. */
  loading?: boolean;
  /** Stretch to the container width. */
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

type Tokens = { bg: string; fg: string; border?: string };

/** Map each variant to its background / foreground / border colors. */
function useVariantTokens(variant: ButtonVariant): Tokens {
  const { colors } = useTheme();
  switch (variant) {
    case 'secondary':
      return { bg: colors.secondary, fg: colors.secondaryForeground };
    case 'outline':
      return { bg: 'transparent', fg: colors.foreground, border: colors.border };
    case 'ghost':
      return { bg: 'transparent', fg: colors.foreground };
    case 'destructive':
    case 'danger':
      return { bg: colors.destructive, fg: colors.destructiveForeground };
    case 'primary':
    default:
      return { bg: colors.primary, fg: colors.primaryForeground };
  }
}

const SIZES: Record<ButtonSize, { padV: number; padH: number; icon: number }> = {
  sm: { padV: 2, padH: 3, icon: 16 },
  md: { padV: 3, padH: 4, icon: 18 },
  lg: { padV: 4, padH: 6, icon: 20 },
};

/**
 * Primary call-to-action button. Pill-shaped, themed, with optional leading /
 * trailing icons and a loading state.
 *
 * @example
 * <Button title="Add expense" leadingIcon="plus" onPress={add} />
 * <Button title="Delete" variant="destructive" loading={deleting} />
 */
export function Button({
  title,
  variant = 'primary',
  size = 'md',
  leadingIcon,
  trailingIcon,
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const { bg, fg, border } = useVariantTokens(variant);
  const dims = SIZES[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      {...rest}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing(2),
          backgroundColor: bg,
          borderWidth: border ? 1 : 0,
          borderColor: border,
          paddingVertical: theme.spacing(dims.padV),
          paddingHorizontal: theme.spacing(dims.padH),
          borderRadius: theme.radii.pill,
          opacity: isDisabled ? 0.4 : pressed ? 0.85 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <>
          {leadingIcon ? <Icon name={leadingIcon} size={dims.icon} color={fg} /> : null}
          <Text variant="label" weight="700" style={{ color: fg }}>
            {title}
          </Text>
          {trailingIcon ? <Icon name={trailingIcon} size={dims.icon} color={fg} /> : null}
        </>
      )}
    </Pressable>
  );
}
