import { View, type ViewProps } from 'react-native';
import { useTheme } from '../../theme';
import type { ThemeColors } from '../../theme';
import { Text } from './Text';
import { Icon, type IconName } from './Icon';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'info' | 'error';
export type BadgeAppearance = 'soft' | 'solid';

export type BadgeProps = ViewProps & {
  label: string;
  tone?: BadgeTone;
  /** `soft` = tinted surface (default). `solid` = filled brand/neutral/error. */
  appearance?: BadgeAppearance;
  /** Optional leading icon. */
  icon?: IconName;
};

/** Resolve background + foreground color tokens for a tone/appearance pair. */
function resolveColors(
  colors: ThemeColors,
  tone: BadgeTone,
  appearance: BadgeAppearance,
): { bg: string; fg: string } {
  if (appearance === 'solid') {
    switch (tone) {
      case 'primary':
        return { bg: colors.primary, fg: colors.primaryForeground };
      case 'error':
        return { bg: colors.destructive, fg: colors.destructiveForeground };
      case 'neutral':
        return { bg: colors.secondary, fg: colors.secondaryForeground };
      // success/warning/info have no saturated token — fall through to soft.
      default:
        break;
    }
  }
  switch (tone) {
    case 'primary':
      return { bg: colors.muted, fg: colors.primary };
    case 'success':
      return { bg: colors.success, fg: colors.successForeground };
    case 'warning':
      return { bg: colors.warning, fg: colors.warningForeground };
    case 'info':
      return { bg: colors.info, fg: colors.infoForeground };
    case 'error':
      return { bg: colors.error, fg: colors.errorForeground };
    case 'neutral':
    default:
      return { bg: colors.muted, fg: colors.mutedForeground };
  }
}

/**
 * A small status pill for labels, counts, and statuses.
 *
 * @example
 * <Badge label="Settled" tone="success" />
 * <Badge label="3 new" tone="primary" appearance="solid" />
 */
export function Badge({ label, tone = 'neutral', appearance = 'soft', icon, style, ...rest }: BadgeProps) {
  const theme = useTheme();
  const { bg, fg } = resolveColors(theme.colors, tone, appearance);
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          gap: theme.spacing(1),
          backgroundColor: bg,
          paddingVertical: theme.spacing(1),
          paddingHorizontal: theme.spacing(2),
          borderRadius: theme.radii.pill,
        },
        style,
      ]}
      {...rest}>
      {icon ? <Icon name={icon} size={13} color={fg} /> : null}
      <Text variant="caption" weight="600" style={{ color: fg }}>
        {label}
      </Text>
    </View>
  );
}
