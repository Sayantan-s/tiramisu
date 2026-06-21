import { Image, Pressable, View, type ImageSourcePropType } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from '../../components';
import { Icon } from '../../components';

/** Brand marketing-card colors — fixed in both themes, matching the Pencil designs. */
const PROMO_BG = '#003322';
const PROMO_SUB = '#FDE2D9';

/**
 * Top bar shared by the Phone and OTP auth screens: a 44px back button (muted
 * square) and a right-aligned step label.
 */
export function AuthTopBar({ step, onBack }: { step: string; onBack: () => void }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={({ pressed }) => ({
          width: 44,
          height: 44,
          borderRadius: theme.radii.md,
          backgroundColor: theme.colors.muted,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.7 : 1,
        })}>
        <Icon name="arrow-left" color="foreground" />
      </Pressable>
      <Text variant="caption" tone="muted" weight="600" style={{ letterSpacing: 1.6 }}>
        {step}
      </Text>
    </View>
  );
}

export type AccentPromoProps = {
  /** Big display title (rendered uppercase as in the design). */
  title: string;
  subtitle: string;
  /** Optional photo shown beside the text. */
  image?: ImageSourcePropType;
};

/**
 * The dark-green marketing card used on the Phone and OTP screens. Decorative —
 * its colors are intentionally fixed (not themed) to match the brand mockups.
 */
export function AccentPromo({ title, subtitle, image }: AccentPromoProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: theme.radii.lg,
        backgroundColor: PROMO_BG,
        overflow: 'hidden',
        minHeight: image ? 132 : undefined,
      }}>
      <View style={{ flex: image ? 1.3 : 1, padding: theme.spacing(5), justifyContent: 'flex-end', gap: theme.spacing(2) }}>
        <Text variant="title" weight="800" style={{ color: '#FFFFFF', textTransform: 'uppercase' }}>
          {title}
        </Text>
        <Text variant="caption" weight="500" style={{ color: PROMO_SUB, letterSpacing: 0.5 }}>
          {subtitle}
        </Text>
      </View>
      {image ? <Image source={image} resizeMode="cover" style={{ flex: 1 }} /> : null}
    </View>
  );
}
