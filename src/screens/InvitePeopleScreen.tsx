import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Share, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen, Stack, Text } from '../components';
import { Endpoints, type InviteDto } from '../lib/api';
import { buildInviteUrl } from '../lib/deeplinks';
import { useGroupsStore } from '../features/groups/store';
import { useTheme } from '../theme';

export function InvitePeopleScreen() {
  const nav = useNavigation();
  const theme = useTheme();
  const { groups, activeGroupId } = useGroupsStore();
  const group = groups.find((g) => g.id === activeGroupId);

  const [invite, setInvite] = useState<InviteDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!group) return;
    Endpoints.invites
      .create(group.id, {})
      .then(setInvite)
      .catch((e) => setError((e as Error).message));
  }, [group]);

  if (!group) {
    return (
      <Screen padded>
        <Stack gap={3}>
          <Text variant="title">No group</Text>
          <Button title="Back" onPress={() => nav.goBack()} />
        </Stack>
      </Screen>
    );
  }

  const code = invite?.code ?? null;
  const url = code ? buildInviteUrl(code) : null;

  const share = async () => {
    if (!url) return;
    await Share.share({
      message: `Join "${group.name}" on Tiramisu: ${url}\n(or use code ${code})`,
    });
  };

  return (
    <Screen padded>
      <Stack gap={5}>
        <Pressable onPress={() => nav.goBack()}>
          <Text variant="caption" tone="muted">
            ← Back
          </Text>
        </Pressable>
        <Stack gap={2}>
          <Text variant="title">Invite roomies</Text>
          <Text variant="body" tone="muted">
            Share this link or code with your flatmates. The link opens straight into the join
            screen.
          </Text>
        </Stack>

        <Card padding={5}>
          <Stack gap={3} align="center">
            {error ? (
              <Text tone="danger">{error}</Text>
            ) : !code ? (
              <ActivityIndicator color={theme.colors.accent} />
            ) : (
              <>
                <Text variant="caption" tone="muted">
                  INVITE CODE
                </Text>
                <Text style={{ fontSize: 40, letterSpacing: 6, fontWeight: '800' }}>{code}</Text>
                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.colors.divider,
                    alignSelf: 'stretch',
                  }}
                />
                <Text variant="caption" tone="muted">
                  OR LINK
                </Text>
                <Text variant="body" tone="muted" numberOfLines={1}>
                  {url}
                </Text>
              </>
            )}
          </Stack>
        </Card>

        <Button title="Share via…" fullWidth disabled={!url} onPress={share} />
      </Stack>
    </Screen>
  );
}
