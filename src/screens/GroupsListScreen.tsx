import { useEffect } from 'react';
import { Pressable, RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar, Button, Card, Screen, Stack, Text } from '../components';
import { useGroupsStore } from '../features/groups/store';
import { useAuthStore } from '../features/auth/store';
import { useTheme } from '../theme';
import type { ModeStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<ModeStackParamList>;

export function GroupsListScreen() {
  const nav = useNavigation<Nav>();
  const theme = useTheme();
  const { groups, loading, refresh, setActiveGroup } = useGroupsStore();
  const signOut = useAuthStore((s) => s.signOut);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const roomies = groups.filter((g) => g.kind === 'roomies');

  return (
    <Screen padded>
      <ScrollView
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.colors.accent} />}
        contentContainerStyle={{ gap: theme.spacing(5), paddingBottom: theme.spacing(12) }}>
        <Stack direction="row" justify="space-between" align="center">
          <Stack gap={1}>
            <Text variant="caption" tone="muted">
              ROOMIES
            </Text>
            <Text variant="title">Your households</Text>
          </Stack>
          <Pressable onPress={signOut}>
            <Text variant="caption" tone="muted">
              Sign out
            </Text>
          </Pressable>
        </Stack>

        {roomies.length === 0 && !loading ? (
          <Card padding={5} variant="muted">
            <Stack gap={2}>
              <Text variant="heading">No groups yet</Text>
              <Text variant="body" tone="muted">
                Create a new household or join one with an invite code.
              </Text>
            </Stack>
          </Card>
        ) : null}

        {roomies.map((g) => (
          <Pressable
            key={g.id}
            onPress={() => {
              setActiveGroup(g.id);
            }}>
            <Card padding={4}>
              <Stack direction="row" gap={3} align="center">
                <Text style={{ fontSize: 36 }}>{g.icon ?? '🏠'}</Text>
                <Stack gap={1} style={{ flex: 1 }}>
                  <Text variant="heading">{g.name}</Text>
                  <Text variant="caption" tone="muted">
                    {g.members.length} {g.members.length === 1 ? 'member' : 'members'}
                  </Text>
                </Stack>
                <Stack direction="row" gap={-2}>
                  {g.members.slice(0, 4).map((m) => (
                    <Avatar key={m.id} member={m} size={28} />
                  ))}
                </Stack>
              </Stack>
            </Card>
          </Pressable>
        ))}

        <Stack gap={3}>
          <Button title="+ Create a household" fullWidth onPress={() => nav.navigate('CreateGroup')} />
          <Button
            title="I have an invite code"
            variant="secondary"
            fullWidth
            onPress={() => nav.navigate('JoinGroup', {})}
          />
        </Stack>
      </ScrollView>
    </Screen>
  );
}
