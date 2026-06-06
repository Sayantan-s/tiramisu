import { View } from 'react-native';
import { useTheme } from '../theme';
import { Text } from './Text';
import type { Member } from '../lib/split/types';

const PALETTE = ['#E5A26A', '#7CC9A6', '#F58E84', '#A5C8E5', '#D2B48C', '#C19EE0'];

const initial = (name: string): string => name.trim().charAt(0).toUpperCase() || '?';

const colorFor = (id: string): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
};

export type AvatarProps = {
  member: Pick<Member, 'id' | 'name' | 'avatar'>;
  size?: number;
  ring?: boolean;
};

export function Avatar({ member, size = 36, ring = false }: AvatarProps) {
  const theme = useTheme();
  const bg = colorFor(member.id);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: ring ? 2 : 0,
        borderColor: ring ? theme.colors.accent : 'transparent',
      }}>
      {member.avatar ? (
        <Text style={{ fontSize: size * 0.5 }}>{member.avatar}</Text>
      ) : (
        <Text style={{ fontSize: size * 0.42, color: '#1B1A17', fontWeight: '700' }}>
          {initial(member.name)}
        </Text>
      )}
    </View>
  );
}
