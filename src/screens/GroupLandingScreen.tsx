import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar, Button, Card, Screen, Stack, Text } from '../components';
import { useAuthStore } from '../features/auth/store';
import { useGroupsStore } from '../features/groups/store';
import type { GroupStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<GroupStackParamList>;

/**
 * Temporary in-group landing screen until Phase 6 wires the existing
 * MainTabs (Home/Expenses/Scan/Settle) up to the server-backed stores.
 */
export function GroupLandingScreen() {
  const nav = useNavigation<Nav>();
  const { groups, activeGroupId, setActiveGroup, leaveGroup } = useGroupsStore();
  const me = useAuthStore((s) => s.user);
  const group = groups.find((g) => g.id === activeGroupId);

  if (!group) {
    return (
      <Screen padded>
        <Stack gap={3}>
          <Text variant="title">Group not found</Text>
          <Button title="Back" onPress={() => setActiveGroup(null)} />
        </Stack>
      </Screen>
    );
  }

  return (
    <Screen scrollable padded>
      <Stack gap={5}>
        <Pressable onPress={() => setActiveGroup(null)}>
          <Text variant="caption" tone="muted">
            ← All groups
          </Text>
        </Pressable>

        <Stack gap={2}>
          <Text style={{ fontSize: 48 }}>{group.icon ?? '🏠'}</Text>
          <Text variant="title">{group.name}</Text>
          <Text variant="body" tone="muted">
            {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
          </Text>
        </Stack>

        <Card padding={4}>
          <Stack gap={3}>
            <Text variant="caption" tone="muted">
              MEMBERS
            </Text>
            {group.members.map((m) => (
              <Stack key={m.id} direction="row" gap={3} align="center">
                <Avatar member={m} size={32} />
                <Stack gap={0} style={{ flex: 1 }}>
                  <Text>{m.name}</Text>
                  <Text variant="caption" tone="muted">
                    {m.id === me?.id ? 'you' : m.role}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Card>

        <Button title="Invite roomies" fullWidth onPress={() => nav.navigate('InvitePeople')} />

        <Card padding={4} variant="muted">
          <Stack gap={2}>
            <Text weight="700">Expenses, settle-up, and the chat-style feed</Text>
            <Text variant="body" tone="muted">
              Coming in the next slice — the existing screens get re-wired to live data here.
            </Text>
          </Stack>
        </Card>

        <Button
          title="Leave group"
          variant="danger"
          fullWidth
          onPress={async () => {
            if (activeGroupId) await leaveGroup(activeGroupId);
          }}
        />
      </Stack>
    </Screen>
  );
}
