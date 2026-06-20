import { View } from 'react-native';
import { useTheme } from '../../theme';
import { Text } from './Text';

export type AvatarMember = {
  id: string;
  name: string;
  /** An emoji or single character to display instead of initials. */
  avatar?: string | null;
};

/** Deterministic pastel backgrounds keyed off the member id. */
const PALETTE = ['#E5A26A', '#7CC9A6', '#F58E84', '#A5C8E5', '#D2B48C', '#C19EE0'];

/** Dark ink that stays legible on every pastel in PALETTE. */
const INK = '#1B1A17';

const initial = (name: string): string => name.trim().charAt(0).toUpperCase() || '?';

const colorFor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
};

export type AvatarProps = {
  member: AvatarMember;
  /** Diameter in pixels. */
  size?: number;
  /** Draw a brand-colored ring around the avatar. */
  ring?: boolean;
};

/**
 * A circular member avatar. Shows the member's emoji if present, otherwise their
 * initial on a color deterministically derived from their id.
 *
 * @example
 * <Avatar member={{ id: 'u1', name: 'Aanya' }} size={40} ring />
 */
export function Avatar({ member, size = 36, ring = false }: AvatarProps) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colorFor(member.id),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: ring ? 2 : 0,
        borderColor: ring ? theme.colors.primary : 'transparent',
      }}>
      {member.avatar ? (
        <Text style={{ fontSize: size * 0.5 }}>{member.avatar}</Text>
      ) : (
        <Text weight="700" style={{ fontSize: size * 0.42, color: INK }}>
          {initial(member.name)}
        </Text>
      )}
    </View>
  );
}
