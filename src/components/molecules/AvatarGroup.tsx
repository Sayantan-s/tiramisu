import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Avatar, type AvatarMember } from '../primitives/Avatar';
import { Text } from '../primitives/Text';

export type AvatarGroupProps = {
  members: AvatarMember[];
  /** Avatar diameter. */
  size?: number;
  /** Show at most this many; the rest become a `+N` chip. */
  max?: number;
};

/**
 * A horizontal stack of overlapping avatars with a `+N` overflow badge.
 *
 * @example
 * <AvatarGroup members={group.members} max={4} />
 */
export function AvatarGroup({ members, size = 36, max = 4 }: AvatarGroupProps) {
  const theme = useTheme();
  const shown = members.slice(0, max);
  const overflow = members.length - shown.length;
  const overlap = size * 0.35;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {shown.map((member, i) => (
        <View
          key={member.id}
          style={{
            marginLeft: i === 0 ? 0 : -overlap,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: theme.colors.background,
          }}>
          <Avatar member={member} size={size} />
        </View>
      ))}
      {overflow > 0 ? (
        <View
          style={{
            marginLeft: -overlap,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.colors.muted,
            borderWidth: 2,
            borderColor: theme.colors.background,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text variant="caption" weight="700" tone="muted">
            +{overflow}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
