import { View } from 'react-native';
import { useTheme } from '../../theme';

export type ProgressProps = {
  /** Completion ratio, 0–1. Values outside the range are clamped. */
  value: number;
  /** Bar thickness in pixels. */
  height?: number;
  /** Fill color token. Defaults to `primary`. */
  tone?: 'primary' | 'success' | 'destructive';
};

const clamp = (n: number) => Math.max(0, Math.min(1, n));

/**
 * A determinate progress bar.
 *
 * @example
 * <Progress value={0.65} />
 * <Progress value={paid / total} tone="success" />
 */
export function Progress({ value, height = 8, tone = 'primary' }: ProgressProps) {
  const theme = useTheme();
  const fill = tone === 'success' ? theme.colors.successForeground : tone === 'destructive' ? theme.colors.destructive : theme.colors.primary;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 1, now: clamp(value) }}
      style={{ height, borderRadius: theme.radii.pill, backgroundColor: theme.colors.muted, overflow: 'hidden' }}>
      <View style={{ width: `${clamp(value) * 100}%`, height: '100%', borderRadius: theme.radii.pill, backgroundColor: fill }} />
    </View>
  );
}
